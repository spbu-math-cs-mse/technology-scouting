import { useEffect, useState } from "react";
import { RequestMessage } from "../logic/types.ts";
import { getRequestDataTable, postDeleteRequest } from "../logic/request.ts";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

export default function RequestTable() {
  const [tableContent, setTableContent] = useState<RequestMessage[]>([]);

  const handleInputDelete = (id: string) => {
    postDeleteRequest(id);
    getRequestDataTable().then((messages) => setTableContent(messages));
  };

  useEffect(() => {
    getRequestDataTable().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getRequestDataTable().then((messages) => setTableContent(messages));
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
            <TableCell>Request Type</TableCell>
            <TableCell>Request Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableContent.map((requestMessage, ind) => (
            <TableRow key={ind}>
              <TableCell>{requestMessage.tg_id}</TableCell>
              <TableCell>{requestMessage.request_type}</TableCell>
              <TableCell>{requestMessage.request_desciption}</TableCell>
              <TableCell>{requestMessage.status_id}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => handleInputDelete(requestMessage._id)}
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
