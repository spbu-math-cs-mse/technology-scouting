import { useEffect, useState } from "react";
import { Application, ApplicationWithId } from "../logic/types.ts";
import {
  getApplicationDataTable,
  getApplicationDataTableMock,
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
import ApplicatonEditDialog from "./ApplicationEditDialog.tsx";
import ApplicationEditDialog from "./ApplicationEditDialog.tsx";

export default function ApplicationTable() {
  const [tableContent, setTableContent] = useState<ApplicationWithId[]>([]);

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

  // const handleEditStatus = (id: string, new_status: string) => {
  //   postEditApplication(id, new_status);
  //   getApplicationDataTable().then((messages) => setTableContent(messages));
  //   handleClosePopover();
  // };

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
    getApplicationDataTableMock().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getApplicationDataTableMock().then((messages) => setTableContent(messages));
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [applicationEditDialogOpen, setApplicationEditDialogOpen] =
    useState(false);
  const [editingApplication, setEditingApplication] = useState<
    ApplicationWithId | undefined
  >(undefined);

  return (
    <>
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
            {tableContent.map((application, ind) => (
              <TableRow key={ind}>
                <TableCell>{application._id}</TableCell>
                <TableCell>{application.date}</TableCell>
                <TableCell>{application.organization}</TableCell>
                <TableCell>{application.contactName}</TableCell>
                <TableCell>{application.telegramId}</TableCell>
                <TableCell>{application.requestText}</TableCell>
                <TableCell>
                  {application.status}
                  <IconButton
                    onClick={(e) => handleOpenPopover(e, application._id)}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    size="large"
                    color="error"
                    onClick={() => handleOpenDialogForDelete(application._id)}
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
                      {selectedForDeleteRequestId}. This action cannot be
                      undone.
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={handleCloseDialogForDelete}
                        color="primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleConfirmDelete(application._id)}
                        color="error"
                        variant="contained"
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label="edit"
                    size="large"
                    color="warning"
                    onClick={() => {
                      setEditingApplication(application);
                      setApplicationEditDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
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
          {/* <MenuList>
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
          </MenuList> */}
        </Popover>
      </TableContainer>
      {editingApplication ? (
        <ApplicationEditDialog
          open={applicationEditDialogOpen}
          setOpen={setApplicationEditDialogOpen}
          editApplication={(editedState: ApplicationWithId) => {
            postEditApplication(editedState);
            getApplicationDataTableMock().then((messages) => setTableContent(messages));
          }}
          initialState={editingApplication}
        />
      ) : (
        <></>
      )}
    </>
  );
}
