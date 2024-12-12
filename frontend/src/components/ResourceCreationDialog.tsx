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
  DEFAULT_RESOURCE,
  ResourceStatus,
  RESOURCE_STATUSES,
} from "../logic/types";

type ResourceCreateDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createResource: (createdState: Resource) => void;
};

export default function ResourceCreateDialog({
  open,
  setOpen,
  createResource,
}: ResourceCreateDialogProps) {
  const [createdState, setCreatedState] = useState(DEFAULT_RESOURCE);

  useEffect(() => {
    setCreatedState(DEFAULT_RESOURCE);
  }, [open]);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreatedState({ ...createdState, [key]: e.target.value });
  };

  const handleCreate = () => {
    createResource(createdState);
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(createdState) as Array<keyof Resource>).map((key) => (
            <Grid size={{ xs: 6 }} key={key}>
              {key === "status" ? (
                <FormControl
                  fullWidth
                  margin="normal"
                  sx={{ "& .MuiInputLabel-root": { top: "-10px" } }}
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={createdState.status}
                    onChange={(event) =>
                      setCreatedState({
                        ...createdState,
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
                  value={createdState[key]}
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
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
