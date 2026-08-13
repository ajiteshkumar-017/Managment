/** Convert "09:00", "14:00", or "09:00 AM" to 12-hour display like "9:00 AM". */
export function formatTo12Hour(time: string) {
  const raw = String(time || "").trim();
  if (!raw) return "—";

  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (!match) return raw;

  let hours = Number(match[1]);
  const minutes = match[2];
  const givenPeriod = match[3]?.toUpperCase();

  if (givenPeriod) {
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${givenPeriod}`;
  }

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${period}`;
}

export function formatTimeRange12h(startTime: string, endTime: string) {
  return `${formatTo12Hour(startTime)} – ${formatTo12Hour(endTime)}`;
}
