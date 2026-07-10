import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[], rootMargin = "-40% 0px -55% 0px") {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
