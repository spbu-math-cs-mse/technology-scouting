import { useEffect, useState } from "react";
import { UserMessage } from "../logic/types.ts";
import { getUserDataTable } from "../logic/request.ts";
// import { getUserDataTableMock } from "../logic/request.ts";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export default function AdminTable() {
  const [tableContent, setTableContent] = useState<UserMessage[]>([]);

  useEffect(() => {
    getUserDataTable().then((messages) => setTableContent(messages));
    const interval = setInterval(() => {
      getUserDataTable().then((messages) => setTableContent(messages));
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
            <TableCell>Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableContent.map((userMessage, ind) => (
            <TableRow key={ind}>
              <TableCell>{userMessage.telegramId}</TableCell>
              <TableCell>{userMessage.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
