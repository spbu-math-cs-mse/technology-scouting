import { useEffect, useState } from "react";
import { ResourceWithId, Resource, DEFAULT_RESOURCE } from "../logic/types.ts";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ResourceEditDialog from "./ResourceEditDialog.tsx";
import ResourceCreateDialog from "./ResourceCreationDialog.tsx";
import {
  SimpleStyledTableCell,
  StyledTableCell,
  renderWithTooltip,
  maxWidthByColumn,
} from "./TableFitting.tsx";
import usePrivateAPI from "../logic/usePrivateApi.ts";
import DeleteConfirmDialog from "./DeleteConfirmDialog.tsx";

export default function ResourceTable() {
  const {
    postDeleteResource,
    getResourcesDataTable,
    postCreateResource,
    postEditResource,
  } = usePrivateAPI();

  const [resourcesTable, setResourcesTable] = useState<ResourceWithId[]>([]);

  const [resourceIdToDelete, setResourceIdToDelete] = useState<
    string | undefined
  >(undefined);
  const [resourceDeleteDialogOpen, setResourceDeleteDialogOpen] =
    useState(false);

  const [resourceCreateDialogOpen, setResourceCreateDialogOpen] =
    useState(false);

  const [createdResource, setCreatedResource] = useState<Resource | undefined>(
    undefined
  );

  const [resourceEditDialogOpen, setResourceEditDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<
    ResourceWithId | undefined
  >(undefined);

  useEffect(() => {
    getResourcesDataTable().then((messages) => setResourcesTable(messages));
    const interval = setInterval(() => {
      getResourcesDataTable().then((messages) => setResourcesTable(messages));
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [getResourcesDataTable]);

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            setCreatedResource(DEFAULT_RESOURCE);
            setResourceCreateDialogOpen(true);
          }}
        >
          Create Resource
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow>
              <SimpleStyledTableCell>Date</SimpleStyledTableCell>
              <SimpleStyledTableCell>Organization</SimpleStyledTableCell>
              <SimpleStyledTableCell>Contact name</SimpleStyledTableCell>
              <SimpleStyledTableCell>Telegram id</SimpleStyledTableCell>
              <SimpleStyledTableCell>Competence field</SimpleStyledTableCell>
              <SimpleStyledTableCell>Description</SimpleStyledTableCell>
              <SimpleStyledTableCell>Tags</SimpleStyledTableCell>
              <SimpleStyledTableCell> Status</SimpleStyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resourcesTable.map((resource, ind) => (
              <TableRow key={ind}>
                <StyledTableCell maxWidth={maxWidthByColumn.date}>
                  {renderWithTooltip(resource.date, maxWidthByColumn.date)}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.organization}>
                  {renderWithTooltip(
                    resource.organization,
                    maxWidthByColumn.organization
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.contactName}>
                  {renderWithTooltip(
                    resource.contactName,
                    maxWidthByColumn.contactName
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.telegramId}>
                  {renderWithTooltip(
                    resource.telegramId.toString(),
                    maxWidthByColumn.telegramId
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.requestText}>
                  {renderWithTooltip(
                    resource.competenceField,
                    maxWidthByColumn.requestText
                  )}
                </StyledTableCell>

                <StyledTableCell maxWidth={maxWidthByColumn.status}>
                  {renderWithTooltip(
                    resource.description,
                    maxWidthByColumn.status
                  )}
                </StyledTableCell>

                <StyledTableCell
                  maxWidth={maxWidthByColumn.associatedResources}
                >
                  {renderWithTooltip(
                    resource.tags.join(", "),
                    maxWidthByColumn.associatedResources
                  )}
                </StyledTableCell>
                <StyledTableCell maxWidth={maxWidthByColumn.status}>
                  {renderWithTooltip(resource.status, maxWidthByColumn.status)}
                </StyledTableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    size="large"
                    color="error"
                    onClick={() => {
                      setResourceIdToDelete(resource._id);
                      setResourceDeleteDialogOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Button
                    aria-label="edit"
                    size="large"
                    color="warning"
                    onClick={() => {
                      setEditingResource(resource);
                      setResourceEditDialogOpen(true);
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

      {createdResource && (
        <ResourceCreateDialog
          open={resourceCreateDialogOpen}
          setOpen={setResourceCreateDialogOpen}
          createResource={async (createdState: Resource) =>
            setResourcesTable(await postCreateResource(createdState))
          }
        />
      )}

      {editingResource && (
        <ResourceEditDialog
          open={resourceEditDialogOpen}
          setOpen={setResourceEditDialogOpen}
          editResource={async (resource) =>
            setResourcesTable(await postEditResource(resource))
          }
          initialState={editingResource}
        />
      )}

      {resourceIdToDelete && (
        <DeleteConfirmDialog
          open={resourceDeleteDialogOpen}
          setOpen={setResourceDeleteDialogOpen}
          idToDelete={resourceIdToDelete}
          deleteAction={async (id: string) =>
            setResourcesTable(await postDeleteResource(id))
          }
        />
      )}
    </>
  );
}
