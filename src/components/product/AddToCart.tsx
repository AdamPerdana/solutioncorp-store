"use client";

import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import type { Product } from "@/types";
import { useCart } from "@/lib/cart";

type AddToCartProps = {
  product: Product;
};

export default function AddToCart({ product }: AddToCartProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleAdd = () => {
    addToCart(product, qty);
    setNotifOpen(true);
    setQty(1);
  };

  return (
    <>
      <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 3 }}>
        {/* Pilih jumlah */}
        <Paper variant="outlined" sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => setQty((q) => q - 1)}
            disabled={qty <= 1}
            aria-label="Kurangi jumlah"
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ minWidth: 32, textAlign: "center", fontWeight: 600 }}>
            {qty}
          </Typography>
          <IconButton onClick={() => setQty((q) => q + 1)} aria-label="Tambah jumlah">
            <AddIcon fontSize="small" />
          </IconButton>
        </Paper>

        <Button
          variant="contained"
          size="large"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAdd}
          sx={{ flexGrow: 1 }}
        >
          Tambah ke keranjang
        </Button>
      </Stack>

      {/* Notifikasi*/}
      <Snackbar
        open={notifOpen}
        autoHideDuration={2500}
        onClose={() => setNotifOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setNotifOpen(false)}>
          {product.name} ditambahkan ke keranjang
        </Alert>
      </Snackbar>
    </>
  );
}