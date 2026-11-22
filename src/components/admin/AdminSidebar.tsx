"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ContactPhoneOutlinedIcon from "@mui/icons-material/ContactPhoneOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "@/app/admin/(dashboard)/actions";
import { SIDEBAR_WIDTH } from "@/components/admin/constants";

const MENU = [
  { href: "/admin", label: "Ringkasan", Icon: DashboardOutlinedIcon },
  { href: "/admin/products", label: "Produk", Icon: Inventory2OutlinedIcon },
    { href: "/admin/leads", label: "Leads", Icon: ContactPhoneOutlinedIcon },
  { href: "/admin/accounts", label: "Akun admin", Icon: ManageAccountsOutlinedIcon },
];

type AdminSidebarProps = {
  username: string;
};

export default function AdminSidebar({ username }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // "/admin" hanya aktif kalau persis sama; menu lain aktif juga untuk sub-halamannya
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2, py: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Admin Solution Corp
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {username}
        </Typography>
      </Box>
      <Divider />

      <List sx={{ flex: 1, px: 1 }}>
        {MENU.map(({ href, label, Icon }) => (
          <ListItemButton
            key={href}
            component={Link}
            href={href}
            selected={isActive(href)}
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          component={Link}
          href="/"
          target="_blank"
          startIcon={<StorefrontOutlinedIcon />}
          color="inherit"
          sx={{ justifyContent: "flex-start" }}
        >
          Lihat toko
        </Button>
        <form action={logout}>
          <Button
            type="submit"
            fullWidth
            color="error"
            startIcon={<LogoutIcon />}
            sx={{ justifyContent: "flex-start" }}
          >
            Keluar
          </Button>
        </form>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Bar atas, hanya di HP */}
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{ display: { md: "none" }, borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Buka menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
            Admin Solution Corp
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menu samping versi HP: muncul saat tombol ☰ diklik */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH } }}
      >
        {content}
      </Drawer>

      {/* Menu samping versi laptop: selalu tampil */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box" },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}