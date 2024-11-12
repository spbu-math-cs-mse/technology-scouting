import { useEffect, useState } from "react";
import {ResourceMessage } from "../logic/types.ts";
import {getResourcesDataTable } from "../logic/request.ts";
import { getResourcesDataTableMock } from "../logic/request.ts";
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
  const [tableContent, setTableContent] = useState<ResourceMessage[]>([]);
  const handleInputDelete = () => {

  };

  useEffect(() => {
    getResourcesDataTableMock().then((messages) => setTableContent(messages));
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
            <TableCell>Telegram ID</TableCell>
            <TableCell>Resource Name</TableCell>
            <TableCell>Resource Description</TableCell>
            <TableCell>Resource Type</TableCell>
            <TableCell>Available Quantity</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableContent.map((resourceMessage, ind) => (
            <TableRow key={ind}>
              <TableCell>{resourceMessage.tg_id}</TableCell>
              <TableCell>{resourceMessage.resource_name}</TableCell>
              <TableCell>{resourceMessage.resource_description}</TableCell>
              <TableCell>{resourceMessage.resourse_type}</TableCell>
              <TableCell>{resourceMessage.available_quantity}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={handleInputDelete}
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
