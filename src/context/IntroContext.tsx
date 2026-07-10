import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type IntroPhase = "classified" | "declassifying" | "cover" | "ready";

interface IntroContextValue {
  phase: IntroPhase;
  setPhase: (phase: IntroPhase) => void;
  startDeclassify: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("classified");

  const value = useMemo(
    () => ({
      phase,
      setPhase,
      startDeclassify: () => {
        setPhase((current) => (current === "classified" ? "declassifying" : current));
      },
    }),
    [phase],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) throw new Error("useIntro must be used within IntroProvider");
  return context;
}
