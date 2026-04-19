"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

function DesktopSpotlight() {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const springX = useSpring(x, { stiffness: 60, damping: 18 });
  const springY = useSpring(y, { stiffness: 60, damping: 18 });
  const bg = useMotionTemplate`radial-gradient(650px at ${springX}px ${springY}px, rgba(255,90,31,0.06), transparent 80%)`;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{ background: bg }}
    />
  );
}

function MobileScrollGlow() {
  const { scrollYProgress } = useScroll();
  const gradientY = useTransform(scrollYProgress, [0, 1], [10, 90]);
  const bg = useMotionTemplate`radial-gradient(500px at 50% ${gradientY}%, rgba(255,90,31,0.05), transparent 80%)`;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      style={{ background: bg }}
    />
  );
}

export function CursorSpotlight() {
  return (
    <>
      <div className="hidden lg:contents">
        <DesktopSpotlight />
      </div>
      <div className="contents lg:hidden">
        <MobileScrollGlow />
      </div>
    </>
  );
}
