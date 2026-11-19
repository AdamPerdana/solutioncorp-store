import type { CartItem, CheckoutData } from "@/types";
import { formatRupiah } from "@/lib/format";

export const ADMIN_WHATSAPP = "628882234566";

export function buildOrderMessage(data: CheckoutData, items: CartItem[], subtotal: number): string {
  const customerLines = [
    "*Pemesan*",
    `Nama: ${data.name}`,
    data.company ? `Usaha: ${data.company}` : null,
    `WA: ${data.phone}`,
    `Wilayah: ${data.region}`,
    `Alamat: ${data.address}`,
  ].filter(Boolean);

  const itemLines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} × ${item.qty} = ${formatRupiah(item.price * item.qty)}`,
  );

  return [
    ...customerLines,
    "",
    "*Pesanan*",
    ...itemLines,
    "",
    `*Subtotal: ${formatRupiah(subtotal)}*`,
    "(Ongkir akan dikonfirmasi oleh admin)",
  ].join("\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}