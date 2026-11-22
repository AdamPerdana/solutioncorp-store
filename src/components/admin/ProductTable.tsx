"use client";

import { useState } from "react";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { formatRupiah } from "@/lib/format";
import { deleteProduct } from "@/app/admin/(dashboard)/products/actions";

export type AdminProductRow = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  specCount: number;
};

type ProductTableProps = {
  products: AdminProductRow[];
};

type Notice = { severity: "success" | "error"; message: string };

export default function ProductTable({ products }: ProductTableProps) {
  const [productToDelete, setProductToDelete] = useState<AdminProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    const result = await deleteProduct(productToDelete.id);
    setDeleting(false);
    setProductToDelete(null);
    setNotice({ severity: result.ok ? "success" : "error", message: result.message });
  };

  if (products.length === 0) {
    return (
      <Paper variant="outlined" sx={{ py: 8, textAlign: "center" }}>
        <Typography color="text.secondary">
          Belum ada produk. Klik <b>Tambah produk</b> untuk mulai.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produk</TableCell>
              <TableCell align="right">Harga</TableCell>
              <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                Spesifikasi
              </TableCell>
              <TableCell align="right">Edit / Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Avatar
                      variant="rounded"
                      src={product.image ?? undefined}
                      alt={product.name}
                      sx={{ bgcolor: "action.hover" }}
                    >
                      <LocalFireDepartmentIcon color="primary" fontSize="small" />
                    </Avatar>
                    <div>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        /product/{product.slug}
                      </Typography>
                    </div>
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  {formatRupiah(product.price)}
                </TableCell>
                <TableCell align="center" sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {product.specCount}
                </TableCell>
                <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  <Tooltip title="Edit">
                    <IconButton
                      component={Link}
                      href={`/admin/products/${product.id}`}
                      aria-label={`Edit ${product.name}`}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hapus">
                    <IconButton
                      color="error"
                      onClick={() => setProductToDelete(product)}
                      aria-label={`Hapus ${product.name}`}
                    >
                      <DeleteOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Konfirmasi hapus */}
      <Dialog open={!!productToDelete} onClose={() => !deleting && setProductToDelete(null)}>
        <DialogTitle>Hapus produk?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <b>{productToDelete?.name}</b> akan dihapus dari toko beserta spesifikasinya.
            Riwayat pesanan yang berisi produk ini tetap tersimpan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProductToDelete(null)} disabled={deleting} color="inherit">
            Batal
          </Button>
          <Button onClick={handleDelete} loading={deleting} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifikasi hasil */}
      <Snackbar
        open={!!notice}
        autoHideDuration={3000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={notice?.severity} variant="filled" onClose={() => setNotice(null)}>
          {notice?.message}
        </Alert>
      </Snackbar>
    </>
  );
}