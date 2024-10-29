import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import ErrorAlert from "./ErrorAlert";
import * as React from "react";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function EntryPageVisual() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const [inputUsernameString, setInputUsernameString] = useState("");
  const [inputPasswordString, setInputPasswordString] = useState("");
  const targetUsernameValue = "test";
  const isMatch = inputUsernameString === targetUsernameValue;

  const handleInputUsernameChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputUsernameString(event.target.value);
    setErrorAlertOpened(false);
  };

  const handleInputPasswordChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputPasswordString(event.target.value);
    setErrorAlertOpened(false);
  };

  const handleLogin = () => {
    const targetUsernameValue = "test";
    const targetPasswordValue = '12345';
    if (inputUsernameString === targetUsernameValue && inputPasswordString === targetPasswordValue) {
      navigate('/target-page');
    } else {
      alert('Incorrect value');
    }
  };

  const handleInputDelete = () => {
    setInputUsernameString("");
    setErrorAlertOpened(false);
  };

  const [errorAlertOpened, setErrorAlertOpened] = useState(false);
  const [errorText, setErrorText] = useState("");

  return (
    <Box sx={{ width: "70%" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
        <Grid size={10}>
          <TextField
            id="outlined-basic"
            label="Enter your username"
            variant="outlined"
            value={inputUsernameString}
            onChange={handleInputUsernameChange}
            sx={{ m: "5%", width: "100%" }}
          />
          <Typography variant="body1" color={isMatch ? "green" : "red"}>
            {isMatch ? "Значение совпадает!" : "Значение не совпадает"}
          </Typography>
        </Grid>
        <Grid size={10}>
          <FormControl sx={{ m: 1, width: "100%" }} variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Password
            </InputLabel>
            <FilledInput
              id="filled-adornment-password"
              value={inputPasswordString}
              onChange={handleInputPasswordChange}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword
                        ? "hide the password"
                        : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
      <Button onClick={handleLogin} variant="contained" style={{ marginTop: '1rem' }}>
        Submit
      </Button>
      <ErrorAlert
        opened={errorAlertOpened}
        setOpened={(open: boolean) => setErrorAlertOpened(open)}
        errorText={errorText}
      />
    </Box>
  );
}
