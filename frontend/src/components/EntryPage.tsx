import * as React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postLogin } from "../logic/request";

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

  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // const [targetUsernameValue] = useState("test");
  // const [targetPasswordValue] = useState("12345");
  // const isMatch =
  //   inputUsername === targetUsernameValue &&
  //   inputPassword === targetPasswordValue;

  // const handleLogin = () => {
  //   if (isMatch) {
  //     navigate("/admin-panel");
  //   } else {
  //     setErrorMessage("Invalid username or password.");
  //   }
  // };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const success = await postLogin(inputUsername, inputPassword);

    if (success) {
      navigate("/admin-panel"); // Переход на следующую страницу
    } else {
      setErrorMessage("Invalid username or password.");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/login_backimage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
      }}
    >
      <Box
        sx={{
          width: "400px",
          padding: "32px",
          borderRadius: "8px",
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ textAlign: "center", marginBottom: "24px", fontWeight: "bold" }}
        >
          Login
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
                setErrorMessage("");
              }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl variant="filled" fullWidth>
              <InputLabel htmlFor="filled-adornment-password">
                Password
              </InputLabel>
              <FilledInput
                id="filled-adornment-password"
                type={showPassword ? "text" : "password"}
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setErrorMessage("");
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
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
          {errorMessage && (
            <Grid size={{ xs: 12 }}>
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{ padding: "10px 0", fontSize: "16px" }}
            >
              Enter
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
