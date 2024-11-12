import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import * as React from "react";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function AdminPanel() {
  const navigate = useNavigate();

  const handleRequestTable = () => {
    navigate("/request-table");
  };
  const handleResourceTable = () => {
    navigate("/resource-table");
  };
  const [errorText, setErrorText] = useState("");

  const [errorAlertOpened, setErrorAlertOpened] = useState(false);

  return (
    <Box sx={{ width: "90%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid size={6}>
          <Button
            onClick={handleRequestTable}
            variant="contained"
            sx={{ marginTop: "15%", marginLeft: "20%" }}
          >
            Watch requests
          </Button>
        </Grid>
        <Grid size={6}>
          <Button
            onClick={handleResourceTable}
            variant="contained"
            sx={{ marginTop: "15%", marginLeft: "10%" }}
          >
            Watch resources
          </Button>
        </Grid>
      </Grid>
      <ErrorAlert
        opened={errorAlertOpened}
        setOpened={(open: boolean) => setErrorAlertOpened(open)}
        errorText={errorText}
      />
    </Box>
  );
}
