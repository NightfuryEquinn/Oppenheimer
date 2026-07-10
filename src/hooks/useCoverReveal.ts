import { useIntro } from "@/context/IntroContext";
import { animate } from "animejs";
import { useEffect, useRef, type RefObject } from "react";

export function useCoverReveal(coverRef: RefObject<HTMLElement | null>) {
  const { phase, setPhase } = useIntro();
  const revealedRef = useRef(false);

  useEffect(() => {
    if (phase !== "cover" || !coverRef.current || revealedRef.current) return;

    const cover = coverRef.current;
    cover.style.pointerEvents = "none";

    const animation = animate(cover, {
      opacity: [0, 1],
      scale: [0.98, 1],
      duration: 1400,
      ease: "outExpo",
      onComplete: () => {
        revealedRef.current = true;
        cover.classList.remove("opacity-0");
        cover.style.opacity = "1";
        cover.style.transform = "scale(1)";
        cover.style.pointerEvents = "";
        setPhase("ready");
      },
    });

    return () => {
      if (!revealedRef.current) animation.revert();
    };
  }, [coverRef, phase, setPhase]);
}
