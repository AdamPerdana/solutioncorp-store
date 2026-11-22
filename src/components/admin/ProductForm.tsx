"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import {
  slugify,
  validateProductForm,
  type ProductFormData,
  type ProductFormErrors,
} from "@/lib/product-form";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
} from "@/app/admin/(dashboard)/products/actions";

type ProductFormProps = {
  initialData: ProductFormData;
  productId?: number; // ada = mode edit, tidak ada = mode tambah
};

export default function ProductForm({ initialData, productId }: ProductFormProps) {
  const isEdit = productId !== undefined;
  const [form, setForm] = useState<ProductFormData>(initialData);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Saat mengetik nama, slug ikut terisi otomatis (selama slug belum diubah manual)
  const handleNameChange = (name: string) => {
    setForm((prev) => ({ ...prev, name, slug: slugEdited ? prev.slug : slugify(name) }));
    setErrors((prev) => ({ ...prev, name: undefined, slug: undefined }));
  };

  const handleSlugChange = (slug: string) => {
    setSlugEdited(true);
    updateField("slug", slug.toLowerCase());
  };

  const updateSpec = (index: number, key: "label" | "value", value: string) => {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.map((spec, i) => (i === index ? { ...spec, [key]: value } : spec)),
    }));
    setErrors((prev) => ({ ...prev, specs: undefined }));
  };

  const addSpec = () => {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { label: "", value: "" }] }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
    setErrors((prev) => ({ ...prev, specs: undefined }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // supaya file yang sama bisa dipilih lagi
    if (!file) return;

    // Cek cepat di browser dulu (server tetap mengecek ulang)
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Format foto harus JPG, PNG, atau WEBP" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Ukuran foto maksimal 2 MB" }));
      return;
    }

    setUploading(true);
    setErrors((prev) => ({ ...prev, image: undefined }));

    const formData = new FormData();
    formData.append("image", file);
    const result = await uploadProductImage(formData);

    setUploading(false);
    if ("error" in result) {
      setErrors((prev) => ({ ...prev, image: result.error }));
    } else {
      setForm((prev) => ({ ...prev, image: result.url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = validateProductForm(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const result = isEdit ? await updateProduct(productId, form) : await createProduct(form);

    // Kalau berhasil, server langsung mengarahkan ke daftar produk.
    // Kode di bawah ini hanya jalan kalau ada error dari server.
    setSubmitting(false);
    setErrors(result.errors);
  };

  return (
    <Stack component="form" spacing={3} onSubmit={handleSubmit} noValidate sx={{ maxWidth: 720 }}>
      {/* Info utama */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2.5 }}>
          Info produk
        </Typography>
        <Stack spacing={2.5}>
          <TextField
            label="Nama produk"
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Slug (alamat halaman)"
            required
            value={form.slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            error={!!errors.slug}
            helperText={errors.slug ?? `Alamat produk: /product/${form.slug || "..."}`}
          />
          <TextField
            label="Harga"
            required
            inputMode="numeric"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value.replace(/\D/g, ""))}
            error={!!errors.price}
            helperText={errors.price ?? "Angka saja, tanpa titik. Contoh: 12500"}
            slotProps={{
              input: { startAdornment: <InputAdornment position="start">Rp</InputAdornment> },
            }}
          />
          <TextField
            label="Deskripsi"
            required
            multiline
            minRows={4}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Stack>
      </Paper>

      {/* Foto */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" component="h2">
          Foto produk
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Opsional. JPG, PNG, atau WEBP, maksimal 2 MB. Sebaiknya foto persegi (1:1).
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ alignItems: { sm: "center" } }}>
          <Box
            sx={{
              width: 160,
              aspectRatio: "1 / 1",
              borderRadius: 2,
              overflow: "hidden",
              border: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "action.hover",
              flexShrink: 0,
            }}
          >
            {form.image ? (
              <Box
                component="img"
                src={form.image}
                alt="Foto produk"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <LocalFireDepartmentIcon color="primary" sx={{ fontSize: 56 }} />
            )}
          </Box>

          <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleImageChange}
            />
            <Button
              variant="outlined"
              startIcon={<PhotoCameraOutlinedIcon />}
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
            >
              {form.image ? "Ganti foto" : "Pilih foto"}
            </Button>
            {form.image && (
              <Button
                color="error"
                startIcon={<DeleteOutlinedIcon />}
                onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                disabled={uploading}
              >
                Hapus foto
              </Button>
            )}
          </Stack>
        </Stack>

        {errors.image && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.image}
          </Alert>
        )}
      </Paper>

      {/* Spesifikasi */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" component="h2">
          Spesifikasi
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Opsional. Contoh: Jenis → Gel, Berat bersih → 200 g.
        </Typography>

        <Stack spacing={1.5}>
          {form.specs.map((spec, index) => (
            <Stack key={index} direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <TextField
                size="small"
                label="Label"
                value={spec.label}
                onChange={(e) => updateSpec(index, "label", e.target.value)}
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label="Nilai"
                value={spec.value}
                onChange={(e) => updateSpec(index, "value", e.target.value)}
                sx={{ flex: 1 }}
              />
              <IconButton onClick={() => removeSpec(index)} aria-label="Hapus baris">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>

        {errors.specs && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.specs}
          </Alert>
        )}

        <Button startIcon={<AddIcon />} onClick={addSpec} sx={{ mt: 2 }}>
          Tambah baris
        </Button>
      </Paper>

      {/* Tombol */}
      <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end" }}>
        <Button component={Link} href="/admin/products" color="inherit" disabled={submitting}>
          Batal
        </Button>
        <Button type="submit" variant="contained" loading={submitting} disabled={uploading}>
          {isEdit ? "Simpan perubahan" : "Simpan produk"}
        </Button>
      </Stack>
    </Stack>
  );
}