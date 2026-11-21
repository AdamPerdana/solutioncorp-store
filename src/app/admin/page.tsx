import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { requireAdmin } from "@/lib/auth";
import { logout } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Dashboard Admin | Solution Corp Indonesia",
};

export default async function AdminHomePage() {
  const admin = await requireAdmin();

  return (
    <Container component="main" maxWidth="md" sx={{ py: 6 }}>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
        >
          <div>
            <Typography variant="h5" component="h1">
              Halo, {admin.username} 👋
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Dashboard admin Solution Corp Indonesia.
            </Typography>
          </div>
          <form action={logout}>
            <Button type="submit" variant="outlined" startIcon={<LogoutIcon />}>
              Keluar
            </Button>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}