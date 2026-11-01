import { createTimeline } from 'animejs';
import { primeStageTimeline } from './scroll-stage.mjs';

/** A finite, position-driven version of the shared orbit visual.
 * Targets belong to one MotionScene; no selectors or automatic playback here.
 * @param {{ outer: object, inner: object, orbit: object, grid: object, cells: Iterable<object> }} targets
 * @param {object} [callbacks] Optional engine callbacks (seek callers mute them).
 * @returns {import('animejs').Timeline}
 */
export function createScrollOrbit({ outer, inner, orbit, grid, cells }, callbacks = {}) {
  const timeline = createTimeline({ ...callbacks, autoplay: false, loop: false, defaults: { ease: 'linear' } });
  try {
    timeline.add(outer, { rotate: [0, 270], duration: 1000 }, 0)
      .add(inner, { rotate: [0, -180], duration: 1000 }, 0)
      .add(orbit, { rotate: [0, 360], duration: 1000 }, 0)
      .add(grid, { rotate: [0, 0, 90, 90, 180], duration: 1000 }, 0);
    [...cells].forEach((cell, index) => {
      const column = index % 11 - 5;
      const row = Math.floor(index / 11) - 5;
      const delay = Math.hypot(column, row) / Math.hypot(5, 5) * 100;
      // Each property has one continuous owner, including delayed starts and
      // hold intervals. Separate children in those gaps make AUTO seeks depend
      // on traversal history. The last arrangement is finite, not a loop reset.
      const track = (start, formed, circle, end) => [
        ...(delay ? [{ from: start, to: start, duration: delay }] : []),
        { from: start, to: formed, duration: 300 - delay },
        { to: formed, duration: 100 },
        { to: circle, duration: 250 },
        { to: circle, duration: 100 },
        { to: end, duration: 250 },
      ];
      timeline.add(cell, {
        scale: track(0.35, 1, 0.5, 0.85),
        opacity: track(0.3, 1, 0.8, 1),
        rotate: track(0, 90, 90, 180),
        borderRadius: track('0%', '0%', '50%', '0%'),
        x: track(0, 0, 0, column * 1.5),
        y: track(0, 0, 0, row * 1.5),
      }, 0);
    });
    primeStageTimeline(timeline);
    return timeline;
  } catch (error) {
    timeline.revert();
    throw error;
  }
}
