"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import type { Product } from "@/types";
import { formatRupiah } from "@/lib/utils/format";

type ProductCardProps = {
  product: Product;
  featured?: boolean;
};

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  return (
    <Card sx={{ height: "100%", border: 1, borderColor: "divider" }}>
      <CardActionArea
        component={Link}
        href={`/product/${product.slug}`}
        sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}
      >
        <Box sx={{ position: "relative" }}>
          {product.image ? (
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              sx={{ aspectRatio: "1 / 1", objectFit: "cover" }}
            />
          ) : (
            <Box
              sx={{
                aspectRatio: "1 / 1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(62,157,217,0.08)",
              }}
            >
              <LocalFireDepartmentIcon color="primary" sx={{ fontSize: 56 }} />
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
            {product.name}
          </Typography>
          <Typography color="secondary" sx={{ fontWeight: 600, mt: 0.5 }}>
            {formatRupiah(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}