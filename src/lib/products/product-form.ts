
export type ProductSpecInput = {
  label: string;
  value: string;
};

export type ProductFormData = {
  name: string;
  slug: string;
  price: string; 
  description: string;
  image: string | null;
  specs: ProductSpecInput[];
};

export type ProductFormErrors = Partial<Record<keyof ProductFormData, string>>;

export const EMPTY_PRODUCT_FORM: ProductFormData = {
  name: "",
  slug: "",
  price: "",
  description: "",
  image: null,
  specs: [],
};


export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parsePrice(price: string): number {
  return Number(price.replace(/\D/g, ""));
}

export function validateProductForm(data: ProductFormData): ProductFormErrors {
  const errors: ProductFormErrors = {};

  if (data.image !== null && !/^\/uploads\/[a-z0-9-]+\.(jpg|png|webp)$/.test(data.image)) {
    errors.image = "Foto tidak valid, silakan upload ulang";
  }

  if (!data.name.trim()) errors.name = "Nama produk wajib diisi";
  else if (data.name.length > 150) errors.name = "Nama produk terlalu panjang";

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    errors.slug = "Hanya huruf kecil, angka, dan tanda strip. Contoh: sterno-gel-200g";
  } else if (data.slug.length > 150) {
    errors.slug = "Slug terlalu panjang";
  }

  const price = parsePrice(data.price);
  if (!price || price < 1) errors.price = "Harga wajib diisi dan lebih dari 0";
  else if (price > 1_000_000_000) errors.price = "Harga terlalu besar";

  if (!data.description.trim()) errors.description = "Deskripsi wajib diisi";
  else if (data.description.length > 5000) errors.description = "Deskripsi terlalu panjang";

  if (data.specs.length > 20) {
    errors.specs = "Maksimal 20 baris spesifikasi";
  } else if (data.specs.some((spec) => !spec.label.trim() || !spec.value.trim())) {
    errors.specs = "Setiap baris spesifikasi harus diisi label dan nilainya, atau hapus barisnya";
  } else if (data.specs.some((spec) => spec.label.length > 100 || spec.value.length > 100)) {
    errors.specs = "Label dan nilai spesifikasi maksimal 100 karakter";
  }

  return errors;
}