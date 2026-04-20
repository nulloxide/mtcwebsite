export function MountainIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mtcPeak" x1="256" y1="96" x2="256" y2="416" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0080FF" />
          <stop offset="1" stopColor="#0172BD" />
        </linearGradient>
      </defs>
      <path
        d="M32 416 L184 168 L256 288 L328 168 L480 416 L400 416 L296 240 L256 304 L216 240 L112 416 Z"
        fill="#0172BD"
        fillOpacity="0.35"
      />
      <path
        d="M144 400 L216 104 L256 192 L296 104 L368 400 L312 400 L276 248 L256 288 L236 248 L200 400 Z"
        fill="url(#mtcPeak)"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <MountainIcon className="h-9 w-9" />
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-[0.18em] text-brand-blue">
            MONACHIL
          </span>
          <span className="text-[0.6rem] font-medium tracking-[0.22em] text-text-secondary mt-1">
            TECHNOLOGIES
          </span>
        </div>
      )}
    </div>
  );
}
