import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { ResourceWithId } from "../logic/types";

export type ResourceAssignDialogProps = {
  resources: ResourceWithId[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assignResources: (ids: string[], message: string) => void;
};

export default function ResourceAssignDialog({
  resources,
  open,
  setOpen,
  assignResources,
}: ResourceAssignDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assignMessage, setAssignMessage] = useState<string>("");

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    assignResources(selectedIds, assignMessage);
    setSelectedIds([]);
    setOpen(false);
  };

  const handleAssignMessageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssignMessage(event.target.value);
  };

  const BoldTextCell = ({ text }: { text: string }) => (
    <TableCell sx={{ fontWeight: "bold" }}>{text}</TableCell>
  );

  return (
    <Dialog open={open} fullWidth maxWidth="lg">
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Assign Resources
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
        <TextField
          placeholder="Leave empty if you don't want to send any message."
          label="Message to Resources"
          value={assignMessage}
          onChange={handleAssignMessageChange}
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          variant="outlined"
          margin="normal"
        />

        <Divider sx={{ marginY: 2 }} />

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <BoldTextCell text="" />
                <BoldTextCell text="Date" />
                <BoldTextCell text="Organization" />
                <BoldTextCell text="Contact Name" />
                <BoldTextCell text="Telegram ID" />
                <BoldTextCell text="Competence Field" />
                <BoldTextCell text="Description" />
                <BoldTextCell text="Tags" />
                <BoldTextCell text="Status" />
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((resource, ind) => (
                <TableRow
                  key={ind}
                  sx={{ "&:hover": { backgroundColor: "#f1f1f1" } }}
                >
                  <TableCell>
                    <Checkbox
                      id={resource._id}
                      checked={selectedIds.includes(resource._id)}
                      onChange={() => handleCheckboxChange(resource._id)}
                    />
                  </TableCell>
                  <TableCell>{resource.date}</TableCell>
                  <TableCell>{resource.organization}</TableCell>
                  <TableCell>{resource.contactName}</TableCell>
                  <TableCell>{resource.telegramId}</TableCell>
                  <TableCell>{resource.competenceField}</TableCell>
                  <TableCell>{resource.description}</TableCell>
                  <TableCell>{resource.tags.join(", ")}</TableCell>
                  <TableCell>{resource.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          color="secondary"
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 16px",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          color="primary"
          variant="contained"
          disabled={selectedIds.length === 0}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            padding: "8px 16px",
            boxShadow:
              selectedIds.length === 0 ? "none" : "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
