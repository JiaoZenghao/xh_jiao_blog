export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const getScrollProgress = (scrollY, scrollHeight, viewportHeight) => {
  const available = scrollHeight - viewportHeight;
  return available > 0 ? clamp(scrollY / available, 0, 1) : 0;
};

export const chooseActiveSection = (entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting);
  if (visible.length === 0) return null;
  return visible.reduce((best, entry) =>
    entry.intersectionRatio > best.intersectionRatio ? entry : best
  ).id;
};

export const getCardTilt = (pointerX, pointerY, rect, maxDegrees = 5) => {
  if (rect.width <= 0 || rect.height <= 0) return { rotateX: 0, rotateY: 0 };
  const normalizedX = ((pointerX - rect.left) / rect.width) * 2 - 1;
  const normalizedY = ((pointerY - rect.top) / rect.height) * 2 - 1;
  return {
    rotateX: clamp(-normalizedY * maxDegrees, -maxDegrees, maxDegrees) || 0,
    rotateY: clamp(normalizedX * maxDegrees, -maxDegrees, maxDegrees) || 0,
  };
};

export const getDisclosureState = (expanded) => ({
  expanded: !expanded,
  hidden: expanded,
});

export const getAdventureSelection = (adventures, selectedIndex) => ({
  featured: adventures[selectedIndex] ?? null,
  pressed: adventures.map((_, index) => index === selectedIndex),
});
