"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#3E9DD9" },
    secondary: { main: "#7FD4E8" },
    background: {
      default: "#07090B",
      paper: "#0F1318",
    },
    text: {
      primary: "#F1F5F7",
      secondary: "#7C8790",
    },
  },
  typography: {
    fontFamily: "var(--font-inter)",
    h1: { fontFamily: "var(--font-space-grotesk)", fontWeight: 600 },
    h2: { fontFamily: "var(--font-space-grotesk)", fontWeight: 600 },
    h3: { fontFamily: "var(--font-space-grotesk)", fontWeight: 600 },
    h4: { fontFamily: "var(--font-space-grotesk)", fontWeight: 600 },
    h5: { fontFamily: "var(--font-space-grotesk)", fontWeight: 600 },
    h6: { fontFamily: "var(--font-space-grotesk)", fontWeight: 600 },
    button: { textTransform: "none" },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;