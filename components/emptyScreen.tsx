export default function ComingSoon() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">

      {/* Illustration */}
      <div className="relative">
        {/* Scattered grid dots — decorative background */}
        <svg
          width="260"
          height="200"
          viewBox="0 0 260 200"
          fill="none"
          className="absolute -left-10 -top-10 opacity-[0.06] dark:opacity-[0.08]"
        >
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <circle
                key={`${row}-${col}`}
                cx={col * 28 + 14}
                cy={row * 24 + 12}
                r="1.5"
                fill="currentColor"
                className="text-zinc-900 dark:text-zinc-100"
              />
            ))
          )}
        </svg>

        {/* Main illustration — a screen with a big question mark and tools scattered around */}
        <svg
          width="220"
          height="160"
          viewBox="0 0 220 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Monitor base */}
          <rect
            x="70"
            y="128"
            width="80"
            height="6"
            rx="3"
            className="fill-zinc-200 dark:fill-zinc-700"
          />
          <rect
            x="100"
            y="118"
            width="20"
            height="12"
            className="fill-zinc-200 dark:fill-zinc-700"
          />

          {/* Monitor body */}
          <rect
            x="30"
            y="20"
            width="160"
            height="100"
            rx="8"
            className="fill-zinc-100 dark:fill-zinc-800"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.12"
          />

          {/* Screen inner */}
          <rect
            x="38"
            y="28"
            width="144"
            height="84"
            rx="4"
            className="fill-zinc-50 dark:fill-zinc-900"
          />

          {/* ? mark — big, centered */}
          <text
            x="110"
            y="83"
            textAnchor="middle"
            fontSize="42"
            fontWeight="700"
            fontFamily="monospace"
            className="fill-zinc-300 dark:fill-zinc-600"
          >
            ?
          </text>

          {/* Floating wrench — top right */}
          <g transform="translate(172, 8) rotate(30)">
            <rect x="0" y="3" width="18" height="5" rx="2.5" className="fill-zinc-300 dark:fill-zinc-600" />
            <circle cx="2.5" cy="5.5" r="3.5" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
            <circle cx="15.5" cy="5.5" r="3.5" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
          </g>

          {/* Floating pencil — bottom left */}
          <g transform="translate(14, 100) rotate(-20)">
            <rect x="0" y="0" width="5" height="22" rx="1" className="fill-zinc-300 dark:fill-zinc-600" />
            <polygon points="0,22 5,22 2.5,28" className="fill-zinc-400 dark:fill-zinc-500" />
            <rect x="0" y="0" width="5" height="4" rx="1" className="fill-zinc-400 dark:fill-zinc-500" />
          </g>

          {/* Floating gear — left mid */}
          <g transform="translate(6, 48)">
            <circle cx="10" cy="10" r="5" fill="none" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="2" className="fill-zinc-300 dark:fill-zinc-600" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <rect
                key={i}
                x="9"
                y="2"
                width="2"
                height="3"
                rx="0.5"
                className="fill-zinc-300 dark:fill-zinc-600"
                transform={`rotate(${angle} 10 10)`}
              />
            ))}
          </g>

          {/* Floating sparkle — top left */}
          <g transform="translate(40, 10)">
            <line x1="6" y1="0" x2="6" y2="12" strokeWidth="1.5" strokeLinecap="round" className="stroke-zinc-300 dark:stroke-zinc-600" />
            <line x1="0" y1="6" x2="12" y2="6" strokeWidth="1.5" strokeLinecap="round" className="stroke-zinc-300 dark:stroke-zinc-600" />
            <line x1="1.8" y1="1.8" x2="10.2" y2="10.2" strokeWidth="1" strokeLinecap="round" className="stroke-zinc-200 dark:stroke-zinc-700" />
            <line x1="10.2" y1="1.8" x2="1.8" y2="10.2" strokeWidth="1" strokeLinecap="round" className="stroke-zinc-200 dark:stroke-zinc-700" />
          </g>

          {/* Dashed underline on screen — signals "empty" */}
          <line
            x1="60"
            y1="96"
            x2="160"
            y2="96"
            strokeWidth="1"
            strokeDasharray="4 3"
            strokeLinecap="round"
            className="stroke-zinc-200 dark:stroke-zinc-700"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Work in progress
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
          Yeah… didn't make this yet
        </h1>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-400 dark:text-zinc-500">
          This page is still on the to-do list. Check back once it's actually built.
        </p>
      </div>

      {/* Subtle back hint */}
      <div className="flex items-center gap-1.5 font-mono text-xs text-zinc-300 dark:text-zinc-600">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M7.5 2L3.5 6L7.5 10"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        go back to something that works
      </div>
    </div>
  );
}