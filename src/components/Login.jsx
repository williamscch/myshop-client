import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axios';

const theme = createTheme();
const LOGIN_URL = '/auth/login';

const Login = () => {
  const [alert, setAlert] = useState();
  const [success, setSuccess] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials = {
      email: data.get('email'),
      password: data.get('password'),
    };
    try {
      await axios
        .post(LOGIN_URL, JSON.stringify(credentials), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            setSuccess('You are now logged in! Add some items to your car');
            setTimeout(() => {
              navigate('/', { replace: true });
            }, 3000);
          }
        });
    } catch (error) {
      setAlert(error.response.data.message);
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs={12}>
                <Link href="/signup" variant="body2">
                  Don&apos;t have an account? Sign Up
                </Link>
              </Grid>
              <Grid item xs={12}>
                <Link href="/" variant="body2">
                  Go back to home without session
                </Link>
              </Grid>
              <Grid item xs={12}>
                {alert != null ? (
                  <Alert
                    onClose={() => {
                      setAlert(null);
                    }}
                    variant="outlined"
                    severity="error"
                  >
                    {alert}
                  </Alert>
                ) : (
                  ''
                )}
                {success != null ? (
                  <Alert severity="success">{success}</Alert>
                ) : (
                  ''
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
