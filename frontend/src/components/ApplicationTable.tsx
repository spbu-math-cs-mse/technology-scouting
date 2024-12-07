import { useEffect, useState } from "react";
import { ApplicationWithId, ResourceWithId } from "../logic/types.ts";
import {
  getResourcesDataTable,
  // getResourcesDataTableMock as getResourcesDataTable,
  getApplicationDataTable,
  // getApplicationDataTableMock as getApplicationDataTable,
  postDeleteApplication,
  postEditApplication,
  postAssignResources,
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
import ResourceAssignDialog from "./ResourceAssignDialog.tsx";

export default function ApplicationTable() {
  const [applicationTable, setApplicationTable] = useState<ApplicationWithId[]>(
    []
  );
  const [resourcesToAssign, setResourcesToAssign] = useState<ResourceWithId[]>(
    []
  );

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
    setTimeout(
      () =>
        getApplicationDataTable().then((messages) =>
          setApplicationTable(messages)
        ),
      500
    );
  };

  useEffect(() => {
    getApplicationDataTable().then((messages) => setApplicationTable(messages));
    const interval = setInterval(() => {
      getApplicationDataTable().then((messages) =>
        setApplicationTable(messages)
      );
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

  const [resourceAssignDialogOpen, setResourceAssignDialogOpen] =
    useState(false);

  const [applicationAssignTo, setApplicationAssignTo] = useState<
    ApplicationWithId | undefined
  >(undefined);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>ContactName</TableCell>
              <TableCell>Telegram id</TableCell>
              <TableCell>Request text</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationTable.map((application, ind) => (
              <TableRow key={ind}>
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
                {application.status === "Incoming" && (
                  <TableCell>
                    <Button
                      aria-label="edit"
                      size="large"
                      color="warning"
                      onClick={() => {
                        setApplicationAssignTo(application);
                        setResourceAssignDialogOpen(true);
                        getResourcesDataTable().then((resources) =>
                          setResourcesToAssign(resources)
                        );
                      }}
                    >
                      Assign
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {editingApplication && (
        <ApplicationEditDialog
          open={applicationEditDialogOpen}
          setOpen={setApplicationEditDialogOpen}
          editApplication={(editedState: ApplicationWithId) => {
            postEditApplication(editedState);
            getApplicationDataTable().then((messages) =>
              setApplicationTable(messages)
            );
          }}
          initialState={editingApplication}
        />
      )}

      {applicationAssignTo && (
        <ResourceAssignDialog
          open={resourceAssignDialogOpen}
          setOpen={setResourceAssignDialogOpen}
          assignResources={(resourceIds: string[]) =>
            postAssignResources(applicationAssignTo._id, resourceIds)
          }
          resources={resourcesToAssign}
        />
      )}
    </>
  );
}
