/**
 * Minimal MP4 (ISO-BMFF) demuxer for a single H.264 video track.
 *
 * Reads the `moov` box and produces a sample table that WebCodecs can consume
 * directly: byte offsets/sizes into the file, presentation timestamps, and the
 * keyframe structure (GOPs). Only what the hero scrubber needs is supported —
 * anything else throws so the caller can fall back to a plain <video>.
 */

const CONTAINERS = new Set(['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts', 'dinf']);

function readBoxes(view, start, end) {
  const boxes = [];
  let p = start;
  while (p + 8 <= end) {
    let size = view.getUint32(p);
    const type = String.fromCharCode(
      view.getUint8(p + 4), view.getUint8(p + 5), view.getUint8(p + 6), view.getUint8(p + 7),
    );
    let header = 8;
    if (size === 1) {
      size = Number(view.getBigUint64(p + 8));
      header = 16;
    } else if (size === 0) {
      size = end - p;
    }
    if (size < header) break;
    boxes.push({ type, start: p, body: p + header, end: p + size });
    p += size;
  }
  return boxes;
}

function child(view, box, type) {
  return readBoxes(view, box.body, box.end).find((b) => b.type === type) || null;
}

function path(view, box, types) {
  let cur = box;
  for (const t of types) {
    cur = cur && child(view, cur, t);
  }
  return cur;
}

/**
 * Scans top-level boxes in the bytes received so far.
 * Returns the byte range of `moov` once it is fully available, otherwise null.
 */
export function findMoov(bytes, length) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, length);
  let p = 0;
  while (p + 16 <= length) {
    let size = view.getUint32(p);
    const type = String.fromCharCode(bytes[p + 4], bytes[p + 5], bytes[p + 6], bytes[p + 7]);
    if (size === 1) size = Number(view.getBigUint64(p + 8));
    if (size === 0) return null;
    if (type === 'moov') return p + size <= length ? { start: p, end: p + size } : null;
    p += size;
  }
  return null;
}

/**
 * Parses a complete `moov` box.
 * @param {Uint8Array} bytes buffer containing the moov box
 * @param {{start:number,end:number}} moov byte range of the moov box within `bytes`
 */
