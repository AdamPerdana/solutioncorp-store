"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/utils/format";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalItems, subtotal, updateQty, removeFromCart } = useCart();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: "100vw", sm: 400 }, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
          <Typography variant="h6" component="h2">
            Keranjang {totalItems > 0 && `(${totalItems})`}
          </Typography>
          <IconButton onClick={onClose} aria-label="Tutup keranjang">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />

        {/* Isi */}
        {items.length === 0 ? (
          <Stack spacing={2} sx={{ flex: 1, alignItems: "center", justifyContent: "center", p: 4 }}>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 56, color: "text.secondary" }} />
            <Typography color="text.secondary">Keranjang belanja masih kosong.</Typography>
            <Button variant="outlined" href="/#produk" onClick={onClose}>
              Lihat produk
            </Button>
          </Stack>
        ) : (
          <>
            <Stack divider={<Divider flexItem />} sx={{ flex: 1, overflowY: "auto", px: 2 }}>
              {items.map((item) => (
                <Stack key={item.id} direction="row" spacing={2} sx={{ py: 2, alignItems: "center" }}>
                  <Avatar
                    variant="rounded"
                    src={item.image ?? undefined}
                    alt={item.name}
                    sx={{ width: 56, height: 56, bgcolor: "action.hover" }}
                  >
                    <LocalFireDepartmentIcon color="primary" />
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatRupiah(item.price)} / pcs
                    </Typography>

                    <Stack direction="row" sx={{ alignItems: "center", mt: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Kurangi jumlah"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" sx={{ minWidth: 28, textAlign: "center" }}>
                        {item.qty}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        aria-label="Tambah jumlah"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Box>

                  <Stack sx={{ alignItems: "flex-end" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatRupiah(item.price * item.qty)}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Hapus ${item.name}`}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            {/* Footer: subtotal + checkout */}
            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack direction="row" sx={{ justifyContent: "space-between", mb: 2 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography sx={{ fontWeight: 600 }}>{formatRupiah(subtotal)}</Typography>
              </Stack>
              <Button
                variant="contained"
                size="large"
                fullWidth
                component={Link}
                href="/checkout"
                onClick={onClose}
              >
                Lanjut ke checkout
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}