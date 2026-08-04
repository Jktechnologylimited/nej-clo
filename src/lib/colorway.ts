const SWATCHES: Record<string, string> = {
  "Bitumen Black": "#17140f",
  Bone: "#e8e1d0",
  "Concrete Grey": "#8b877c",
  Rust: "#b23a2e",
  Amber: "#f2c641",
};

export function swatchFor(colorway: string): string {
  return SWATCHES[colorway] ?? "#6b6558";
}
