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
import {
    Resource, DEFAULT_RESOURCE, ResourceStatus,
    RESOURCE_STATUSES
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
  const [statusPopoverAnchor, setStatusPopoverAnchor] =
    useState<null | HTMLElement>(null);

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

  const handleStatusChange = (newStatus: ResourceStatus) => {
    setCreatedState({ ...createdState, status: newStatus });
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
          {(Object.keys(createdState) as Array<keyof Resource>).map((key) => (
            <Grid size={{ xs: 6 }} key={key}>
              <TextField
                name={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={createdState[key]}
                onChange={(event) => handleChange(key, event)}
                fullWidth
                margin="normal"
                slotProps={{
                  input: {
                    readOnly: key === "status" ? true : false,
                  },
                }}
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
            Change Status (Current: {createdState.status})
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
        <Button onClick={handleCreate} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
