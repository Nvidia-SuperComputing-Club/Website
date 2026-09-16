import { findMoov, parseMoov } from './mp4Demux.js';

/**
 * Scroll-driven video scrubbing, decoded with WebCodecs. Runs inside a Web
 * Worker (see frameScrubber.worker.js) and draws to an OffscreenCanvas, so
 * none of this work touches the page's main thread.
 *
 * Seeking a <video> element on every scroll tick is slow: each seek goes
 * through the media pipeline and re-decodes from the previous keyframe, so
 * the browser drops most of them and the animation stutters. Instead we:
 *
 *  1. stream the MP4 and demux it ourselves (frames become usable as soon as
 *     their bytes arrive — no waiting for the whole file),
 *  2. feed whole GOPs (keyframe groups) to a VideoDecoder, look-ahead first
 *     in the scroll direction, converting output frames to ImageBitmaps,
 *  3. keep a small window of decoded GOPs around the playhead, so showing a
 *     frame is a single drawImage().
 */

const nextFrame = (cb) =>
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame(cb) : setTimeout(cb, 16);

export class FrameScrubber {
  constructor({ canvas, src, onFirstFrame, onError, maxCachedGops = 4 }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.src = src;
    this.onFirstFrame = onFirstFrame;
    this.onError = onError;
    this.maxCachedGops = maxCachedGops;

    this.bytes = new Uint8Array(0);
    this.loaded = 0;
    this.info = null;
    this.decoder = null;
    this.ready = false;
    this.destroyed = false;
    this.failed = false;

    this.size = null; // { width, height, dpr } of the canvas element in CSS px
    this.progress = 0;
    this.direction = 1;
    this.targetFrame = 0;
    this.drawnFrame = -1;
    this.frames = new Map(); // frame index -> ImageBitmap
    this.fedGops = new Set(); // GOPs sent to the decoder (decoded or in flight)
    this.busy = false;
    this.drawScheduled = false;

    this.abort = new AbortController();
    this.load().catch((err) => this.fail(err));
  }

  /* ── Public API ─────────────────────────────────────────────────────── */

  setProgress(p) {
    const clamped = Math.max(0, Math.min(1, p));
    if (clamped !== this.progress) this.direction = clamped > this.progress ? 1 : -1;
    this.progress = clamped;
    if (!this.info) return;
    this.targetFrame = Math.round(clamped * (this.info.frameCount - 1));
    this.draw();
    this.pump();
  }

  setSize(width, height, dpr) {
    this.size = { width, height, dpr };
    this.applySize();
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    clearTimeout(this.flushTimer);
    if (this.decoder && this.decoder.state !== 'closed') this.decoder.close();
    this.frames.forEach((bmp) => bmp.close());
    this.frames.clear();
    this.fedGops.clear();
  }

  /* ── Loading ────────────────────────────────────────────────────────── */

