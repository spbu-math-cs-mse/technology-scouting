import { useEffect, useState } from "react";
import { ResourceMessage, ResourceMessageWithId } from "../logic/types.ts";
import { getResourcesDataTable, postDeleteResource } from "../logic/request.ts";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function ResourceTable() {
  const [tableContent, setTableContent] = useState<ResourceMessageWithId[]>([]);
  const handleInputDelete = (id: string) => {
    postDeleteResource(id);
    getResourcesDataTable().then((messages) => setTableContent(messages));
  };

  useEffect(() => {
    getResourcesDataTable().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getResourcesDataTable().then((messages) => setTableContent(messages));
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
            <TableCell>CompetenceField</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableContent.map((resourceMessage, ind) => (
            <TableRow key={ind}>
              <TableCell>{resourceMessage._id}</TableCell>
              <TableCell>{resourceMessage.date}</TableCell>
              <TableCell>{resourceMessage.organization}</TableCell>
              <TableCell>{resourceMessage.contactName}</TableCell>
              <TableCell>{resourceMessage.telegramId}</TableCell>
              <TableCell>{resourceMessage.competenceField}</TableCell>
              <TableCell>{resourceMessage.description}</TableCell>
              <TableCell>{resourceMessage.tags}</TableCell>
              <TableCell>{resourceMessage.status}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => {
                    handleInputDelete(resourceMessage._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
