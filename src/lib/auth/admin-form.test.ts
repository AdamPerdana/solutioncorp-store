import { describe, expect, it } from "vitest";
import { validatePassword, validateUsername } from "@/lib/auth/admin-form";

describe("validateUsername", () => {
  it.each(["adam", "Adam_Perdana", "staff01", "abc"])("menerima username %s", (username) => {
    expect(validateUsername(username)).toBeNull();
  });

  it.each([
    ["terlalu pendek", "ab"],
    ["ada spasi", "adam perdana"],
    ["ada simbol", "adam@toko"],
    ["kosong", ""],
  ])("menolak username yang %s", (_reason, username) => {
    expect(validateUsername(username)).not.toBeNull();
  });

  it("menolak username lebih dari 50 karakter", () => {
    expect(validateUsername("a".repeat(51))).not.toBeNull();
  });
});

describe("validatePassword", () => {
  it("menerima password tepat 8 karakter", () => {
    expect(validatePassword("12345678")).toBeNull();
  });

  it("menolak password 7 karakter", () => {
    expect(validatePassword("1234567")).not.toBeNull();
  });

  it("menerima password tepat 100 karakter", () => {
    expect(validatePassword("a".repeat(100))).toBeNull();
  });

  it("menolak password lebih dari 100 karakter", () => {
    expect(validatePassword("a".repeat(101))).not.toBeNull();
  });
});