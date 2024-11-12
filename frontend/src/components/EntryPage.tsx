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

  const [targetUsernameValue, setTargetUsernameValue] = useState("test");
  const [targetPasswordValue, setTargetPasswordValue] = useState("12345");
  const isMatch =
    inputUsernameString === targetUsernameValue &&
    inputPasswordString === targetPasswordValue;

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

  /*const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const success = await login(inputUsernameString, inputPasswordString);

    if (success) {
        navigate("/admin-panel"); // Переход на следующую страницу
    } else {
      setErrorAlertOpened(true);
      console.error("Login failed");
    }
};*/
  const handleLogin = () => {
    if (isMatch) {
      navigate("/admin-panel");
    }
  };

  const [errorAlertOpened, setErrorAlertOpened] = useState(false);

  return (
    <Box sx={{ width: "90%" }}>
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
        </Grid>

        <Grid size={6}>
          <FormControl sx={{ m: "10%", width: "120%" }} variant="filled">
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
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid size={6}>
          <Button
            onClick={handleLogin}
            variant="contained"
            sx={{ marginTop: "15%", marginLeft: "50%" }}
          >
            Enter
          </Button>
        </Grid>
      </Grid>
      <ErrorAlert
        opened={errorAlertOpened}
        setOpened={(open: boolean) => setErrorAlertOpened(open)}
        errorText={"Wrong username or password"}
      />
    </Box>
  );
}
