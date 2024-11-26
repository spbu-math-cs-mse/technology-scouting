import { useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  MenuList,
  Popover,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Resource} from "../logic/types"

type ResourceEditDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialState: Resource;
  editResource: (editedState: Resource) => void;
};

export default function ResourceEditDialog({
  open,
  setOpen,
  initialState,
  editResource,
}: ResourceEditDialogProps) {
  const [editedState, setEditedState] = useState(initialState);
  const [statusPopoverAnchor, setStatusPopoverAnchor] = useState<null | HTMLElement>(null);
  const [status, setStatus] = useState(initialState.status);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedState({ ...editedState, [key]: e.target.value });
  };

  const handleEdit = () => {
    editResource(editedState);
    setOpen(false);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setEditedState({ ...editedState, status: newStatus });
    setStatusPopoverAnchor(null); // Закрыть поповер после изменения статуса
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setStatusPopoverAnchor(event.currentTarget);
  };

  const handleClosePopover = () => {
    setStatusPopoverAnchor(null);
  };

  const statusOptions = ["Pending", "Approved", "Rejected", "In Progress"];

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(initialState) as Array<keyof Resource>).map((key) => (
            <Grid item xs={6} key={key}>
              <TextField
                name={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={editedState[key]}
                onChange={(event) => handleChange(key, event)}
                fullWidth
                margin="normal"
              />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12}>
          <Button
            aria-label="status"
            onClick={handleOpenPopover}
            size="small"
            color="primary"
            startIcon={<ExpandMoreIcon />}
          >
            Change Status (Current: {status})
          </Button>

          <Popover
            open={Boolean(statusPopoverAnchor)}
            anchorEl={statusPopoverAnchor}
            onClose={handleClosePopover}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuList>
              {statusOptions.map((option) => (
                <MenuItem key={option} onClick={() => handleStatusChange(option)}>
                  {option}
                </MenuItem>
              ))}
            </MenuList>
          </Popover>
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
