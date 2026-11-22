import { describe, expect, it } from "vitest";
import { parsePrice, slugify } from "@/lib/product-form";

describe("slugify", () => {
  it("mengubah nama produk jadi slug", () => {
    expect(slugify("Sterno Gel 200 g")).toBe("sterno-gel-200-g");
  });

  it("mengubah huruf besar jadi kecil", () => {
    expect(slugify("STERNO KALENG")).toBe("sterno-kaleng");
  });

  it("membuang karakter selain huruf, angka, spasi, dan strip", () => {
    expect(slugify("Sterno (Promo!)")).toBe("sterno-promo");
  });

  it("menggabungkan spasi dan strip ganda jadi satu strip", () => {
    expect(slugify("Sterno   Gel -- 1 kg")).toBe("sterno-gel-1-kg");
  });

  it("membuang strip di awal dan akhir", () => {
    expect(slugify(" -Sterno- ")).toBe("sterno");
  });
});

describe("parsePrice", () => {
  it("mengubah teks angka jadi number", () => {
    expect(parsePrice("45000")).toBe(45000);
  });

  it("membuang titik ribuan", () => {
    expect(parsePrice("45.000")).toBe(45000);
  });

  it("membuang tulisan Rp dan spasi", () => {
    expect(parsePrice("Rp 45.000")).toBe(45000);
  });

  it("menghasilkan 0 untuk teks kosong", () => {
    expect(parsePrice("")).toBe(0);
  });
});