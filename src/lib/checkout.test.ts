import { describe, expect, it } from "vitest";
import { formatOrderCode, normalizePhone, validateCheckout } from "@/lib/checkout";
import type { CheckoutData, Region } from "@/types";

// Data yang PASTI valid. Setiap test cukup mengubah satu hal dari sini.
const validData: CheckoutData = {
  name: "Budi Santoso",
  phone: "081234567890",
  company: "",
  region: "Jabodetabek",
  address: "Jl. Sudirman No. 1, Jakarta Pusat",
};

describe("validateCheckout", () => {
  it("tidak ada error untuk data yang valid", () => {
    expect(validateCheckout(validData)).toEqual({});
  });

  it("menolak nama kosong", () => {
    const errors = validateCheckout({ ...validData, name: "" });
    expect(errors.name).toBeDefined();
  });

  it("menolak nama yang hanya berisi spasi", () => {
    const errors = validateCheckout({ ...validData, name: "   " });
    expect(errors.name).toBeDefined();
  });

  it("menolak nama lebih dari 100 karakter", () => {
    const errors = validateCheckout({ ...validData, name: "a".repeat(101) });
    expect(errors.name).toBeDefined();
  });

  it("menolak nomor WA yang terlalu pendek", () => {
    const errors = validateCheckout({ ...validData, phone: "123" });
    expect(errors.phone).toBeDefined();
  });

  it("menolak nomor WA yang bukan nomor HP (tidak diawali 8)", () => {
    const errors = validateCheckout({ ...validData, phone: "0212345678" });
    expect(errors.phone).toBeDefined();
  });

  it.each(["0812-3456-7890", "0812 3456 7890", "6281234567890", "+6281234567890"])(
    "menerima format nomor WA %s",
    (phone) => {
      const errors = validateCheckout({ ...validData, phone });
      expect(errors.phone).toBeUndefined();
    },
  );

  it("menerima nama usaha kosong (opsional)", () => {
    const errors = validateCheckout({ ...validData, company: "" });
    expect(errors.company).toBeUndefined();
  });

  it("menolak nama usaha lebih dari 100 karakter", () => {
    const errors = validateCheckout({ ...validData, company: "a".repeat(101) });
    expect(errors.company).toBeDefined();
  });

  it("menolak wilayah kosong", () => {
    const errors = validateCheckout({ ...validData, region: "" });
    expect(errors.region).toBeDefined();
  });

  it("menolak wilayah di luar pilihan", () => {
    // ts-expect-error: sengaja mengirim wilayah yang tidak valid untuk test
    const errors = validateCheckout({ ...validData, region: "Bali" as Region });
    expect(errors.region).toBeDefined();
  });

  it("menolak alamat kosong", () => {
    const errors = validateCheckout({ ...validData, address: "" });
    expect(errors.address).toBeDefined();
  });

  it("menolak alamat lebih dari 500 karakter", () => {
    const errors = validateCheckout({ ...validData, address: "a".repeat(501) });
    expect(errors.address).toBeDefined();
  });

  it("hanya memberi error di field yang salah", () => {
    const errors = validateCheckout({ ...validData, name: "" });
    expect(Object.keys(errors)).toEqual(["name"]);
  });
});

describe("normalizePhone", () => {
  it("membuang spasi dan strip", () => {
    expect(normalizePhone("0812-3456 7890")).toBe("081234567890");
  });

  it("tidak mengubah nomor yang sudah bersih", () => {
    expect(normalizePhone("081234567890")).toBe("081234567890");
  });
});

describe("formatOrderCode", () => {
  it("menambahkan nol di depan sampai 4 digit", () => {
    expect(formatOrderCode(7)).toBe("SC-0007");
  });

  it("tidak memotong nomor yang lebih dari 4 digit", () => {
    expect(formatOrderCode(12345)).toBe("SC-12345");
  });
});