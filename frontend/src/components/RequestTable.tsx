import { useEffect, useState } from "react";
import { RequestMessage } from "../logic/types.ts";
import {
  getRequestDataTable,
  getRequestDataTableMock,
  postDeleteRequest,
  postEditRequest,
} from "../logic/request.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  MenuList,
  Box,
  Typography,
  Popover,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function RequestTable() {
  const [tableContent, setTableContent] = useState<RequestMessage[]>([]);
  const statuses = ["Active", "Pending", "Completed"];

  const handleInputDelete = (id: string) => {
    postDeleteRequest(id);
    getRequestDataTable().then((messages) => setTableContent(messages));
  };

  const handleEditStatus = (id: string, new_status: string) => {
    postEditRequest(id, new_status);
    getRequestDataTable().then((messages) => setTableContent(messages));
    handleClosePopover();
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const handleOpenPopover = (
    event: React.MouseEvent<HTMLElement>,
    rowIndex: number
  ) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(rowIndex);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  const handleStatusChange = (newStatus: string) => {
    console.log(`Row ${activeRow}: Status changed to ${newStatus}`);
    handleClosePopover();
  };

  const statusOptions = ["Pending", "Approved", "Rejected", "In Progress"];

  const isPopoverOpen = Boolean(anchorEl);

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
              <TableCell>
                {requestMessage.status_id}
                <IconButton onClick={(e) => handleOpenPopover(e, ind)}>
                  <ExpandMoreIcon />
                </IconButton>
              </TableCell>
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
      <Popover
        open={isPopoverOpen}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuList>
          {statusOptions.map((status) => (
            <MenuItem key={status}  
            onClick={() => activeRow !== null && handleEditStatus(String(activeRow), status)}
            sx={{
              fontSize: "11px",
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: '#ADD8E6',
              },
              borderRadius: '8px',
              padding: '12px',
              color: '#333',
            }}>
              {status}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </TableContainer>
  );
}
