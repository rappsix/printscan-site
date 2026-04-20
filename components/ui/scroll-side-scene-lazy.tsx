"use client";

import dynamic from "next/dynamic";

export const ScrollSideScene = dynamic(
  () => import("./scroll-side-scene").then((m) => m.ScrollSideScene),
  { ssr: false, loading: () => null },
);
