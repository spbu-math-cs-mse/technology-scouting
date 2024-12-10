import { useEffect, useState } from "react";
import { ResourceWithId, Resource, DEFAULT_RESOURCE } from "../logic/types.ts";
import {
  //getResourcesDataTable,
  getResourcesDataTableMock as getResourcesDataTable,
  postDeleteResource,
  postEditResource,
  postCreateResource,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import ResourceEditDialog from "./ResourceEditDialog.tsx";
import ResourceCreateDialog from "./ResourceCreationDialog.tsx";
import {
  renderWithTooltip,
  StyledTableCell,
  SimpleStyledTableCell,
} from "./TableFitting.tsx";

export default function ResourceTable() {
  const font = "14px Times New Roman";
  const maxWidthByColumn = {
    date: 50,
    organization: 80,
    contactName: 50,
    telegramId: 50,
    requestText: 100,
    competenceField: 100,
    description: 100,
    tags: 100,
    status: 100,
  };

  const [resourcesTable, setResourcesTable] = useState<ResourceWithId[]>([]);

  const [selectedForDeleteRequestId, setSelectedForDeleteRequestId] = useState<
    string | null
  >(null);

  const [resourceCreateDialogOpen, setResourceCreateDialogOpen] =
    useState(false);

  const [createdResource, setCreatedResource] = useState<Resource | undefined>(
    undefined
  );

  const [resourceEditDialogOpen, setResourceEditDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<
    ResourceWithId | undefined
  >(undefined);

  const handleOpenDialogForDelete = (id: string) => {
    setSelectedForDeleteRequestId(id);
  };
  const handleCloseDialogForDelete = () => {
    setSelectedForDeleteRequestId(null);
  };

  const handleConfirmDelete = (id: string) => {
    setSelectedForDeleteRequestId(null);
    postDeleteResource(id);
    setTimeout(
      () =>
        getResourcesDataTable().then((messages) => setResourcesTable(messages)),
      500
    );
  };

  useEffect(() => {
    getResourcesDataTable().then((messages) => setResourcesTable(messages));
    const interval = setInterval(() => {
      getResourcesDataTable().then((messages) => setResourcesTable(messages));
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
            setCreatedResource(DEFAULT_RESOURCE);
            setResourceCreateDialogOpen(true);
          }}
        >
          Create Resource
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <SimpleStyledTableCell>Date</SimpleStyledTableCell>
              <SimpleStyledTableCell>Organization</SimpleStyledTableCell>
              <SimpleStyledTableCell>Contact name</SimpleStyledTableCell>
              <SimpleStyledTableCell>Telegram id</SimpleStyledTableCell>
              <SimpleStyledTableCell>Competence field</SimpleStyledTableCell>
              <SimpleStyledTableCell>Description</SimpleStyledTableCell>
              <SimpleStyledTableCell>Tags</SimpleStyledTableCell>
              <SimpleStyledTableCell>Status</SimpleStyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resourcesTable.map((resource, ind) => (
              <TableRow key={ind}>
                <TableCell sx={{ font: font, textAlign: "center" }}>
                  {resource.date}
                </TableCell>
                <TableCell>{resource.organization}</TableCell>
                <TableCell>{resource.contactName}</TableCell>
                <TableCell>{resource.telegramId}</TableCell>
                <TableCell>{resource.competenceField}</TableCell>
                <TableCell>{resource.description}</TableCell>
                <TableCell>{resource.tags.join(", ")}</TableCell>
                <TableCell>{resource.status}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    size="large"
                    color="error"
                    onClick={() => handleOpenDialogForDelete(resource._id)}
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
                        onClick={() => handleConfirmDelete(resource._id)}
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
          createResource={(createdState: Resource) => {
            postCreateResource(createdState);
            getResourcesDataTable().then((messages) =>
              setResourcesTable(messages)
            );
          }}
        />
      )}

      {editingResource && (
        <ResourceEditDialog
          open={resourceEditDialogOpen}
          setOpen={setResourceEditDialogOpen}
          editResource={(resource) => {
            postEditResource(resource);
            getResourcesDataTable().then((messages) =>
              setResourcesTable(messages)
            );
          }}
          initialState={editingResource}
        />
      )}
    </>
  );
}
