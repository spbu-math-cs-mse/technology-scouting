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
} from "@mui/material";
import { useState } from "react";
import { ResourceWithId } from "../logic/types";

export type ResourceAssignDialogProps = {
  resources: ResourceWithId[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  assignResources: (ids: string[]) => void;
};

export default function ResourceAssignDialog({
  resources,
  open,
  setOpen,
  assignResources,
}: ResourceAssignDialogProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    console.log(selectedIds);
    assignResources(selectedIds);
    setSelectedIds([]);
    setOpen(false);
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth={"lg"}>
      <DialogTitle>Assign Resources</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Checkbox</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell>ContactName</TableCell>
                <TableCell>TelegramId</TableCell>
                <TableCell>CompetenceField</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((resource, ind) => (
                <TableRow key={ind}>
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
        <Button onClick={() => setOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAssign} color="primary">
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
