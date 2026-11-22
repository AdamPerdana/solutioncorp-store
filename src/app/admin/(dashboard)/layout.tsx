import Box from "@mui/material/Box";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SIDEBAR_WIDTH } from "@/components/admin/constants";
import { requireAdmin } from "@/lib/auth/auth";

export default async function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdmin();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar username={admin.username} />
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          pt: { xs: 10, md: 4 },
          pb: 6,
          px: { xs: 2, md: 4 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}