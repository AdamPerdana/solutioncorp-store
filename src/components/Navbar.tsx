"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(7,9,11,0.7)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1 }}>
            {/* Tombol menu, hanya muncul di HP */}
            <IconButton
              onClick={() => setMenuOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              aria-label="Buka menu"
            >
              <MenuIcon />
            </IconButton>

            {/* Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.primary",
                textDecoration: "none",
                flexGrow: 1,
              }}
            >
              <LocalFireDepartmentIcon color="primary" fontSize="small" />
              <Typography variant="subtitle1" component="span" sx={{ fontWeight: 600 }}>
                Solution Corp Indonesia
              </Typography>
            </Box>

            {/* Menu desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5 }}>
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  color={pathname === link.href ? "primary" : "inherit"}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Keranjang: fungsinya dibuat nanti */}
            <IconButton aria-label="Buka keranjang">
              <Badge badgeContent={0} color="primary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Menu samping untuk HP */}
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography variant="overline" sx={{ px: 2, color: "text.secondary" }}>
            Navigasi
          </Typography>
          <List>
            {NAV_LINKS.map((link) => (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                selected={pathname === link.href}
                onClick={() => setMenuOpen(false)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}