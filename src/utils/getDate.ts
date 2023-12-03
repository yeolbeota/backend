export function getDate(date?: number) {
  const now = date ? new Date(date) : new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;

  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const korNow = new Date(utc + koreaTimeDiff);

  return korNow;
}
