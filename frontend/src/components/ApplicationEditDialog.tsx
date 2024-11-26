import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import { Application } from "../logic/types";

type ApplicationEditDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialState: Application;
  editApplication: (editedState: Application) => void;
};

export default function ApplicatonEditDialog({
  open,
  setOpen,
  initialState,
  editApplication,
}: ApplicationEditDialogProps) {
  const [editedState, setEditedState] = useState(initialState);
  useEffect(() => {
    setEditedState(initialState);
  }, [initialState]);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedState({ ...editedState, [key]: e.target.value });
  };

  const handleEdit = () => {
    editApplication(editedState);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(initialState) as Array<keyof Application>).map(
            (key) => (
              <Grid size={{ xs: 6 }} key={key}>
                <TextField
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={editedState[key]}
                  onChange={(event) => handleChange(key, event)}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            )
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleEdit} color="primary">
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
