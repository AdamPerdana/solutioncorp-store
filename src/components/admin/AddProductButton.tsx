"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export default function AddProductButton() {
  return (
    <Button variant="contained" startIcon={<AddIcon />} component={Link} href="/admin/products/new">
      Tambah produk
    </Button>
  );
}