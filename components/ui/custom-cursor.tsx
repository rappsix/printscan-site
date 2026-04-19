"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const dotX = useSpring(mx, { stiffness: 300, damping: 28 });
  const dotY = useSpring(my, { stiffness: 300, damping: 28 });
  const ringX = useSpring(mx, { stiffness: 80, damping: 20 });
  const ringY = useSpring(my, { stiffness: 80, damping: 20 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      setHovered(!!el.closest("a, button, [data-magnetic]"));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [mx, my, visible]);

  if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches)
    return null;

  return (
    <>
      {/* dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[9999] h-2.5 w-2.5 rounded-full bg-brand"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
          scale: hovered ? 0 : 1,
        }}
        transition={{ scale: { duration: 0.15 }, opacity: { duration: 0.2 } }}
      />
      {/* ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[9999] rounded-full border border-brand/70"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: hovered ? 52 : 32,
          height: hovered ? 52 : 32,
          borderColor: hovered ? "rgba(255,90,31,1)" : "rgba(255,90,31,0.7)",
        }}
        transition={{ duration: 0.2, ease: "easeOut", opacity: { duration: 0.2 } }}
      />
    </>
  );
}
