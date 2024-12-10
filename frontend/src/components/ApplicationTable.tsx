import { useEffect, useState } from "react";
import {
  ApplicationWithId,
  ResourceWithId,
  Application,
  DEFAULT_APPLICATION,
} from "../logic/types.ts";
import {
  //getResourcesDataTable,
  getResourcesDataTableMock as getResourcesDataTable,
  //getApplicationDataTable,
  getApplicationDataTableMock as getApplicationDataTable,
  postDeleteApplication,
  postEditApplication,
  postAssignResources,
  postCreateApplication,
} from "../logic/request.ts";
import {
  Box,
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
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ApplicationEditDialog from "./ApplicationEditDialog.tsx";
import ApplicatonCreateDialog from "./ApplicationCreationDialog.tsx";
import ResourceAssignDialog from "./ResourceAssignDialog.tsx";
import {
  getFittingCharacters,
  renderWithTooltip,
  StyledTableCell,
} from "./TableFitting.tsx";

export default function ApplicationTable() {
  const font = "14px Times New Roman";
  const maxWidthByColumn = {
    date: 50,
    organization: 80,
    contactName: 50,
    telegramId: 50,
    requestText: 100,
    status: 100,
  };

  const [applicationTable, setApplicationTable] = useState<ApplicationWithId[]>(
    []
  );
  const [resourcesToAssign, setResourcesToAssign] = useState<ResourceWithId[]>(
    []
  );

  const [selectedForDeleteRequestId, setSelectedForDeleteRequestId] = useState<
    string | null
  >(null);

  const [applicationEditDialogOpen, setApplicationEditDialogOpen] =
    useState(false);

  const [editingApplication, setEditingApplication] = useState<
    ApplicationWithId | undefined
  >(undefined);

  const [applicationCreateDialogOpen, setApplicationCreateDialogOpen] =
    useState(false);

  const [createdApplication, setCreatedApplication] = useState<
    Application | undefined
  >(undefined);

  const [resourceAssignDialogOpen, setResourceAssignDialogOpen] =
    useState(false);

  const [applicationAssignTo, setApplicationAssignTo] = useState<
    ApplicationWithId | undefined
  >(undefined);

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

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setCreatedApplication(DEFAULT_APPLICATION);
            setApplicationCreateDialogOpen(true);
          }}
          sx={{ font: font }}
        >
          Create Application
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ font: font, textAlign: "center" }}>
                Date
              </TableCell>
              <TableCell sx={{ font: font, textAlign: "center" }}>
                Organization
              </TableCell>
              <TableCell sx={{ font: font, textAlign: "center" }}>
                Contact name
              </TableCell>
              <TableCell sx={{ font: font, textAlign: "center" }}>
                Telegram id
              </TableCell>
              <TableCell sx={{ font: font, textAlign: "center" }}>
                Request text
              </TableCell>
              <TableCell sx={{ font: font, textAlign: "center" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationTable.map((application, ind) => (
              <TableRow key={ind}>
                <TableCell sx={{ font: font, textAlign: "center" }}>
                  {application.date}
                </TableCell>
                <StyledTableCell
                  font={font}
                  maxWidth={maxWidthByColumn.organization}
                >
                  {renderWithTooltip(
                    application.organization,
                    maxWidthByColumn.organization,
                    font
                  )}
                </StyledTableCell>
                <StyledTableCell
                  font={font}
                  maxWidth={maxWidthByColumn.contactName}
                >
                  {renderWithTooltip(
                    application.contactName,
                    maxWidthByColumn.contactName,
                    font
                  )}
                </StyledTableCell>

                <StyledTableCell
                  font={font}
                  maxWidth={maxWidthByColumn.telegramId}
                >
                  {renderWithTooltip(
                    application.telegramId.toString(),
                    maxWidthByColumn.telegramId,
                    font
                  )}
                </StyledTableCell>
                <StyledTableCell
                  font={font}
                  maxWidth={maxWidthByColumn.requestText}
                >
                  {renderWithTooltip(
                    application.requestText,
                    maxWidthByColumn.requestText,
                    font
                  )}
                </StyledTableCell>
                <StyledTableCell font={font} maxWidth={maxWidthByColumn.status}>
                  {renderWithTooltip(
                    application.status,
                    maxWidthByColumn.status,
                    font
                  )}
                </StyledTableCell>

                <TableCell sx={{ gap: 1 }}>
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
                <TableCell sx={{ gap: 1 }}>
                  <Button
                    aria-label="edit"
                    color="warning"
                    onClick={() => {
                      setEditingApplication(application);
                      setApplicationEditDialogOpen(true);
                    }}
                    style={{
                      font: font,
                      width: "10px",
                      height: "25px",
                      padding: "5px 10px",
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
                {application.status === "incoming" && (
                  <TableCell sx={{ gap: 1 }}>
                    <Button
                      aria-label="edit"
                      color="warning"
                      onClick={() => {
                        setApplicationAssignTo(application);
                        setResourceAssignDialogOpen(true);
                        getResourcesDataTable().then((resources) =>
                          setResourcesToAssign(resources)
                        );
                      }}
                      style={{
                        font: font,
                        width: "10px",
                        height: "25px",
                        padding: "5px 10px",
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

      {createdApplication && (
        <ApplicatonCreateDialog
          open={applicationCreateDialogOpen}
          setOpen={setApplicationCreateDialogOpen}
          createApplication={(createdState: Application) => {
            postCreateApplication(createdState);
            getApplicationDataTable().then((messages) =>
              setApplicationTable(messages)
            );
          }}
        />
      )}

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
          assignResources={(resourceIds: string[], message: string) =>
            postAssignResources(applicationAssignTo._id, resourceIds, message)
          }
          resources={resourcesToAssign}
        />
      )}
    </>
  );
}
