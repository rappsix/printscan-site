"use client";

import { useEffect, useRef, useState } from "react";

const POOL = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

function randomChar() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function TextScramble({ text, className, delay = 0, duration = 800 }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const startTime = { value: 0 };

    timerRef.current = setTimeout(() => {
      startTime.value = performance.now();

      function frame(now: number) {
        const elapsed = now - startTime.value;
        const progress = Math.min(elapsed / duration, 1);

        setDisplay(
          text
            .split("")
            .map((char, i) => {
              if (char === " " || char === "\n") return char;
              if (i / text.length <= progress) return char;
              return randomChar();
            })
            .join(""),
        );

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          setDisplay(text);
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [text, delay, duration]);

  return <span className={className}>{display}</span>;
}
