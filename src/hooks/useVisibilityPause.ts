import { useEffect, useRef, useState } from "react";

export function useVisibilityPause<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) setVisible(entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}
