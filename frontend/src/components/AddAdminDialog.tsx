import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";

type AdminRegistrationDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addAdmin: (login: string, password: string) => void;
};

export default function AdminRegistrationDialog({
  open,
  setOpen,
  addAdmin,
}: AdminRegistrationDialogProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [adminAdded, setAdminAdded] = useState(false);

  const handleRegisterClick = () => {
    if (!confirmDialog) {
      setConfirmDialog(true);
    } else {
      addAdmin(login, password);
      handleClose();
      setAdminAdded(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setLogin("");
    setPassword("");
    setConfirmDialog(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Admin Registration</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Login"
            type="text"
            fullWidth
            variant="outlined"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleRegisterClick}
            color={confirmDialog ? "warning" : "primary"}
          >
            {confirmDialog ? "Confirm" : "Register"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={adminAdded}
        autoHideDuration={6000}
        onClose={() => setAdminAdded(false)}
        message="Admin added successfully!"
      />
    </>
  );
}
