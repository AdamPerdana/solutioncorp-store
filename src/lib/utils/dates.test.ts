import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { lastNDays, toJakartaDateKey } from "@/lib/utils/dates";

describe("toJakartaDateKey", () => {
  it("memakai format YYYY-MM-DD", () => {
    expect(toJakartaDateKey(new Date("2026-03-05T05:00:00Z"))).toBe("2026-03-05");
  });

  it("jam 18:00 UTC sudah hari berikutnya di WIB (01:00 WIB)", () => {
    expect(toJakartaDateKey(new Date("2026-11-21T18:00:00Z"))).toBe("2026-11-22");
  });

  it("jam 16:59 UTC masih hari yang sama di WIB (23:59 WIB)", () => {
    expect(toJakartaDateKey(new Date("2026-11-21T16:59:00Z"))).toBe("2026-11-21");
  });
});

describe("lastNDays", () => {
  beforeEach(() => {
    // "Palsukan" jam: anggap sekarang 22 November 2026, 10:00 WIB
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-22T03:00:00Z"));
  });

  afterEach(() => {
    // Kembalikan jam asli supaya tidak mengganggu test lain
    vi.useRealTimers();
  });

  it("mengembalikan sejumlah n hari", () => {
    expect(lastNDays(14)).toHaveLength(14);
  });

  it("urut dari yang paling lama, hari ini paling akhir", () => {
    expect(lastNDays(3)).toEqual(["2026-11-20", "2026-11-21", "2026-11-22"]);
  });

  it("melewati pergantian bulan dengan benar", () => {
    vi.setSystemTime(new Date("2026-12-02T03:00:00Z"));
    expect(lastNDays(3)).toEqual(["2026-11-30", "2026-12-01", "2026-12-02"]);
  });
});