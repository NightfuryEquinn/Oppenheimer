import { Grain } from "@/components/layout/Grain";
import { HUD } from "@/components/layout/HUD";
import { Vignette } from "@/components/layout/Vignette";
import { Cover } from "@/components/chapters/Cover";
import { Origin } from "@/components/chapters/Origin";
import { AtomLab } from "@/components/chapters/AtomLab";
import { Equivalence } from "@/components/chapters/Equivalence";
import { ChainReaction } from "@/components/chapters/ChainReaction";
import { Trinity } from "@/components/chapters/Trinity";
import { Papers } from "@/components/chapters/Papers";
import { Legacy } from "@/components/chapters/Legacy";
import "@/styles/index.css";

export function App() {
  return (
    <>
      <Grain />
      <Vignette />
      <HUD />
      <main>
        <Cover />
        <Origin />
        <AtomLab />
        <Equivalence />
        <ChainReaction />
        <Trinity />
        <Papers />
        <Legacy />
      </main>
    </>
  );
}

export default App;
