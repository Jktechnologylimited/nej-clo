type Props = {
  category: string;
  className?: string;
};

// Minimal single-weight line icons, drawn to sit inside a square swatch tile.
// Kept deliberately schematic — spec-sheet style, not illustration.
export function GarmentIcon({ category, className }: Props) {
  const common = {
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };

  switch (category) {
    case "hoodie":
      return (
        <svg {...common}>
          <path d="M20 14c2-4 6-6 12-6s10 2 12 6l8 10-6 4-4-4v26H24V24l-4 4-6-4z" />
          <path d="M24 14c0 5 3.5 8 8 8s8-3 8-8" />
        </svg>
      );
    case "cargo":
      return (
        <svg {...common}>
          <path d="M22 8h20l2 40-8 8h-8l-8-8z" />
          <path d="M18 26h6v10h-6z" />
          <path d="M40 26h6v10h-6z" />
          <path d="M32 8v48" />
        </svg>
      );
    case "tee":
      return (
        <svg {...common}>
          <path d="M22 10 10 18l4 8 8-4v30h20V22l8 4 4-8-12-8c-2 3-4 4-10 4s-8-1-10-4z" />
        </svg>
      );
    case "tracksuit":
      return (
        <svg {...common}>
          <path d="M20 12c2-3 5-4 12-4s10 1 12 4l6 8-5 4-3-3v13l4 20h-9l-4-16-4 16h-9l4-20V21l-3 3-5-4z" />
        </svg>
      );
    case "cap":
      return (
        <svg {...common}>
          <path d="M12 34c0-11 9-20 20-20s20 9 20 20" />
          <path d="M8 34h48" />
          <path d="M44 34c8 0 14 2 14 5s-8 5-14 5H20l-8-3" />
        </svg>
      );
    case "jacket":
      return (
        <svg {...common}>
          <path d="M20 10 8 18l4 9 6-3v30h28V24l6 3 4-9-12-8-8 6-8-6z" />
          <path d="M32 16v38" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <rect x="14" y="14" width="36" height="36" />
        </svg>
      );
  }
}
