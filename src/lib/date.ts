const pad = (n: number): string => String(n).padStart(2, "0");

/** 端末の時刻で「11/11 13:05」の形にする。 */
export function formatDateTime(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
