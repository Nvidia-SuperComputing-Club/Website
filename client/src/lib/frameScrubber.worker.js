import { FrameScrubber } from './frameScrubber.js';

/** Worker entry: owns the OffscreenCanvas and all decoding for the hero video. */
let scrubber = null;

self.onmessage = ({ data }) => {
  switch (data.type) {
    case 'init':
      scrubber = new FrameScrubber({
        canvas: data.canvas,
        src: data.src,
        maxCachedGops: data.maxCachedGops,
        onFirstFrame: () => self.postMessage({ type: 'first-frame' }),
        onError: (err) => self.postMessage({ type: 'error', message: String(err?.message || err) }),
      });
      break;
    case 'resize':
      scrubber?.setSize(data.width, data.height, data.dpr);
      break;
    case 'progress':
      scrubber?.setProgress(data.progress);
      break;
  }
};
