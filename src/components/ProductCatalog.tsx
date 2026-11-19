import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

type ProductCatalogProps = {
  products: Product[];
};

export default function ProductCatalog({ products }: ProductCatalogProps) {
  return (
    <Container component="main" id="produk" sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 8 } }}>
      <Typography variant="h5" component="h2">
        Katalog produk
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
        Sterno gel &amp; kaleng, siap kirim untuk skala hotel dan katering.
      </Typography>

      {products.length === 0 ? (
        <Paper variant="outlined" sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Belum ada produk yang tersedia saat ini.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <ProductCard product={product} featured={index === 0} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}