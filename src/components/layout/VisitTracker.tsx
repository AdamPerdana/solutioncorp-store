"use client";

import { useEffect } from "react";
import { recordVisit } from "@/app/(store)/actions";

// cuma untuk mencatat kunjungan, tidak menampilkan apa-apa
export default function VisitTracker() {
  useEffect(() => {
    recordVisit().catch(() => {
      // Gagal mencatat tidak boleh eror
    });
  }, []);

  return null;
}