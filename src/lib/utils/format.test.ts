import { describe, expect, it } from "vitest";
import { formatRupiah } from "@/lib/utils/format";

describe("formatRupiah", () => {
  it("menambahkan Rp dan titik ribuan", () => {
    expect(formatRupiah(12500)).toBe("Rp 12.500");
  });

  it("memakai titik ribuan lebih dari satu untuk angka jutaan", () => {
    expect(formatRupiah(1032000)).toBe("Rp 1.032.000");
  });

  it("menampilkan nol sebagai Rp 0", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
  });
});