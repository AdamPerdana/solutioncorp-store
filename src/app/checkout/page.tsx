import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Solution Corp Indonesia",
};

export default function CheckoutPage() {
  return (
    <Container component="main" sx={{ pt: { xs: 3, md: 5 }, pb: { xs: 6, md: 8 } }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
        Checkout
      </Typography>
      <CheckoutForm />
    </Container>
  );
}