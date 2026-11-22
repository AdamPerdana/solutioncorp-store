"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiLink from "@mui/material/Link";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import type { CheckoutData } from "@/types";
import { useCart } from "@/lib/cart";
import { formatRupiah } from "@/lib/utils/format";
import { REGIONS, validateCheckout, type FormErrors } from "@/lib/orders/checkout";
import { createOrder } from "@/app/(store)/checkout/actions";

const NEXT_STEPS = [
  "Admin mengonfirmasi pesanan dan ongkos kirim",
  "Anda melakukan pembayaran sesuai total",
  "Pesanan kami proses dan kirim ke alamat Anda",
];

const EMPTY_FORM: CheckoutData = {
  name: "",
  phone: "",
  company: "",
  region: "",
  address: "",
};

export default function CheckoutForm() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field: keyof CheckoutData) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    const newErrors = validateCheckout(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Buka tab kosong SEKARANG (saat klik), supaya tidak diblokir browser
    const waWindow = window.open("", "_blank");
    setSubmitting(true);

    const result = await createOrder(
      form,
      items.map((item) => ({ id: item.id, qty: item.qty })),
    );

    setSubmitting(false);

    if (!result.ok) {
      waWindow?.close();
      if (result.errors) setErrors(result.errors);
      if (result.message) setSubmitError(result.message);
      return;
    }

    if (waWindow) waWindow.location.href = result.whatsappUrl;
    setOrderCode(result.orderCode);
    setWhatsappUrl(result.whatsappUrl);
    clearCart();
  };

  // Setelah pesanan dibuat
  if (whatsappUrl) {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 6 }, maxWidth: 560, mx: "auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 64 }} />
          <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
            Terima kasih, pesanan Anda kami terima!
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Admin kami akan segera menghubungi Anda melalui WhatsApp.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Nomor pesanan: <b>#{orderCode}</b>
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 4, mb: 1 }}>
          Langkah selanjutnya
        </Typography>
        <List dense disablePadding>
          {NEXT_STEPS.map((step, index) => (
            <ListItem key={step} disableGutters>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Avatar sx={{ width: 24, height: 24, fontSize: 13, bgcolor: "primary.main" }}>
                  {index + 1}
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={step} />
            </ListItem>
          ))}
        </List>

        <Button variant="contained" size="large" fullWidth href="/" sx={{ mt: 4 }}>
          Kembali ke beranda
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: "center" }}>
          WhatsApp tidak terbuka?{" "}
          <MuiLink href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Klik di sini
          </MuiLink>
        </Typography>
      </Paper>
    );
  }

  // Keranjang kosong
  if (items.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
        <ShoppingCartOutlinedIcon sx={{ fontSize: 56, color: "text.secondary" }} />
        <Typography color="text.secondary" sx={{ mt: 2, mb: 3 }}>
          Keranjang belanja masih kosong.
        </Typography>
        <Button variant="outlined" href="/#produk">
          Lihat produk
        </Button>
      </Paper>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Grid container spacing={4}>
        {/* Data pemesan */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
              Data pemesan
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                label="Nama"
                required
                value={form.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="No. WhatsApp"
                required
                type="tel"
                placeholder="081234567890"
                value={form.phone}
                onChange={handleChange("phone")}
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField
                label="Nama perusahaan (opsional)"
                value={form.company}
                onChange={handleChange("company")}
              />
              <TextField
                select
                label="Wilayah"
                required
                value={form.region}
                onChange={handleChange("region")}
                error={!!errors.region}
                helperText={errors.region}
              >
                {REGIONS.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Alamat lengkap"
                required
                multiline
                minRows={3}
                value={form.address}
                onChange={handleChange("address")}
                error={!!errors.address}
                helperText={errors.address ?? "Tulis lengkap sampai kota/kabupaten"}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* Ringkasan pesanan */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, position: { md: "sticky" }, top: { md: 88 } }}>
            <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
              Ringkasan pesanan
            </Typography>
            <Stack spacing={1.5}>
              {items.map((item) => (
                <Stack key={item.id} direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {item.name} × {item.qty}
                  </Typography>
                  <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                    {formatRupiah(item.price * item.qty)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography sx={{ fontWeight: 600 }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 600 }}>{formatRupiah(subtotal)}</Typography>
            </Stack>
            <Alert severity="info" sx={{ mt: 2 }}>
              Ongkir akan dikonfirmasi oleh admin.
            </Alert>
            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              loading={submitting}
              startIcon={<CheckCircleOutlinedIcon />}
              sx={{ mt: 3 }}
            >
              Konfirmasi pesanan
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}