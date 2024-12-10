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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Application, ApplicationWithId } from "../logic/types";

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
  const [editedState, setEditedState] = useState<Application>({
    date: initialState.date,
    organization: initialState.organization,
    contactName: initialState.contactName,
    telegramId: initialState.telegramId,
    requestText: initialState.requestText,
    status: initialState.status,
  });
  useEffect(() => {
    setEditedState({
      date: initialState.date,
      organization: initialState.organization,
      contactName: initialState.contactName,
      telegramId: initialState.telegramId,
      requestText: initialState.requestText,
      status: initialState.status,
    });
  }, [initialState]);
  const [statusPopoverAnchor, setStatusPopoverAnchor] =
    useState<null | HTMLElement>(null);
  const [status, setStatus] = useState(initialState.status);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditedState({ ...editedState, [key]: e.target.value });
  };

  const handleEdit = () => {
    editApplication({ ...editedState, ["_id"]: initialState._id });
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

  const statusOptions = [
    "INCOMING",
    "RESOURCES_SEARCH",
    "RESOURCES_ATTACHED",
    "IN_WORK",
    "ENDED",
    "DECLINED_BY_SCOUT",
    "DECLINED_BY_CLIENT",
  ];

  return (
    <Dialog open={open}>
      <DialogTitle>Edit Information</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {(Object.keys(editedState) as Array<keyof Application>).map((key) => (
            <Grid size={{ xs: 6 }} key={key}>
              {key === "status" ? (
                <TextField
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={editedState[key]}
                  onChange={(event) => handleChange(key, event)}
                  fullWidth
                  margin="normal"
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
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
