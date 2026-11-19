import { useSyncExternalStore } from "react";
import type { CartItem, Product } from "@/types";

const STORAGE_KEY = "solution_cart";
const EMPTY_CART: CartItem[] = [];

// Local state
let items: CartItem[] = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

function loadFromStorage() {
  if (loaded) return;
  const saved = localStorage.getItem(STORAGE_KEY);
  items = saved ? JSON.parse(saved) : EMPTY_CART;
  loaded = true;
}

function saveItems(newItems: CartItem[]) {
  items = newItems;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  listeners.forEach((listener) => listener()); // kabari semua komponen
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  loadFromStorage();
  return items;
}

function getServerSnapshot() {
  return EMPTY_CART; // di server belum ada localStorage, anggap kosong
}

// function keranjang
function addToCart(product: Product, qty: number) {
  loadFromStorage();
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    saveItems(
      items.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + qty } : item,
      ),
    );
  } else {
    saveItems([
      ...items,
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      },
    ]);
  }
}

function updateQty(id: number, qty: number) {
  loadFromStorage();
  if (qty < 1) return;
  saveItems(items.map((item) => (item.id === id ? { ...item, qty } : item)));
}

function removeFromCart(id: number) {
  loadFromStorage();
  saveItems(items.filter((item) => item.id !== id));
}

function clearCart() {
  saveItems(EMPTY_CART);
}

//Hook 
export function useCart() {
  const cartItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  return { items: cartItems,
    totalItems,
    subtotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart, };
}