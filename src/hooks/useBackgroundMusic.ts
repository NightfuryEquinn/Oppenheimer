import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import soundtrack from "@/assets/oppenheimer-soundtrack.mp3";

const STORAGE_KEY = "oppenheimer-music-enabled";

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function useBackgroundMusic() {
  const soundRef = useRef<Howl | null>(null);
  const [enabled, setEnabled] = useState(readStored);

  useEffect(() => {
    const sound = new Howl({
      src: [soundtrack],
      loop: true,
      volume: 0.4,
      onplayerror: () => setEnabled(false),
    });
    soundRef.current = sound;
    return () => {
      sound.unload();
      soundRef.current = null;
    };
  }, []);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;

    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      // ignore storage errors
    }

    if (enabled) {
      sound.play();
    } else {
      sound.pause();
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((on) => !on), []);

  return { enabled, toggle };
}
