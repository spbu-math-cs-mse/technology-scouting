import { useEffect, useState } from "react";
import { ResourceWithId } from "../logic/types.ts";
import {
  // getResourcesDataTable,
  getResourcesDataTableMock as getResourcesDataTable,
  postDeleteResource,
  postEditResource,
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
import ResourceEditDialog from "./ResourceEditDialog.tsx";

export default function ResourceTable() {
  const [resourcesTable, setResourcesTable] = useState<ResourceWithId[]>([]);

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

  const [resourceEditDialogOpen, setResourceEditDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<
    ResourceWithId | undefined
  >(undefined);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Organization</TableCell>
              <TableCell>Contact name</TableCell>
              <TableCell>Telegram id</TableCell>
              <TableCell>Competence field</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resourcesTable.map((resource, ind) => (
              <TableRow key={ind}>
                <TableCell>{resource.date}</TableCell>
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
                    onClick={() =>
                      handleOpenDialogForDelete(resource._id)
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
