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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Resource,
  RESOURCE_STATUSES,
  ResourceStatus,
  ResourceWithId,
  toResource,
} from "../logic/types";

type ResourceEditDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialState: ResourceWithId;
  editResource: (editedState: ResourceWithId) => void;
};

export default function ResourceEditDialog({
  open,
  setOpen,
  initialState,
  editResource,
}: ResourceEditDialogProps) {
  const [editedState, setEditedState] = useState(toResource(initialState));

  useEffect(() => {
    setEditedState(toResource(initialState));
  }, [initialState]);

  const handleChange = (
    key: keyof Resource,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedState({
      ...editedState,
      [key]:
        key === "tags" || key === "associatedApplications"
          ? e.target.value.split(", ")
          : e.target.value,
    });
  };

  const handleEdit = () => {
    editResource({ ...editedState, _id: initialState._id });
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(editedState) as Array<keyof Resource>).map((key) => (
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
                        status: event.target.value as ResourceStatus,
                      })
                    }
                    fullWidth
                  >
                    {RESOURCE_STATUSES.map((status) => (
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
          Cancel
        </Button>
        <Button onClick={handleEdit} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
}
