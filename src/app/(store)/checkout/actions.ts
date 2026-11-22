"use server";

import { prisma } from "@/lib/db/prisma";
import type { CheckoutData } from "@/types";
import {
  formatOrderCode,
  normalizePhone,
  validateCheckout,
  type FormErrors,
} from "@/lib/orders/checkout";
import { buildOrderMessage, buildWhatsAppUrl, type OrderLine } from "@/lib/orders/whatsapp";

type CartInput = {
  id: number;
  qty: number;
}[];

type CreateOrderResult =
  | { ok: true; orderCode: string; whatsappUrl: string }
  | { ok: false; errors?: FormErrors; message?: string };

export async function createOrder(
  data: CheckoutData,
  cart: CartInput,
): Promise<CreateOrderResult> {
  // 1. Validasi ulang di server (data dari browser tidak boleh langsung dipercaya)
  const errors = validateCheckout(data);
  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const validCart = cart.filter(
    (item) => Number.isInteger(item.qty) && item.qty > 0 && item.qty <= 10000,
  );
  if (validCart.length === 0) {
    return { ok: false, message: "Keranjang belanja kosong." };
  }

  // 2. Ambil harga ASLI dari database, bukan dari keranjang di browser
  const products = await prisma.product.findMany({
    where: { id: { in: validCart.map((item) => item.id) } },
  });

  const lines: (OrderLine & { productId: number })[] = [];
  for (const item of validCart) {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      return {
        ok: false,
        message: "Ada produk di keranjang yang sudah tidak tersedia. Silakan cek ulang keranjang Anda.",
      };
    }
    lines.push({ productId: product.id, name: product.name, price: product.price, qty: item.qty });
  }

  const subtotal = lines.reduce((total, line) => total + line.price * line.qty, 0);

  // 3. Simpan pesanan + item-itemnya sekaligus
  const order = await prisma.order.create({
    data: {
      name: data.name.trim(),
      phone: normalizePhone(data.phone),
      company: data.company.trim() || null,
      region: data.region,
      address: data.address.trim(),
      subtotal,
      items: {
        create: lines.map((line) => ({
          productId: line.productId,
          productName: line.name,
          price: line.price,
          qty: line.qty,
        })),
      },
    },
  });

  // 4. Susun pesan WhatsApp dengan nomor pesanan
  const orderCode = formatOrderCode(order.id);
  const message = buildOrderMessage(orderCode, data, lines, subtotal);

  return { ok: true, orderCode, whatsappUrl: buildWhatsAppUrl(message) };
}