export function parseMoov(bytes, moov) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const moovBox = { type: 'moov', start: moov.start, body: moov.start + 8, end: moov.end };

  const trak = readBoxes(view, moovBox.body, moovBox.end)
    .filter((b) => b.type === 'trak')
    .find((t) => {
      const hdlr = path(view, t, ['mdia', 'hdlr']);
      if (!hdlr) return false;
      const h = hdlr.body + 8;
      return String.fromCharCode(bytes[h], bytes[h + 1], bytes[h + 2], bytes[h + 3]) === 'vide';
    });
  if (!trak) throw new Error('mp4: no video track');

  const mdhd = path(view, trak, ['mdia', 'mdhd']);
  const timescale = view.getUint32(mdhd.body + (bytes[mdhd.body] === 1 ? 20 : 12));

  const stbl = path(view, trak, ['mdia', 'minf', 'stbl']);
  const get = (t) => child(view, stbl, t);

  // --- Codec configuration (avc1 + avcC) ---
  const stsd = get('stsd');
  const entry = readBoxes(view, stsd.body + 8, stsd.end)[0];
  if (!entry || (entry.type !== 'avc1' && entry.type !== 'avc3')) {
    throw new Error(`mp4: unsupported codec ${entry && entry.type}`);
  }
  const width = view.getUint16(entry.body + 24);
  const height = view.getUint16(entry.body + 26);
  // VisualSampleEntry fixed fields are 78 bytes; child boxes (avcC, pasp, ...) follow.
  const avcC = readBoxes(view, entry.body + 78, entry.end).find((b) => b.type === 'avcC');
  if (!avcC) throw new Error('mp4: missing avcC');
  const description = bytes.slice(avcC.body, avcC.end);
  const hex = (n) => n.toString(16).padStart(2, '0');
  const codec = `avc1.${hex(description[1])}${hex(description[2])}${hex(description[3])}`;

  // --- Sample sizes ---
  const stsz = get('stsz');
  const constantSize = view.getUint32(stsz.body + 4);
  const count = view.getUint32(stsz.body + 8);
  const sizes = new Uint32Array(count);
  for (let i = 0; i < count; i++) {
    sizes[i] = constantSize || view.getUint32(stsz.body + 12 + i * 4);
  }

  // --- Chunk offsets + sample-to-chunk -> per-sample byte offsets ---
  const stco = get('stco');
  const co64 = get('co64');
  const chunkBox = stco || co64;
  const chunkCount = view.getUint32(chunkBox.body + 4);
  const chunkOffsets = new Array(chunkCount);
  for (let i = 0; i < chunkCount; i++) {
    chunkOffsets[i] = co64
      ? Number(view.getBigUint64(chunkBox.body + 8 + i * 8))
      : view.getUint32(chunkBox.body + 8 + i * 4);
  }

  const stsc = get('stsc');
  const stscCount = view.getUint32(stsc.body + 4);
  const offsets = new Float64Array(count);
  let sample = 0;
  for (let e = 0; e < stscCount; e++) {
    const base = stsc.body + 8 + e * 12;
    const firstChunk = view.getUint32(base) - 1;
    const perChunk = view.getUint32(base + 4);
    const lastChunk = e + 1 < stscCount ? view.getUint32(base + 12) - 1 : chunkCount;
    for (let c = firstChunk; c < lastChunk && sample < count; c++) {
      let off = chunkOffsets[c];
      for (let s = 0; s < perChunk && sample < count; s++) {
        offsets[sample] = off;
        off += sizes[sample];
        sample++;
      }
    }
  }

  // --- Decode timestamps (stts) + composition offsets (ctts) ---
  const pts = new Float64Array(count);
  const stts = get('stts');
  let dts = 0;
  sample = 0;
  for (let e = 0, n = view.getUint32(stts.body + 4); e < n; e++) {
    const c = view.getUint32(stts.body + 8 + e * 8);
    const delta = view.getUint32(stts.body + 12 + e * 8);
    for (let i = 0; i < c && sample < count; i++) {
      pts[sample++] = dts;
      dts += delta;
    }
  }
  const ctts = get('ctts');
  if (ctts) {
    const signed = bytes[ctts.body] === 1;
    sample = 0;
    for (let e = 0, n = view.getUint32(ctts.body + 4); e < n; e++) {
      const c = view.getUint32(ctts.body + 8 + e * 8);
      const off = signed ? view.getInt32(ctts.body + 12 + e * 8) : view.getUint32(ctts.body + 12 + e * 8);
      for (let i = 0; i < c && sample < count; i++) pts[sample++] += off;
    }
  }

  // --- Keyframes (stss). Absent box means every sample is a sync sample. ---
  const isKey = new Uint8Array(count);
  const stss = get('stss');
  if (stss) {
    for (let e = 0, n = view.getUint32(stss.body + 4); e < n; e++) {
      isKey[view.getUint32(stss.body + 8 + e * 4) - 1] = 1;
    }
  } else {
    isKey.fill(1);
  }

  // Presentation order: frame index (what the scroll maps to) -> decode-order sample.
  const order = Array.from({ length: count }, (_, i) => i).sort((a, b) => pts[a] - pts[b]);
  const frameOfSample = new Uint32Array(count);
  order.forEach((s, frame) => { frameOfSample[s] = frame; });

  // GOPs in decode order. A GOP is "open" if it holds frames presented before
  // its keyframe — those reference the previous GOP, so it must be decoded too.
  const gops = [];
  for (let i = 0; i < count; i++) {
    if (!isKey[i] && i !== 0) continue;
    if (gops.length) gops[gops.length - 1].end = i;
    gops.push({ start: i, end: count, open: false });
  }
  const gopOfFrame = new Uint32Array(count);
  gops.forEach((g, gi) => {
    const keyPts = pts[g.start];
    for (let s = g.start; s < g.end; s++) {
      gopOfFrame[frameOfSample[s]] = gi;
      if (pts[s] < keyPts) g.open = true;
    }
  });

  const toMicros = (t) => Math.round((t * 1e6) / timescale);
  const samples = Array.from({ length: count }, (_, i) => ({
    offset: offsets[i],
    size: sizes[i],
    timestamp: toMicros(pts[i]),
    key: isKey[i] === 1,
    frame: frameOfSample[i],
  }));

  return { codec, description, width, height, frameCount: count, samples, gops, gopOfFrame };
}
