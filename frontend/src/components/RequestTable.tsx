import { useEffect, useState } from "react";
import {
  ApplicationMessage,
  ApplicationMessageWithId,
} from "../logic/types.ts";
import {
  getApplicationDataTable,
  postDeleteApplication,
  postEditApplication,
} from "../logic/request.ts";
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

export default function RequestTable() {
  const [tableContent, setTableContent] = useState<ApplicationMessageWithId[]>(
    []
  );

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
    postDeleteApplication(id);
    getApplicationDataTable().then((messages) => setTableContent(messages));
  };

  const handleEditStatus = (id: string, new_status: string) => {
    postEditApplication(id, new_status);
    getApplicationDataTable().then((messages) => setTableContent(messages));
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
    getApplicationDataTable().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getApplicationDataTable().then((messages) => setTableContent(messages));
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
            <TableCell>RequestText</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableContent.map((applicationMessage, ind) => (
            <TableRow key={ind}>
              <TableCell>{applicationMessage._id}</TableCell>
              <TableCell>{applicationMessage.date}</TableCell>
              <TableCell>{applicationMessage.organization}</TableCell>
              <TableCell>{applicationMessage.contactName}</TableCell>
              <TableCell>{applicationMessage.telegramId}</TableCell>
              <TableCell>{applicationMessage.requestText}</TableCell>
              <TableCell>
                {applicationMessage.status}
                <IconButton
                  onClick={(e) => handleOpenPopover(e, applicationMessage._id)}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  size="large"
                  color="error"
                  onClick={() =>
                    handleOpenDialogForDelete(applicationMessage._id)
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
                        handleConfirmDelete(applicationMessage._id)
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
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
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
          {statusOptions.map((status) => (
            <MenuItem
              key={status}
              onClick={() =>
                activeRow !== null &&
                handleEditStatus(String(activeRow), status)
              }
              sx={{
                fontSize: "11px",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "#ADD8E6",
                },
                borderRadius: "8px",
                padding: "12px",
                color: "#333",
              }}
            >
              {status}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </TableContainer>
  );
}
