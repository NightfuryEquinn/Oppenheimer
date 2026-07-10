import { useIntro } from "@/context/IntroContext";
import { animate, onScroll, type ScrollObserver } from "animejs";
import { useEffect } from "react";

const REVEAL_OFFSET = 48;

function revealSection(section: HTMLElement) {
  if (section.dataset.revealed === "true") return;

  animate(section, {
    opacity: [0, 1],
    y: [REVEAL_OFFSET, 0],
    duration: 900,
    ease: "outExpo",
    onComplete: () => {
      section.dataset.revealed = "true";
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    },
  });
}

export function useChapterScrollReveal() {
  const { phase } = useIntro();

  useEffect(() => {
    if (phase !== "ready") return;

    let cancelled = false;
    const observers: ScrollObserver[] = [];

    const setup = () => {
      if (cancelled) return;

      const sections = document.querySelectorAll<HTMLElement>("[data-chapter-reveal]:not([data-revealed])");

      sections.forEach((section) => {
        const observer = onScroll({
          target: section,
          enter: "center top",
          repeat: false,
          onEnter: () => {
            revealSection(section);
          },
        });

        observers.push(observer);
      });
    };

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(setup);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observers.forEach((observer) => observer.revert());
    };
  }, [phase]);
}
