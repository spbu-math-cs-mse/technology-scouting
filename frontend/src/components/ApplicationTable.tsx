import { useEffect, useState } from "react";
import { ApplicationWithId } from "../logic/types.ts";
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
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ApplicationEditDialog from "./ApplicationEditDialog.tsx";

export default function ApplicationTable() {
  const [tableContent, setTableContent] = useState<ApplicationWithId[]>([]);

  const [selectedForDeleteRequestId, setSelectedForDeleteRequestId] = useState<
    string | null
  >(null);
  
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

  useEffect(() => {
    getApplicationDataTable().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getApplicationDataTable().then((messages) => setTableContent(messages));
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
                <TableCell>{application.status}</TableCell>
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
                  <Button
                    aria-label="edit"
                    size="large"
                    color="warning"
                    onClick={() => {
                      setEditingApplication(application);
                      setApplicationEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editingApplication ? (
        <ApplicationEditDialog
          open={applicationEditDialogOpen}
          setOpen={setApplicationEditDialogOpen}
          editApplication={(editedState: ApplicationWithId) => {
            postEditApplication(editedState);
            getApplicationDataTable().then((messages) =>
              setTableContent(messages)
            );
          }}
          initialState={editingApplication}
        />
      ) : (
        <></>
      )}
    </>
  );
}
