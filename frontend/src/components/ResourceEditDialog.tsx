import { useState, useEffect } from "react";
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
import { Resource, ResourceWithId } from "../logic/types";
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
  const [editedState, setEditedState] = useState<Resource>({
    date: initialState.date,
    organization: initialState.organization,
    contactName: initialState.contactName,
    telegramId: initialState.telegramId,
    competenceField: initialState.competenceField,
    description: initialState.description,
    tags: initialState.tags,
    status: initialState.status,
  });

  useEffect(() => {
    setEditedState({
      date: initialState.date,
      organization: initialState.organization,
      contactName: initialState.contactName,
      telegramId: initialState.telegramId,
      competenceField: initialState.competenceField,
      description: initialState.description,
      tags: initialState.tags,
      status: initialState.status,
    });
  }, [initialState]);

  const [statusPopoverAnchor, setStatusPopoverAnchor] =
    useState<null | HTMLElement>(null);
  const [status, setStatus] = useState(initialState.status);

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
    editResource({ ...editedState, ["_id"]: initialState._id });
    setOpen(false);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setEditedState({ ...editedState, status: newStatus });
    setStatusPopoverAnchor(null);
  };

  const handleOpenPopover = (event: React.MouseEvent<HTMLElement>) => {
    setStatusPopoverAnchor(event.currentTarget);
  };

  const handleClosePopover = () => {
    setStatusPopoverAnchor(null);
  };

  const statusOptions = ["IN_WORK", "AVAILABLE"];

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(editedState) as Array<keyof Resource>).map((key) => (
            <Grid size={{ xs: 6 }} key={key}>
              {key === "status" ? (
                <TextField
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={editedState[key]}
                  onChange={(event) => handleChange(key, event)}
                  fullWidth
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                  margin="normal"
                />
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
        <Grid size={{ xs: 12 }}>
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
