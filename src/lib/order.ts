// Fungsi bantu untuk leads/pesanan (dipakai di halaman admin)

// Kolom status di database dipakai sebagai penanda follow-up
export const FOLLOW_UP_LABELS = {
  BARU: "Belum FU",
  SELESAI: "Sudah FU",
} as const;

export type OrderStatusValue = keyof typeof FOLLOW_UP_LABELS;

// "0812-3456-7890" / "+62812..." / "62812..." → "62812..." (format wa.me)
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

// Selalu tampilkan jam WIB, walaupun server memakai zona waktu lain
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}