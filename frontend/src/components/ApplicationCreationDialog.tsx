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
  DEFAULT_APPLICATION,
  ApplicationStatus,
} from "../logic/types";

type ApplicationCreateDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  createApplication: (createdState: Application) => void;
};

export default function ApplicatonCreateDialog({
  open,
  setOpen,
  createApplication,
}: ApplicationCreateDialogProps) {
  const [createdState, setCreatedState] = useState(DEFAULT_APPLICATION);

  useEffect(() => {
    setCreatedState(DEFAULT_APPLICATION);
  }, [open]);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCreatedState({
      ...createdState,
      [key]:
        key === "associatedResources"
          ? e.target.value.split(", ")
          : e.target.value,
    });
  };

  const handleCreate = () => {
    createApplication(createdState);
    setOpen(false);
  };

  /** Generate form fields dynamically based on resource keys
   * for status - drop down
   * for telegram id - only numbers can be entered
   */

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(createdState) as Array<keyof Application>).map(
            (key) => (
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
                ) : key === "telegramId" ? (
                  <TextField
                    name={key}
                    type="number"
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={createdState[key]}
                    onChange={(event) => handleChange(key, event)}
                    fullWidth
                    margin="normal"
                  />
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
            )
          )}
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
