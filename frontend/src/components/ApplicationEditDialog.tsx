import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Application,
  APPLICATION_STATUSES,
  ApplicationStatus,
  ApplicationWithId,
  toApplication,
} from "../logic/types";

type ApplicationEditDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialState: ApplicationWithId;
  editApplication: (editedState: ApplicationWithId) => void;
};

export default function ApplicatonEditDialog({
  open,
  setOpen,
  initialState,
  editApplication,
}: ApplicationEditDialogProps) {
  const [editedState, setEditedState] = useState(toApplication(initialState));

  useEffect(() => {
    setEditedState(toApplication(initialState));
  }, [initialState]);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedState({
      ...editedState,
      [key]:
        key === "associatedResources"
          ? e.target.value.split(", ")
          : e.target.value,
    });
  };

  const handleEdit = () => {
    editApplication({ ...editedState, _id: initialState._id });
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(editedState) as Array<keyof Application>).map((key) => (
            <Grid size={{ xs: 6 }} key={key}>
              {key === "status" ? (
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{ "& .MuiInputLabel-root": { top: "-10px" } }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={editedState.status}
                    onChange={(event) =>
                      setEditedState({
                        ...editedState,
                        status: event.target.value as ApplicationStatus,
                      })
                    }
                    fullWidth
                  >
                    {APPLICATION_STATUSES.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={editedState[key]}
                  onChange={(event) => handleChange(key, event)}
                  fullWidth
                  margin="normal"
                />
              )}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="secondary">
          Discard
        </Button>
        <Button onClick={handleEdit} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
