/**
 * Starts/stops a render loop based on both on-screen presence (IntersectionObserver)
 * and tab visibility (Page Visibility API), so demos stop costing frames the moment
 * nobody can see them.
 */
export function createVisibilityGate(el: Element, onStart: () => void, onStop: () => void) {
  let intersecting = false;

  function evaluate() {
    if (intersecting && document.visibilityState === "visible") onStart();
    else onStop();
  }

  const io = new IntersectionObserver(
    ([entry]) => {
      intersecting = entry?.isIntersecting ?? false;
      evaluate();
    },
    { threshold: 0.05 },
  );
  io.observe(el);
  document.addEventListener("visibilitychange", evaluate);

  return {
    disconnect() {
      io.disconnect();
      document.removeEventListener("visibilitychange", evaluate);
    },
  };
}
