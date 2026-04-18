export function HeroVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[32px] bg-surface-raised">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

      <div
        className="animate-blob-primary absolute"
        style={{
          top: "12%",
          left: "10%",
          width: "72%",
          height: "72%",
          background:
            "radial-gradient(ellipse at 40% 40%, #ff7944 0%, #ff5a1f 30%, rgba(255,90,31,0.18) 65%, transparent 80%)",
          filter: "blur(28px)",
          opacity: 0.88,
        }}
      />

      <div
        className="animate-blob-secondary absolute"
        style={{
          top: "8%",
          right: "6%",
          width: "48%",
          height: "48%",
          background:
            "radial-gradient(ellipse at 60% 35%, #3fb0ff 0%, rgba(63,176,255,0.35) 50%, transparent 75%)",
          filter: "blur(22px)",
          opacity: 0.7,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 rounded-[32px]"
        style={{
          boxShadow: "inset 0 0 90px 30px #14171e",
        }}
      />
    </div>
  );
}
