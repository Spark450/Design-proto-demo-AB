/* "2025-01-06" becomes "January 6, 2025". Read as a local date, so it never
   shows the day before in time zones west of UTC. Anything that isn't a
   YYYY-MM-DD date comes back unchanged. */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}
