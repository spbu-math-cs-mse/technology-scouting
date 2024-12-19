import { useEffect, useState } from "react";
import {
  ApplicationWithId,
  ResourceWithId,
  Application,
  DEFAULT_APPLICATION,
} from "../logic/types.ts";
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
  SimpleStyledTableCell,
  StyledTableCell,
  renderWithTooltip,
  font,
  maxWidthByColumn,
} from "./TableFitting.tsx";
import usePrivateAPI from "../logic/usePrivateApi.ts";
import ApplicationDeleteConfirmDialog from "./DeleteConfirmDialog.tsx";

export default function ApplicationTable() {
  const {
    postDeleteApplication,
    getApplicationDataTable,
    getResourcesDataTable,
    postCreateApplication,
    postEditApplication,
    postAssignResources,
  } = usePrivateAPI();

  const [applicationTable, setApplicationTable] = useState<ApplicationWithId[]>(
    []
  );
  const [resourcesToAssign, setResourcesToAssign] = useState<ResourceWithId[]>(
    []
  );

  const [applicationIdToDelete, setApplicationIdToDelete] = useState<
    string | undefined
  >(undefined);
  const [applicationDeleteDialogOpen, setApplicationDeleteDialogOpen] =
    useState(false);

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
  }, [getApplicationDataTable]);

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
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <SimpleStyledTableCell> Date</SimpleStyledTableCell>
              <SimpleStyledTableCell>Organization</SimpleStyledTableCell>
              <SimpleStyledTableCell>Contact name</SimpleStyledTableCell>
              <SimpleStyledTableCell>Telegram id</SimpleStyledTableCell>
              <SimpleStyledTableCell>Request text</SimpleStyledTableCell>
              <SimpleStyledTableCell>Status</SimpleStyledTableCell>
              <SimpleStyledTableCell>Assigns</SimpleStyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationTable.map((application, ind) => (
              <TableRow key={ind}>
                <StyledTableCell maxWidth={maxWidthByColumn.date}>
                  {renderWithTooltip(application.date, maxWidthByColumn.date)}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.organization}>
                  {renderWithTooltip(
                    application.organization,
                    maxWidthByColumn.organization
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.contactName}>
                  {renderWithTooltip(
                    application.contactName,
                    maxWidthByColumn.contactName
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.telegramId}>
                  {renderWithTooltip(
                    application.telegramId.toString(),
                    maxWidthByColumn.telegramId
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.requestText}>
                  {renderWithTooltip(
                    application.requestText,
                    maxWidthByColumn.requestText
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.status}>
                  {renderWithTooltip(
                    application.status,
                    maxWidthByColumn.status
                  )}
                </StyledTableCell>

                <StyledTableCell
                  maxWidth={maxWidthByColumn.associatedResources}
                >
                  {renderWithTooltip(
                    application.associatedResources.join(", "),
                    maxWidthByColumn.associatedResources
                  )}
                </StyledTableCell>

                <TableCell sx={{ gap: 1 }}>
                  <IconButton
                    aria-label="delete"
                    size="large"
                    color="error"
                    onClick={() => {
                      setApplicationDeleteDialogOpen(true);
                      setApplicationIdToDelete(application._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
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
          createApplication={async (createdState: Application) =>
            setApplicationTable(await postCreateApplication(createdState))
          }
        />
      )}

      {editingApplication && (
        <ApplicationEditDialog
          open={applicationEditDialogOpen}
          setOpen={setApplicationEditDialogOpen}
          editApplication={async (editedState: ApplicationWithId) =>
            setApplicationTable(await postEditApplication(editedState))
          }
          initialState={editingApplication}
        />
      )}

      {applicationAssignTo && (
        <ResourceAssignDialog
          open={resourceAssignDialogOpen}
          setOpen={setResourceAssignDialogOpen}
          assignResources={async (resourceIds: string[], message: string) =>
            setApplicationTable(
              await postAssignResources(
                applicationAssignTo._id,
                resourceIds,
                message
              )
            )
          }
          resources={resourcesToAssign}
        />
      )}
      {applicationIdToDelete && (
        <ApplicationDeleteConfirmDialog
          open={applicationDeleteDialogOpen}
          setOpen={setApplicationDeleteDialogOpen}
          idToDelete={applicationIdToDelete}
          deleteAction={async (id: string) => {
            setApplicationTable(await postDeleteApplication(id));
          }}
        />
      )}
    </>
  );
}
