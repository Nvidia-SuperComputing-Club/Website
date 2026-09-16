/**
 * Main-thread handles for the scroll-scrubbed hero video. Both expose
 * `setProgress(p)` / `destroy()` so the page can drive either one.
 */

export function supportsWorkerScrubber() {
  return (
    typeof window !== 'undefined' &&
    'VideoDecoder' in window &&
    'OffscreenCanvas' in window &&
    typeof Worker === 'function' &&
    typeof HTMLCanvasElement.prototype.transferControlToOffscreen === 'function'
  );
}

/**
 * Creates a canvas inside `host`, hands it to a worker running FrameScrubber,
 * and forwards size and scroll progress to it. The canvas is created here
 * rather than by React because a canvas can only be transferred once.
 */
export class WorkerScrubber {
  constructor({ host, src, maxCachedGops, onFirstFrame, onError }) {
    this.progress = 0;
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'display:block;width:100%;height:100%';
    host.appendChild(this.canvas);

    const offscreen = this.canvas.transferControlToOffscreen();
    this.worker = new Worker(new URL('./frameScrubber.worker.js', import.meta.url), {
      type: 'module',
    });
    this.worker.onmessage = ({ data }) => {
      if (data.type === 'first-frame') onFirstFrame?.();
      else if (data.type === 'error') onError?.(new Error(data.message));
    };
    this.worker.onerror = (event) => {
      event.preventDefault?.();
      onError?.(new Error(event.message || 'hero video worker failed'));
    };
    this.worker.postMessage(
      { type: 'init', canvas: offscreen, src: new URL(src, location.href).href, maxCachedGops },
      [offscreen],
    );

    this.resizeObserver = new ResizeObserver(() => this.sendSize());
    this.resizeObserver.observe(this.canvas);
    this.sendSize();
  }

  sendSize() {
    this.worker.postMessage({
      type: 'resize',
      width: this.canvas.clientWidth,
      height: this.canvas.clientHeight,
      dpr: window.devicePixelRatio || 1,
    });
  }

  setProgress(p) {
    if (p === this.progress) return;
    this.progress = p;
    this.worker.postMessage({ type: 'progress', progress: p });
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.worker.terminate();
    this.canvas.remove();
  }
}

/**
 * Fallback for browsers without WebCodecs: seek a <video>, but never queue
 * seeks — always jump to the latest target once the previous seek lands.
 */
export class VideoSeekScrubber {
  constructor(video) {
    this.video = video;
    this.progress = 0;
    this.onSeeked = () => this.seek();
    video.addEventListener('seeked', this.onSeeked);
    video.addEventListener('loadedmetadata', this.onSeeked);
  }

  setProgress(p) {
    this.progress = Math.max(0, Math.min(1, p));
    if (!this.video.seeking) this.seek();
  }

  seek() {
    const { video } = this;
    if (!video.duration) return;
    const target = Math.min(this.progress, 0.999) * video.duration;
    if (Math.abs(video.currentTime - target) > 1 / 60) video.currentTime = target;
  }

  destroy() {
    this.video.removeEventListener('seeked', this.onSeeked);
    this.video.removeEventListener('loadedmetadata', this.onSeeked);
  }
}
