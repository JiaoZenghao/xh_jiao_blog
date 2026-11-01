/** Map native document scroll to a history-independent, clamped stage position.
 * @param {number} scrollY
 * @param {number} top
 * @param {number} travel
 * @returns {number}
 */
export function stageProgress(scrollY, top, travel) {
  if (![scrollY, top, travel].every(Number.isFinite)) return 0;
  return travel <= 0 ? 0 : Math.min(1, Math.max(0, (scrollY - top) / travel));
}

/** Initialize the paused stage before its first position-driven render.
 * @param {import('animejs').Timeline} timeline
 */
export function primeStageTimeline(timeline) {
  // Anime.js seek uses AUTO rendering: future children still at time zero are
  // skipped on the first seek. Visit the end, then rewind, so every child's
  // explicit from-values are rendered before enhancement. Keep original value
  // snapshots intact for timeline.revert(), and never start playback/callbacks.
  timeline.seek(timeline.duration, true);
  timeline.seek(0, true);
}