  async load() {
    const res = await fetch(this.src, { signal: this.abort.signal });
    if (!res.ok) throw new Error(`hero video: HTTP ${res.status}`);

    const encoded = res.headers.get('content-encoding');
    const length = encoded ? 0 : Number(res.headers.get('content-length')) || 0;
    this.bytes = new Uint8Array(length || 8 * 1024 * 1024);

    if (!res.body || !res.body.getReader) {
      this.append(new Uint8Array(await res.arrayBuffer()));
      return;
    }
    const reader = res.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done || this.destroyed) break;
      this.append(value);
    }
  }

  append(chunk) {
    const needed = this.loaded + chunk.length;
    if (needed > this.bytes.length) {
      const grown = new Uint8Array(Math.max(needed, this.bytes.length * 2));
      grown.set(this.bytes.subarray(0, this.loaded));
      this.bytes = grown;
    }
    this.bytes.set(chunk, this.loaded);
    this.loaded = needed;

    if (this.failed) return;
    if (!this.info) {
      const moov = findMoov(this.bytes, this.loaded);
      if (moov) this.init(moov).catch((err) => this.fail(err));
    } else {
      this.pump();
    }
  }

  async init(moov) {
    const info = parseMoov(this.bytes, moov);
    // Open GOPs reference the previous GOP, which breaks independent seeking.
    if (info.gops.some((g) => g.open)) throw new Error('hero video: open GOPs are not supported');
    this.info = info;
    this.timestampToFrame = new Map(info.samples.map((s) => [s.timestamp, s.frame]));

    const config = {
      codec: info.codec,
      description: info.description,
      codedWidth: info.width,
      codedHeight: info.height,
      optimizeForLatency: true,
    };
    const support = await VideoDecoder.isConfigSupported(config);
    if (!support.supported) throw new Error(`hero video: ${info.codec} not supported`);
    if (this.destroyed) return;

    this.decoder = new VideoDecoder({
      output: (frame) => this.handleFrame(frame),
      error: (err) => this.fail(err),
    });
    this.decoder.configure(config);
    this.ready = true;
    this.applySize();
    this.setProgress(this.progress);
  }

  /* ── Decoding ───────────────────────────────────────────────────────── */

  handleFrame(frame) {
    const index = this.timestampToFrame.get(frame.timestamp);
    const gop = index === undefined ? -1 : this.info.gopOfFrame[index];
    // Frames of GOPs evicted while still in the decoder are dropped.
    if (this.destroyed || !this.fedGops.has(gop)) return frame.close();

    // Convert and release the VideoFrame right away: holding decoder frames
    // starves hardware decoders of output buffers and slows decoding down.
    createImageBitmap(frame)
      .then((bmp) => {
        if (this.destroyed || !this.fedGops.has(gop)) return bmp.close();
        this.frames.get(index)?.close();
        this.frames.set(index, bmp);
        this.scheduleDraw();
      })
      .catch((err) => this.fail(err))
      .finally(() => frame.close());
  }

  gopLoaded(g) {
    const { samples, gops } = this.info;
    const last = samples[gops[g].end - 1];
    return last.offset + last.size <= this.loaded;
  }

  /** GOPs worth having decoded: the playhead's, look-ahead in scroll direction, one behind. */
  wantedGops() {
    const { gops, gopOfFrame } = this.info;
    const current = gopOfFrame[this.targetFrame];
    const d = this.direction;
    const wanted = [current];
    for (let i = 1; i < this.maxCachedGops - 1; i++) wanted.push(current + i * d);
    wanted.push(current - d);
    return wanted.filter((g) => g >= 0 && g < gops.length);
  }

  /**
   * Feeds wanted GOPs to the decoder. Every GOP starts with an IDR frame, so
   * GOPs can be fed back-to-back in any order without flushing — flush()
   * resets hardware decoders and is ~6x slower than continuous decoding.
   */
  async pump() {
    if (this.busy || !this.ready || this.destroyed || this.failed) return;
    this.busy = true;
    try {
      for (const g of this.wantedGops()) {
        if (this.destroyed || this.fedGops.has(g)) continue;
        if (!this.gopLoaded(g)) break; // wait for bytes rather than skipping ahead
        this.feedGop(g);
        this.evict();
        if (this.decoder.decodeQueueSize > 16) await this.dequeued();
      }
    } catch (err) {
      this.fail(err);
    } finally {
      this.busy = false;
    }
    // Decoders hold back the last few frames for reordering until more data
    // arrives. If the playhead's frame is stuck there, flush — but only once
    // things are idle, since a flush stalls the decoder.
    clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => this.flushIfStuck(), 150);
  }

  feedGop(g) {
    const { samples, gops } = this.info;
    this.fedGops.add(g);
    for (let i = gops[g].start; i < gops[g].end; i++) {
      const s = samples[i];
      this.decoder.decode(
        new EncodedVideoChunk({
          type: s.key ? 'key' : 'delta',
          timestamp: s.timestamp,
          data: this.bytes.subarray(s.offset, s.offset + s.size),
        }),
      );
    }
  }

  dequeued() {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, 16);
      this.decoder.addEventListener?.('dequeue', () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
    });
  }

  async flushIfStuck() {
    if (this.busy || !this.ready || this.destroyed || this.failed) return;
    const gop = this.info.gopOfFrame[this.targetFrame];
    if (this.frames.has(this.targetFrame) || !this.fedGops.has(gop)) return;
    if (this.decoder.decodeQueueSize > 0) return;
    this.busy = true;
    try {
      await this.decoder.flush();
    } catch (err) {
      this.fail(err);
    } finally {
      this.busy = false;
    }
    this.pump();
  }

  /** Drop the GOPs farthest from the playhead once over budget. */
  evict() {
    const { gops, gopOfFrame } = this.info;
    const current = gopOfFrame[this.targetFrame];
    const wanted = new Set(this.wantedGops());
    const cost = (g) => Math.abs(g - current) + (wanted.has(g) ? 0 : gops.length);
    while (this.fedGops.size > this.maxCachedGops) {
      let worst = -1;
      this.fedGops.forEach((g) => {
        if (worst === -1 || cost(g) > cost(worst)) worst = g;
      });
      this.dropGop(worst);
    }
  }

  dropGop(g) {
    const { gops, samples } = this.info;
    this.fedGops.delete(g);
    for (let i = gops[g].start; i < gops[g].end; i++) {
      const frame = samples[i].frame;
      this.frames.get(frame)?.close();
      this.frames.delete(frame);
    }
  }

  /* ── Rendering ──────────────────────────────────────────────────────── */

  /** Coalesce draws triggered by decoder output into the next animation frame. */
  scheduleDraw() {
    if (this.drawScheduled) return;
    this.drawScheduled = true;
    nextFrame(() => {
      this.drawScheduled = false;
      if (!this.destroyed) this.draw();
    });
  }

  draw(force = false) {
    if (!this.info || this.frames.size === 0) return;

    let index = this.targetFrame;
    if (!this.frames.has(index)) {
      // Not decoded yet: show the closest frame we have instead of freezing.
      let best = Infinity;
      this.frames.forEach((_, i) => {
        if (Math.abs(i - this.targetFrame) < Math.abs(best - this.targetFrame)) best = i;
      });
      index = best;
    }
    if (index === this.drawnFrame && !force) return;

    const bmp = this.frames.get(index);
    const { width: cw, height: ch } = this.canvas;
    const scale = Math.max(cw / bmp.width, ch / bmp.height); // object-fit: cover
    const dw = bmp.width * scale;
    const dh = bmp.height * scale;
    this.ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

    const first = this.drawnFrame === -1;
    this.drawnFrame = index;
    if (first) this.onFirstFrame?.();
  }

  applySize() {
    if (!this.size || !this.size.width || !this.size.height) return;
    const { width: w, height: h } = this.size;
    // Never allocate more canvas pixels than the video can fill: beyond the
    // source resolution, extra backing pixels cost fill-rate and add no detail.
    let dpr = Math.min(this.size.dpr || 1, 2);
    if (this.info) {
      const cover = Math.max(w / this.info.width, h / this.info.height);
      dpr = Math.max(1, Math.min(dpr, 1 / cover));
    }
    const pw = Math.round(w * dpr);
    const ph = Math.round(h * dpr);
    if (this.canvas.width === pw && this.canvas.height === ph) return;
    this.canvas.width = pw;
    this.canvas.height = ph;
    this.draw(true);
  }

  fail(err) {
    if (this.failed || this.destroyed || err?.name === 'AbortError') return;
    this.failed = true;
    console.warn('FrameScrubber disabled, falling back to <video>:', err);
    this.onError?.(err);
  }
}
