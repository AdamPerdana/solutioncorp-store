"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { validatePassword, validateUsername } from "@/lib/admin-form";
import { changePassword, createAdmin, deleteAdmin } from "@/app/admin/(dashboard)/accounts/actions";

export type AdminAccountRow = {
  id: number;
  username: string;
  createdAt: string;
  isCurrent: boolean;
};

type AccountManagerProps = {
  admins: AdminAccountRow[];
};

type Notice = { severity: "success" | "error"; message: string };

export default function AccountManager({ admins }: AccountManagerProps) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<AdminAccountRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!adminToDelete) return;
    setDeleting(true);
    const result = await deleteAdmin(adminToDelete.id);
    setDeleting(false);
    setAdminToDelete(null);
    setNotice(
      result.ok
        ? { severity: "success", message: result.message }
        : { severity: "error", message: result.error },
    );
  };

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3 }}>
        <Button variant="contained" startIcon={<PersonAddOutlinedIcon />} onClick={() => setAddOpen(true)}>
          Tambah admin
        </Button>
        <Button variant="outlined" startIcon={<KeyOutlinedIcon />} onClick={() => setPasswordOpen(true)}>
          Ganti password saya
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ maxWidth: 640 }}>
        <List disablePadding>
          {admins.map((admin, index) => (
            <Stack key={admin.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                secondaryAction={
                  !admin.isCurrent && (
                    <Tooltip title="Hapus">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => setAdminToDelete(admin)}
                        aria-label={`Hapus ${admin.username}`}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
                    <PersonOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <span>{admin.username}</span>
                      {admin.isCurrent && <Chip label="Anda" size="small" color="primary" />}
                    </Stack>
                  }
                  secondary={`Dibuat ${admin.createdAt} WIB`}
                />
              </ListItem>
            </Stack>
          ))}
        </List>
      </Paper>

      <AddAdminDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={(message) => setNotice({ severity: "success", message })}
      />

      <ChangePasswordDialog
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSuccess={(message) => setNotice({ severity: "success", message })}
      />

      {/* Konfirmasi hapus */}
      <Dialog open={!!adminToDelete} onClose={() => !deleting && setAdminToDelete(null)}>
        <DialogTitle>Hapus admin?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Akun <b>{adminToDelete?.username}</b> tidak akan bisa login lagi ke dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdminToDelete(null)} disabled={deleting} color="inherit">
            Batal
          </Button>
          <Button onClick={handleDelete} loading={deleting} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!notice}
        autoHideDuration={3000}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={notice?.severity} variant="filled" onClose={() => setNotice(null)}>
          {notice?.message}
        </Alert>
      </Snackbar>
    </>
  );
}

// dialog: tambah admin

type DialogProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

function AddAdminDialog({ open, onClose, onSuccess }: DialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const close = () => {
    setUsername("");
    setPassword("");
    setConfirm("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError =
      validateUsername(username.trim()) ??
      validatePassword(password) ??
      (password !== confirm ? "Konfirmasi password tidak sama" : null);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    const result = await createAdmin({ username, password });
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSuccess(result.message);
    close();
  };

  return (
    <Dialog open={open} onClose={() => !saving && close()} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>Tambah admin</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              helperText="Huruf, angka, dan _ (3-50 karakter)"
            />
            <TextField
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Minimal 8 karakter"
            />
            <TextField
              label="Ulangi password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} disabled={saving} color="inherit">
            Batal
          </Button>
          <Button type="submit" variant="contained" loading={saving}>
            Tambah
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// ganti password

function ChangePasswordDialog({ open, onClose, onSuccess }: DialogProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const close = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirm("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError =
      (currentPassword ? null : "Isi password saat ini") ??
      validatePassword(newPassword) ??
      (newPassword !== confirm ? "Konfirmasi password tidak sama" : null);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    const result = await changePassword({ currentPassword, newPassword });
    setSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSuccess(result.message);
    close();
  };

  return (
    <Dialog open={open} onClose={() => !saving && close()} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>Ganti password saya</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Password saat ini"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="Password baru"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Minimal 8 karakter"
            />
            <TextField
              label="Ulangi password baru"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={close} disabled={saving} color="inherit">
            Batal
          </Button>
          <Button type="submit" variant="contained" loading={saving}>
            Simpan
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}