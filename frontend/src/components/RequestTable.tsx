import { useEffect, useState } from "react";
import { UserMessage, RequestMessage } from "../logic/types.ts";
import { getUserDataTable, getRequestDataTable } from "../logic/request.ts";
import { getUserDataTableMock, getRequestDataTableMock } from "../logic/request.ts";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function RequestTable() {
  const [tableContent, setTableContent] = useState<RequestMessage[]>([]);

  useEffect(() => {
    getRequestDataTableMock().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getRequestDataTable().then((messages) => setTableContent(messages));
      // getUserDataTableMock().then((messages) => setTableContent(messages));
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
            <TableCell>Request Date</TableCell>
            <TableCell>Request Type</TableCell>
            <TableCell>Request Description</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableContent.map((requestMessage, ind) => (
            <TableRow key={ind}>
              <TableCell>{requestMessage.tg_id}</TableCell>
              <TableCell>{requestMessage.request_date}</TableCell>
              <TableCell>{requestMessage.request_type}</TableCell>
              <TableCell>{requestMessage.request_desciption}</TableCell>
              <TableCell>{requestMessage.status_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
