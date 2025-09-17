"use client";

import { useState, useEffect } from "react";

export function AnimatedText({ phrases }: { phrases: string[] }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsFading(false);
      }, 500);
    }, 2500);

    return () => clearInterval(timer);
  }, [phrases]);

  if (!phrases || phrases.length === 0) return null;

  return (
    <span
      className={`transition-opacity duration-500 font-code text-accent ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {phrases[phraseIndex]}
    </span>
  );
}
