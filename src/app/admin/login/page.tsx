import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import LoginForm from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login Admin | Solution Corp Indonesia",
};

export default async function AdminLoginPage() {
  // Sudah login? Langsung ke dashboard
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <Box
      component="main"
      sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}
    >
      <LoginForm />
    </Box>
  );
}