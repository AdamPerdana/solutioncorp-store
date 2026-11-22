// WIB format "YYYY-MM-DD"
export function toJakartaDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Daftar n hari terakhir
export function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(toJakartaDateKey(new Date(Date.now() - i * 24 * 60 * 60 * 1000)));
  }
  return days;
}