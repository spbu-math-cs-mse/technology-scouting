import * as React from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  InputAdornment,
  IconButton,
  Button,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ErrorAlert from './ErrorAlert';

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

  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const [targetUsernameValue] = useState('test');
  const [targetPasswordValue] = useState('12345');
  const isMatch =
    inputUsername === targetUsernameValue &&
    inputPassword === targetPasswordValue;

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
      navigate('/admin-panel');
    }
  };

  const [errorAlertOpened, setErrorAlertOpened] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '16px',
      }}
    >
      <Box
        sx={{
          width: '400px',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ textAlign: 'center', marginBottom: '24px', fontWeight: 'bold' }}
        >
          Login
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
                setErrorAlertOpened(false);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="filled" fullWidth>
              <InputLabel htmlFor="filled-adornment-password">
                Password
              </InputLabel>
              <FilledInput
                id="filled-adornment-password"
                type={showPassword ? 'text' : 'password'}
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setErrorAlertOpened(false);
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
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{ padding: '10px 0', fontSize: '16px' }}
            >
              Enter
            </Button>
          </Grid>
        </Grid>
        <ErrorAlert
          opened={errorAlertOpened}
          setOpened={(open: boolean) => setErrorAlertOpened(open)}
          errorText={'Wrong username or password'}
        />
      </Box>
    </Box>
  );
}
