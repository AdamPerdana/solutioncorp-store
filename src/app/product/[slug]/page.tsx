import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ProductCard from "@/components/product/ProductCard";
import AddToCart from "@/components/product/AddToCart";
import { getProducts, getProductBySlug } from "@/lib/products";
import { formatRupiah } from "@/lib/format";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

const HIGHLIGHTS = [
  { Icon: LocalShippingOutlinedIcon, text: "Pengiriman 24 jam" },
  { Icon: VerifiedUserOutlinedIcon, text: "Produk resmi & legal" },
  { Icon: Inventory2OutlinedIcon, text: "Siap pesanan partai besar" },
];

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produk tidak ditemukan | Solution Corp Indonesia" };
  }

  return {
    title: `${product.name} | Solution Corp Indonesia`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const otherProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <Container component="main" sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 6, md: 8 } }}>
      <Button href="/#produk" startIcon={<ArrowBackIcon />} color="inherit" sx={{ mb: 3 }}>
        Kembali ke katalog
      </Button>

      <Grid container spacing={{ xs: 3, md: 6 }}>
        {/* Foto */}
        <Grid size={{ xs: 12, md: 6 }}>
          {product.image ? (
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{ width: "100%", aspectRatio: "1 / 1", objectFit: "cover", borderRadius: 3 }}
            />
          ) : (
            <Box
              sx={{
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                bgcolor: "rgba(62,157,217,0.08)",
              }}
            >
              <LocalFireDepartmentIcon color="primary" sx={{ fontSize: 120 }} />
            </Box>
          )}
        </Grid>

        {/* Info produk */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4" component="h1">
            {product.name}
          </Typography>
          <Typography variant="h5" color="secondary" sx={{ mt: 2, fontWeight: 600 }}>
            {formatRupiah(product.price)}
          </Typography>

          <AddToCart product={product} />

          {/* Keunggulan */}
          <List dense sx={{ mt: 2 }}>
            {HIGHLIGHTS.map(({ Icon, text }) => (
              <ListItem key={text} disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" gutterBottom>
            Deskripsi
          </Typography>
          <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {product.description}
          </Typography>

          {/* Spesifikasi */}
          {product.specs.length > 0 && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 4, mb: 1 }}>
                Spesifikasi
              </Typography>
              <Paper variant="outlined">
                <Table size="small">
                  <TableBody>
                    {product.specs.map((spec) => (
                      <TableRow key={spec.label} sx={{ "&:last-child td": { border: 0 } }}>
                        <TableCell sx={{ color: "text.secondary", width: "40%" }}>
                          {spec.label}
                        </TableCell>
                        <TableCell>{spec.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </>
          )}
        </Grid>
      </Grid>

      {/* Produk lainnya */}
      {otherProducts.length > 0 && (
        <Box sx={{ mt: { xs: 8, md: 10 } }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
            Produk lainnya
          </Typography>
          <Grid container spacing={2}>
            {otherProducts.map((p) => (
              <Grid key={p.id} size={{ xs: 6, sm: 4, md: 3 }}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}