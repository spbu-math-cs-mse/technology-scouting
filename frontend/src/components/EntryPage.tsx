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
import { useState } from "react";
import { useAuth } from "../logic/AuthProvider";

export default function EntryPageVisual() {
  /** States to manage password visibilty, user input and error messages */ 
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  

  const { logIn } = useAuth();

/** Handles the login button click, attempts login, if login fails - display an error message */
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    const error = await logIn(inputUsername, inputPassword);

    if (error) {
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
      {/* Centered login card */}
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

          {/* Username input */}
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

          {/* Password input with visibility */}
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

          {/* Error message display, if login or password are incorrect */}
          {errorMessage && (
            <Grid size={{ xs: 12 }}>
              <Typography color="error" variant="body2">
                {errorMessage}
              </Typography>
            </Grid>
          )}

          {/* Login button */}
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
