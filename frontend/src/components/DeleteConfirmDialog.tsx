import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

type ApplicationDeleteDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  idToDelete: string;
  deleteAction: (id: string) => void;
};

export default function DeleteConfirmDialog({
  open,
  setOpen,
  idToDelete,
  deleteAction,
}: ApplicationDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        Do you really want to delete item with id {` ${idToDelete}`}. This
        action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            deleteAction(idToDelete);
            setOpen(false);
          }}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
