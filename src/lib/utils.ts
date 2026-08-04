export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NEJ-${y}${m}${d}-${rand}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Returns the next upcoming Friday at 18:00, used for the drop countdown. */
export function getNextDropDate(): Date {
  const now = new Date();
  const result = new Date(now);
  const day = now.getDay(); // 0 Sun .. 6 Sat
  let daysUntilFriday = (5 - day + 7) % 7;
  result.setHours(18, 0, 0, 0);
  if (daysUntilFriday === 0 && result <= now) {
    daysUntilFriday = 7;
  }
  result.setDate(now.getDate() + daysUntilFriday);
  return result;
}
