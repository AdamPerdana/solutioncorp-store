export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string | null;
  specs: ProductSpec[];
};

export type CartItem = {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  qty: number;
};

export type Region = "Jabodetabek" | "Luar Jabodetabek";

export type CheckoutData = {
  name: string;
  phone: string;
  company: string;
  region: Region | "";
  address: string;
};