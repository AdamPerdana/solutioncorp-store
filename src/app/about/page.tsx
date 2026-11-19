import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import type { SvgIconComponent } from "@mui/icons-material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

export const metadata: Metadata = {
  title: "Tentang Kami | Solution Corp Indonesia",
  description:
    "PT Solution Corp Indonesia, distributor resmi sterno gel dan kaleng untuk Hotel, Restoran, dan Katering.",
};

type Value = {
  Icon: SvgIconComponent;
  title: string;
  desc: string;
};

const VALUES: Value[] = [
  {
    Icon: Inventory2OutlinedIcon,
    title: "Kapasitas Pasokan Besar",
    desc: "Manajemen inventaris gudang yang mumpuni. Kami siap melayani permintaan partai besar maupun kontrak suplai rutin tanpa kendala kekosongan barang.",
  },
  {
    Icon: LocalShippingOutlinedIcon,
    title: "Layanan Pengiriman 24 Jam",
    desc: "Operasional logistik kami bergerak fleksibel sepanjang hari untuk memastikan pengiriman darurat malam hari tetap berjalan demi kelancaran event Horeka Anda.",
  },
  {
    Icon: SupportAgentOutlinedIcon,
    title: "Dukungan Admin 24 Jam",
    desc: "Tim sales dan customer support kami siap melayani koordinasi, konsultasi volume kuota sterno, maupun pemesanan instan kapan pun Anda membutuhkannya.",
  },
  {
    Icon: VerifiedUserOutlinedIcon,
    title: "Distribusi Resmi & Legal",
    desc: "Seluruh produk sterno yang kami salurkan memiliki legalitas jelas dan melewati proses inspeksi mutu ketat sebelum serah terima.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          background:
            "radial-gradient(ellipse 600px 400px at 50% 0%, rgba(62,157,217,0.18), transparent)",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
            PT Solution Corp Indonesia
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 3, mx: "auto", maxWidth: 560 }}>
            Distributor resmi dan penyuplai utama produk bahan bakar portabel
            (sterno) berkualitas tinggi untuk kelancaran operasional industri
            hotel, restoran, dan katering di seluruh Indonesia.
          </Typography>
        </Container>
      </Box>

      <Container component="main" maxWidth="lg" sx={{ pb: 10 }}>
        {/* Sekilas perusahaan + visi */}
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Mitra suplai andal untuk dapur profesional Anda
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              PT Solution Corp Indonesia hadir sebagai jalur distribusi utama
              yang berdedikasi penuh dalam penyediaan produk Sterno Gel dan
              Sterno Kaleng. Kami memahami bahwa konsistensi dan efisiensi waktu
              adalah nyawa dari setiap operasional hotel, restoran, maupun
              katering.
            </Typography>
            <Typography color="text.secondary">
              Sebagai distributor terkemuka, kami menjembatani kebutuhan pasar
              dengan produk sterno bermutu tinggi yang dijamin aman, memiliki
              durasi pembakaran yang stabil, serta tidak memicu asap dan bau
              menyengat di area prasmanan klien Anda.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ border: 1, borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline" color="primary">
                  Visi kami
                </Typography>
                <Typography sx={{ mt: 1, fontStyle: "italic" }}>
                  &ldquo;Menjadi tulang punggung rantai pasok sterno nomor satu
                  di Indonesia, dengan mengedepankan ketersediaan stok skala
                  besar, ketepatan waktu pengiriman, dan kepercayaan mitra bisnis
                  jangka panjang.&rdquo;
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Mengapa memilih kami */}
        <Typography variant="h5" component="h2" sx={{ mt: 10, mb: 4, textAlign: "center" }}>
          Mengapa memilih kami
        </Typography>
        <Grid container spacing={2}>
          {VALUES.map(({ Icon, title, desc }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%", border: 1, borderColor: "divider" }}>
                <CardContent>
                  <Icon color="primary" sx={{ fontSize: 32, mb: 2 }} />
                  <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Ajakan */}
        <Box sx={{ mt: 10, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ maxWidth: 560, mx: "auto" }}>
            Mulai dari pemesanan kemasan eceran hingga pengadaan tonase untuk
            jaringan perhotelan &amp; katering, PT Solution Corp Indonesia
            berkomitmen menjadi rekanan B2B yang solutif.
          </Typography>
          <Button variant="contained" size="large" href="/#produk" sx={{ mt: 3 }}>
            Lihat produk kami
          </Button>
        </Box>
      </Container>
    </>
  );
}