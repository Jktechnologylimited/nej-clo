const SWATCHES: Record<string, string> = {
  "Bitumen Black": "#17140f",
  Bone: "#e8e1d0",
  "Concrete Grey": "#8b877c",
  Rust: "#b23a2e",
  Amber: "#f2c641",
};

/** Legacy name-based guess — kept only as a fallback for rows saved before swatch_hex existed. */
export function swatchFor(colorway: string): string {
  return SWATCHES[colorway] ?? "#6b6558";
}

/** The real color to render for a product: the admin-set hex if there is one, else the legacy guess. */
export function effectiveSwatch(product: { colorway: string; swatchHex?: string | null }): string {
  return product.swatchHex || swatchFor(product.colorway);
}
