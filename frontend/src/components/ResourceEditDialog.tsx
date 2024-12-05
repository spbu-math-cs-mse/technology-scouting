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
  MenuList,
  Popover,
} from "@mui/material";
import {
  Resource,
  RESOURCE_STATUSES,
  ResourceStatus,
  ResourceWithId,
  toResource,
} from "../logic/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

  const [statusPopoverAnchor, setStatusPopoverAnchor] =
    useState<null | HTMLElement>(null);

  const handleChange = (
    key: keyof Resource,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedState({
      ...editedState,
      [key]: key === "tags" ? e.target.value.split(", ") : e.target.value,
    });
  };

  const handleEdit = () => {
    editResource({ ...editedState, _id: initialState._id });
    setOpen(false);
  };

  const handleStatusChange = (newStatus: ResourceStatus) => {
    setEditedState({ ...editedState, status: newStatus });
    setStatusPopoverAnchor(null);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setStatusPopoverAnchor(event.currentTarget);
  };

  const handleClosePopover = () => {
    setStatusPopoverAnchor(null);
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(editedState) as Array<keyof Resource>).map((key) => (
            <Grid size={{ xs: 6 }} key={key}>
              <TextField
                name={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={editedState[key]}
                onChange={(event) => handleChange(key, event)}
                fullWidth
                slotProps={{
                  input: {
                    readOnly: key === "status" ? true : false,
                  },
                }}
                margin="normal"
              />
            </Grid>
          ))}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Button
            aria-label="status"
            onClick={handleOpenPopover}
            size="small"
            color="primary"
            startIcon={<ExpandMoreIcon />}
          >
            Change Status (Current: {editedState.status})
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
              {RESOURCE_STATUSES.map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => handleStatusChange(option)}
                >
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
