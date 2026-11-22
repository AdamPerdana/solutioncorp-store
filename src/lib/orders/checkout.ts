import type { CheckoutData, Region } from "@/types";

export const REGIONS: Region[] = ["Jabodetabek", "Luar Jabodetabek"];

export type FormErrors = Partial<Record<keyof CheckoutData, string>>;

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, "");
}

export function validateCheckout(data: CheckoutData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = "Nama wajib diisi";
  else if (data.name.length > 100) errors.name = "Nama terlalu panjang";

  if (!/^(\+62|62|0)8\d{7,12}$/.test(normalizePhone(data.phone))) {
    errors.phone = "Nomor WhatsApp tidak valid, contoh: 081234567890";
  }

  if (data.company.length > 100) errors.company = "Nama perusahaan terlalu panjang";

  if (!REGIONS.includes(data.region as Region)) errors.region = "Pilih wilayah pengiriman";

  if (!data.address.trim()) errors.address = "Alamat wajib diisi";
  else if (data.address.length > 500) errors.address = "Alamat terlalu panjang";

  return errors;
}

export function formatOrderCode(orderId: number): string {
  return `SC-${String(orderId).padStart(4, "0")}`;
}