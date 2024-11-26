import { useEffect, useState } from "react";
import { ResourceMessage, ResourceMessageWithId } from "../logic/types.ts";
import { getResourcesDataTable, postDeleteResource } from "../logic/request.ts";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  MenuList,
  Popover,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ResourceTable() {
  const [tableContent, setTableContent] = useState<ResourceMessageWithId[]>([]);

  const [selectedForDeleteRequestId, setSelectedForDeleteRequestId] = useState<
    string | null
  >(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRow, setActiveRow] = useState<string | null>(null);

  const handleOpenDialogForDelete = (id: string) => {
    setSelectedForDeleteRequestId(id);
  };
  const handleCloseDialogForDelete = () => {
    setSelectedForDeleteRequestId(null);
  };

  const handleConfirmDelete = (id: string) => {
    setSelectedForDeleteRequestId(null);
    postDeleteResource(id);
    getResourcesDataTable().then((messages) => setTableContent(messages));
  };

  const handleEditStatus = (id: string, new_status: string) => {
    //postEditApplication(id, new_status);
    getResourcesDataTable().then((messages) => setTableContent(messages));
    handleClosePopover();
  };

  const handleOpenPopover = (
    event: React.MouseEvent<HTMLElement>,
    rowIndex: string
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(rowIndex);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  const statusOptions = ["Pending", "Approved", "Rejected", "In Progress"];

  const isPopoverOpen = Boolean(anchorEl);

  useEffect(() => {
    getResourcesDataTable().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getResourcesDataTable().then((messages) => setTableContent(messages));
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
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
          {tableContent.map((resourceMessage, ind) => (
            <TableRow key={ind}>
              <TableCell>{resourceMessage._id}</TableCell>
              <TableCell>{resourceMessage.date}</TableCell>
              <TableCell>{resourceMessage.organization}</TableCell>
              <TableCell>{resourceMessage.contactName}</TableCell>
              <TableCell>{resourceMessage.telegramId}</TableCell>
              <TableCell>{resourceMessage.competenceField}</TableCell>
              <TableCell>{resourceMessage.description}</TableCell>
              <TableCell>{resourceMessage.tags.join(", ")}</TableCell>
              <TableCell>{resourceMessage.status}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  size="large"
                  color="error"
                  onClick={() =>
                    handleOpenDialogForDelete(resourceMessage._id)
                  }
                >
                  <DeleteIcon />
                </IconButton>
                <Dialog
                  open={selectedForDeleteRequestId != null}
                  onClose={handleCloseDialogForDelete}
                >
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogContent>
                    Do you really want to delete item with id{" "}
                    {selectedForDeleteRequestId}. This action cannot be undone.
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleCloseDialogForDelete}
                      color="primary"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() =>
                        handleConfirmDelete(resourceMessage._id)
                      }
                      color="error"
                      variant="contained"
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
