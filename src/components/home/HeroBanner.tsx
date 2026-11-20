"use client";


import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
export default function HeroBanner() {
  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 6, md: 10 },
        pb: { xs: 3, md: 4 },
        background:
          "radial-gradient(ellipse 600px 400px at 50% 0%, rgba(62,157,217,0.18), transparent)",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontSize: { xs: "2.25rem", md: "3.75rem" }, lineHeight: 1.1 }}
        >
          Api yang stabil,
          <br />
          tanpa asap dan bau.
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 3, mx: "auto", maxWidth: 480, fontSize: "1.05rem" }}
        >
          Sterno gel PT Solution Corp Indonesia dirancang untuk kebutuhan
          operasional Hotel, Restoran, dan Katering, dengan pembakaran bersih
          dan konsisten dari batch pertama hingga terakhir.
        </Typography>
      </Container>
    </Box>
  );
}