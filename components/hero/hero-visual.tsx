export function HeroVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-surface-raised">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

      <svg viewBox="0 0 400 400" className="h-[80%] w-[80%]" aria-hidden="true">
        <defs>
          <radialGradient id="hv-sphere" cx="38%" cy="32%">
            <stop offset="0%" stopColor="#ff8844" />
            <stop offset="55%" stopColor="#ff5a1f" />
            <stop offset="100%" stopColor="#cc3a00" />
          </radialGradient>
          <radialGradient id="hv-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(255,90,31,0.28)" />
            <stop offset="100%" stopColor="rgba(255,90,31,0)" />
          </radialGradient>
        </defs>

        <circle cx="200" cy="200" r="72" fill="url(#hv-glow)" />

        <g transform="translate(200,200)">
          <animateTransform attributeName="transform" additive="sum"
            type="rotate" values="0;360" dur="10s" repeatCount="indefinite" />
          <g transform="rotate(12)">
            <ellipse cx="0" cy="0" rx="135" ry="46" fill="none"
              stroke="#ff5a1f" strokeWidth="1.5" strokeOpacity="0.8" />
            <circle cx="135" cy="0" r="5" fill="#ff7944" opacity="0.95" />
          </g>
        </g>

        <g transform="translate(200,200)">
          <animateTransform attributeName="transform" additive="sum"
            type="rotate" values="0;-360" dur="14s" repeatCount="indefinite" />
          <g transform="rotate(-58)">
            <ellipse cx="0" cy="0" rx="135" ry="46" fill="none"
              stroke="#ff7033" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="135" cy="0" r="4" fill="#ff5a1f" opacity="0.9" />
          </g>
        </g>

        <g transform="translate(200,200)">
          <animateTransform attributeName="transform" additive="sum"
            type="rotate" values="0;360" dur="24s" repeatCount="indefinite" />
          <ellipse cx="0" cy="0" rx="158" ry="28" fill="none"
            stroke="#ff7944" strokeWidth="0.75" strokeOpacity="0.3" />
          <circle cx="158" cy="0" r="3" fill="#ff7944" opacity="0.65" />
        </g>

        <circle cx="200" cy="200" r="34" fill="url(#hv-sphere)" />
      </svg>

      <div className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 80px 28px #14171e" }} />
    </div>
  );
}
