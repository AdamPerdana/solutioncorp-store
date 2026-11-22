import { describe, expect, it } from "vitest";
import { toWhatsAppNumber } from "@/lib/orders/order";

describe("toWhatsAppNumber", () => {
  it("mengganti 0 di depan jadi 62", () => {
    expect(toWhatsAppNumber("081234567890")).toBe("6281234567890");
  });

  it("membuang +, spasi, dan strip", () => {
    expect(toWhatsAppNumber("+62 812-3456-7890")).toBe("6281234567890");
  });

  it("tidak mengubah nomor yang sudah diawali 62", () => {
    expect(toWhatsAppNumber("6281234567890")).toBe("6281234567890");
  });
});