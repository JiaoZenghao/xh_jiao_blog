/** Add each staggered card's position-driven animation.
 * @param {import('animejs').Timeline} timeline
 * @param {Iterable<object>} cards
 */
export function addStageCards(timeline, cards) {
  [...cards].forEach((card, index) => {
    const start = 300 + index * 100;
    const hold = 750 - start - 250;
    // A single continuous track owns each property, including its hold interval.
    // Separate entrance/exit animations leave AUTO seeks in the gap history-dependent.
    const track = (from, settled, end) => [
      { from, to: settled, duration: 250 },
      ...(hold > 0 ? [{ to: settled, duration: hold }] : []),
      { to: end, duration: 250 },
    ];
    timeline.add(card, {
      y: track(48, 0, -8),
      scale: track(0.92, 1, 0.98),
      rotate: { from: (index - 1) * 5, to: 0, duration: 250 },
      opacity: { from: 0, to: 1, duration: 250 },
    }, start);
  });
}
