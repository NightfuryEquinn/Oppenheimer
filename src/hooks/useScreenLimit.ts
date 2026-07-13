import { useEffect, useState } from "react";

export const MIN_VIEWPORT_WIDTH = 1024;
const SCREEN_LIMIT_QUERY = `(max-width: ${MIN_VIEWPORT_WIDTH - 1}px)`;

export function useScreenLimit() {
  const [isLimited, setIsLimited] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(SCREEN_LIMIT_QUERY).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(SCREEN_LIMIT_QUERY);
    const update = () => setIsLimited(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isLimited;
}
