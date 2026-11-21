"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { login } from "@/app/admin/login/actions";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login({ username, password });

    // Kalau berhasil, server langsung mengarahkan ke /admin,
    // jadi kode di bawah ini hanya jalan kalau login gagal.
    setSubmitting(false);
    setError(result.error);
  };

  return (
    <Paper variant="outlined" sx={{ p: 4, width: "100%", maxWidth: 400 }}>
      <Stack component="form" spacing={2.5} onSubmit={handleSubmit} noValidate>
        <Stack sx={{ alignItems: "center", mb: 1 }}>
          <LockOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5" component="h1" sx={{ mt: 1 }}>
            Login Admin
          </Typography>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button type="submit" variant="contained" size="large" loading={submitting}>
          Masuk
        </Button>
      </Stack>
    </Paper>
  );
}