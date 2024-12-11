import { useEffect, useState } from "react";
import {
  ApplicationWithId,
  ResourceWithId,
  Application,
  DEFAULT_APPLICATION,
} from "../logic/types.ts";
import {
  getResourcesDataTable,
  //getResourcesDataTableMock as getResourcesDataTable,
  getApplicationDataTable,
  //getApplicationDataTableMock as getApplicationDataTable,
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

function getFittingCharacters(
  text: string,
  width: number,
  font: string
): number {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.font = font;
  let currentWidth = 0;
  let charCount = 1000;

  for (let char of text) {
    currentWidth += context.measureText(char).width;
    if (currentWidth > width) break;
    charCount++;
  }

  return charCount;
}

export default function ApplicationTable() {
  const font = "12px Times New Roman";
  const maxWidthByColumn = {
    organization: 50,
    contactName: 50,
    telegramId: 50,
    requestText: 50,
    status: 50,
    associatedResources: 10,
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

      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
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
              <TableCell sx={{ font: font, textAlign: "center" }}>
                Assigns
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationTable.map((application, ind) => (
              <TableRow key={ind}>
                <TableCell sx={{ font: font, textAlign: "center" }}>
                  {application.date}
                </TableCell>

                <TableCell
                  sx={{
                    font: font,
                    textAlign: "center",
                    maxWidth: maxWidthByColumn.organization,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {application.organization.length >
                  getFittingCharacters(
                    application.organization,
                    maxWidthByColumn.organization,
                    font
                  ) ? (
                    <Tooltip
                      id={ind.toString() + "organization"}
                      title={application.organization}
                    >
                      <span>{application.organization}</span>
                    </Tooltip>
                  ) : (
                    <span>{application.organization}</span>
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    font: font,
                    textAlign: "center",
                    maxWidth: maxWidthByColumn.contactName,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {application.contactName.length >
                  getFittingCharacters(
                    application.contactName,
                    maxWidthByColumn.contactName,
                    font
                  ) ? (
                    <Tooltip
                      title={application.contactName}
                      id={ind.toString() + "contactName"}
                    >
                      <span>{application.contactName}</span>
                    </Tooltip>
                  ) : (
                    <span>{application.contactName}</span>
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    font: font,
                    textAlign: "center",
                  }}
                >
                  {application.telegramId.toString()}
                </TableCell>

                <TableCell
                  sx={{
                    font: font,
                    textAlign: "center",
                    maxWidth: maxWidthByColumn.requestText,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {application.requestText.length >
                  getFittingCharacters(
                    application.requestText,
                    maxWidthByColumn.requestText,
                    font
                  ) ? (
                    <Tooltip
                      id={ind.toString() + "requestText"}
                      title={application.requestText}
                    >
                      <span>{application.requestText}</span>
                    </Tooltip>
                  ) : (
                    <span>{application.requestText}</span>
                  )}
                </TableCell>

                <TableCell
                  sx={{
                    font: font,
                    textAlign: "center",
                    maxWidth: maxWidthByColumn.status,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {application.status.length >
                  getFittingCharacters(
                    application.status,
                    maxWidthByColumn.status,
                    font
                  ) ? (
                    <Tooltip
                      id={ind.toString() + "status"}
                      title={application.status}
                    >
                      <span>{application.status}</span>
                    </Tooltip>
                  ) : (
                    <span>{application.status}</span>
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    font: font,
                    textAlign: "center",
                    maxWidth: maxWidthByColumn.associatedResources,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {application.associatedResources.join(", ").length >
                  getFittingCharacters(
                    application.associatedResources.join(", "),
                    maxWidthByColumn.associatedResources,
                    font
                  ) ? (
                    <Tooltip
                      id={ind.toString() + "associatedResources"}
                      title={application.associatedResources.join(", ")}
                      placement="bottom-start"
                    >
                      <span>{application.associatedResources.join(", ")}</span>
                    </Tooltip>
                  ) : (
                    <span>{application.associatedResources.join(", ")}</span>
                  )}
                </TableCell>

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
