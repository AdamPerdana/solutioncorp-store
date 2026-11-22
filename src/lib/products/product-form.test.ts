import { describe, expect, it } from "vitest";
import {
  parsePrice,
  slugify,
  validateProductForm,
  type ProductFormData,
} from "@/lib/products/product-form";

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

// Valid product data untuk dipakai di test
const validProduct: ProductFormData = {
  name: "Sterno Gel 200 g",
  slug: "sterno-gel-200-g",
  price: "45000",
  description: "Bahan bakar gel untuk prasmanan.",
  image: null,
  specs: [{ label: "Berat", value: "200 g" }],
};

describe("validateProductForm", () => {
  it("tidak ada error untuk data yang valid", () => {
    expect(validateProductForm(validProduct)).toEqual({});
  });

  it("menolak nama kosong", () => {
    const errors = validateProductForm({ ...validProduct, name: "" });
    expect(errors.name).toBeDefined();
  });

  it("menolak slug yang ada spasi dan huruf besar", () => {
    const errors = validateProductForm({ ...validProduct, slug: "Sterno Gel" });
    expect(errors.slug).toBeDefined();
  });

  it("menolak slug yang diawali strip", () => {
    const errors = validateProductForm({ ...validProduct, slug: "-sterno" });
    expect(errors.slug).toBeDefined();
  });

  it("menolak harga 0", () => {
    const errors = validateProductForm({ ...validProduct, price: "0" });
    expect(errors.price).toBeDefined();
  });

  it("menolak harga kosong", () => {
    const errors = validateProductForm({ ...validProduct, price: "" });
    expect(errors.price).toBeDefined();
  });

  it("menolak harga lebih dari 1 miliar", () => {
    const errors = validateProductForm({ ...validProduct, price: "1000000001" });
    expect(errors.price).toBeDefined();
  });

  it("menerima harga dengan format Rp dan titik", () => {
    const errors = validateProductForm({ ...validProduct, price: "Rp 45.000" });
    expect(errors.price).toBeUndefined();
  });

  it("menolak deskripsi kosong", () => {
    const errors = validateProductForm({ ...validProduct, description: "  " });
    expect(errors.description).toBeDefined();
  });

  it("menerima produk tanpa spesifikasi", () => {
    const errors = validateProductForm({ ...validProduct, specs: [] });
    expect(errors.specs).toBeUndefined();
  });

  it("menolak baris spesifikasi yang labelnya kosong", () => {
    const errors = validateProductForm({
      ...validProduct,
      specs: [{ label: "", value: "200 g" }],
    });
    expect(errors.specs).toBeDefined();
  });

  it("menolak lebih dari 20 baris spesifikasi", () => {
    const specs = Array.from({ length: 21 }, (_, i) => ({
      label: `Label ${i}`,
      value: "isi",
    }));
    const errors = validateProductForm({ ...validProduct, specs });
    expect(errors.specs).toBeDefined();
  });

  it("menerima foto hasil upload", () => {
    const errors = validateProductForm({ ...validProduct, image: "/uploads/abc-123.jpg" });
    expect(errors.image).toBeUndefined();
  });

  it("menolak foto dari URL luar", () => {
    const errors = validateProductForm({
      ...validProduct,
      image: "https://contoh.com/foto.jpg",
    });
    expect(errors.image).toBeDefined();
  });

  it("menolak foto dengan path traversal", () => {
    const errors = validateProductForm({ ...validProduct, image: "/uploads/../.env" });
    expect(errors.image).toBeDefined();
  });
});