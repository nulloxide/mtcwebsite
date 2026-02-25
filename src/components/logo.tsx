export function MountainIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer mountain */}
      <path
        d="M50 5 L95 72 H5 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Inner mountain */}
      <path
        d="M50 25 L75 65 H25 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <MountainIcon className="h-8 w-8 text-brand-blue" />
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-light tracking-[0.3em] text-brand-blue">
            MONACHIL
          </span>
          <span className="text-[0.6rem] font-light tracking-[0.3em] text-text-secondary">
            TECHNOLOGIES
          </span>
        </div>
      )}
    </div>
  );
}
