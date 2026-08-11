/** Centralized device-pixel-ratio clamp so every canvas caps the same way. */
export function getDpr(cap = 2) {
  return Math.min(window.devicePixelRatio || 1, cap);
}
