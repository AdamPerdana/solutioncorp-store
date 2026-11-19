"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", pt: 7, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Tentang perusahaan */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <LocalFireDepartmentIcon color="primary" fontSize="small" />
              <Typography sx={{ fontWeight: 600 }}>Solution Corp Indonesia</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, maxWidth: 360 }}>
              Distributor resmi bahan bakar sterno (gel &amp; kaleng) untuk
              kebutuhan Hotel, Restoran, dan Katering di seluruh Indonesia.
            </Typography>
          </Grid>

          {/* Navigasi */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Navigasi
            </Typography>
            <Stack spacing={1}>
              {FOOTER_LINKS.map((link) => (
                <MuiLink
                  key={link.href}
                  component={Link}
                  href={link.href}
                  variant="body2"
                  color="text.secondary"
                  underline="hover"
                >
                  {link.label}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Alamat */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" gutterBottom>
              Kantor Operasional
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Jakarta, Indonesia
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2020 - {new Date().getFullYear()} PT Solution Corp Indonesia.
          </Typography>
          <Chip
            icon={<VerifiedOutlinedIcon />}
            label="ISO 9001:2015 & KAN"
            size="small"
            variant="outlined"
          />
        </Stack>
      </Container>
    </Box>
  );
}