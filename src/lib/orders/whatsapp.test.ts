import { describe, expect, it } from "vitest";
import { ADMIN_WHATSAPP, buildOrderMessage, buildWhatsAppUrl, type OrderLine } from "@/lib/orders/whatsapp";
import type { CheckoutData } from "@/types";

const customer: CheckoutData = {
  name: "Budi Santoso",
  phone: "081234567890",
  company: "",
  region: "Jabodetabek",
  address: "Jl. Sudirman No. 1",
};

const lines: OrderLine[] = [
  { name: "Sterno Gel 200 g", price: 12500, qty: 2 },
  { name: "Sterno Kaleng", price: 15000, qty: 1 },
];

describe("buildOrderMessage", () => {
  it("menyusun pesan lengkap sesuai format", () => {
    const message = buildOrderMessage("SC-0007", customer, lines, 40000);

    expect(message).toBe(
      [
        "*Pesanan #SC-0007*",
        "",
        "*Pemesan*",
        "Nama: Budi Santoso",
        "WA: 081234567890",
        "Wilayah: Jabodetabek",
        "Alamat: Jl. Sudirman No. 1",
        "",
        "*Pesanan*",
        "1. Sterno Gel 200 g × 2 = Rp 25.000",
        "2. Sterno Kaleng × 1 = Rp 15.000",
        "",
        "*Subtotal: Rp 40.000*",
        "(Ongkir akan dikonfirmasi oleh admin)",
      ].join("\n"),
    );
  });

  it("tidak menampilkan baris Usaha kalau nama usaha kosong", () => {
    const message = buildOrderMessage("SC-0007", customer, lines, 40000);
    expect(message).not.toContain("Usaha:");
  });

  it("menampilkan baris Usaha kalau nama usaha diisi", () => {
    const message = buildOrderMessage(
      "SC-0007",
      { ...customer, company: "Katering Berkah" },
      lines,
      40000,
    );
    expect(message).toContain("Usaha: Katering Berkah");
  });
});

describe("buildWhatsAppUrl", () => {
  it("mengarah ke nomor WA admin", () => {
    const url = buildWhatsAppUrl("Halo");
    expect(url.startsWith(`https://wa.me/${ADMIN_WHATSAPP}?text=`)).toBe(true);
  });

  it("meng-encode spasi, baris baru, dan simbol supaya URL tidak rusak", () => {
    const url = buildWhatsAppUrl("Halo admin\n*Pesanan #SC-0001* & Rp 1.000");
    expect(url).toBe(
      `https://wa.me/${ADMIN_WHATSAPP}?text=Halo%20admin%0A*Pesanan%20%23SC-0001*%20%26%20Rp%201.000`,
    );
  });

  it("pesannya bisa dibaca kembali utuh dari URL", () => {
    const message = buildOrderMessage("SC-0007", customer, lines, 40000);
    const url = new URL(buildWhatsAppUrl(message));
    expect(url.searchParams.get("text")).toBe(message);
  });
});
