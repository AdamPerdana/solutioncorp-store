import type { CheckoutData } from "@/types";
import { formatRupiah } from "@/lib/utils/format";

export const ADMIN_WHATSAPP = "628882234566";

export type OrderLine = {
  name: string;
  price: number;
  qty: number;
};

export function buildOrderMessage(
  orderCode: string,
  data: CheckoutData,
  lines: OrderLine[],
  subtotal: number,
): string {
  const customerLines = [
    `*Pesanan #${orderCode}*`,
    "",
    "*Pemesan*",
    `Nama: ${data.name}`,
    data.company ? `Usaha: ${data.company}` : null,
    `WA: ${data.phone}`,
    `Wilayah: ${data.region}`,
    `Alamat: ${data.address}`,
  ].filter((line) => line !== null);

  const itemLines = lines.map(
    (line, index) =>
      `${index + 1}. ${line.name} × ${line.qty} = ${formatRupiah(line.price * line.qty)}`,
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