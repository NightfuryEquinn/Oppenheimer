import { AtomLab } from "@/components/chapters/AtomLab";
import { ChainReaction } from "@/components/chapters/ChainReaction";
import { Cover } from "@/components/chapters/Cover";
import { Equivalence } from "@/components/chapters/Equivalence";
import { Legacy } from "@/components/chapters/Legacy";
import { Origin } from "@/components/chapters/Origin";
import { Papers } from "@/components/chapters/Papers";
import { Trinity } from "@/components/chapters/Trinity";
import { ClassifiedOverlay } from "@/components/layout/ClassifiedOverlay";
import { Grain } from "@/components/layout/Grain";
import { HUD } from "@/components/layout/HUD";
import { ScreenLimitOverlay } from "@/components/layout/ScreenLimitOverlay";
import { Vignette } from "@/components/layout/Vignette";
import { IntroProvider, useIntro } from "@/context/IntroContext";
import { useChapterScrollReveal } from "@/hooks/useChapterScrollReveal";
import { useCoverReveal } from "@/hooks/useCoverReveal";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { isPerfOverlayEnabled } from "@/lib/perf/devFlags";
import { PerfOverlay } from "@/lib/perf/PerfOverlay";
import "@/styles/index.css";
import { animate } from "animejs";
import { useCallback, useEffect, useRef } from "react";

function AppContent() {
  const coverRef = useRef<HTMLElement>(null);
  const hudRef = useRef<HTMLElement>(null);
  const { phase, setPhase } = useIntro();

  useCoverReveal(coverRef);
  useChapterScrollReveal();
  useSmoothScroll(phase === "ready");

  const handleDeclassified = useCallback(() => {
    setPhase("cover");
  }, [setPhase]);

  useEffect(() => {
    document.body.style.overflow = phase === "ready" ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (!hudRef.current) return;

    if (phase === "classified" || phase === "declassifying") {
      hudRef.current.style.opacity = "0";
      hudRef.current.style.pointerEvents = "none";
      return;
    }

    animate(hudRef.current, {
      opacity: [0, 1],
      y: [-8, 0],
      duration: 900,
      ease: "outExpo",
    });
    hudRef.current.style.pointerEvents = "";
  }, [phase]);

  return (
    <>
      <Grain />
      <Vignette />
      <HUD ref={hudRef} />
      <ScreenLimitOverlay />
      <ClassifiedOverlay onDeclassified={handleDeclassified} />
      <main>
        <Cover ref={coverRef} />
        <Origin />
        <AtomLab />
        <Equivalence />
        <ChainReaction />
        <Trinity />
        <Papers />
        <Legacy />
      </main>
      {isPerfOverlayEnabled() && <PerfOverlay />}
    </>
  );
}

export function App() {
  return (
    <IntroProvider>
      <AppContent />
    </IntroProvider>
  );
}

export default App;
