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
import { useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import axios from '../services/axios';

const theme = createTheme();
const REGISTER_URL = '/customers';

const SignUp = () => {
  const [alert, setAlert] = useState();
  const [success, setSuccess] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const credentials = {
      name: data.get('firstName'),
      lastName: data.get('lastName'),
      user: {
        email: data.get('email'),
        password: data.get('password'),
      },
    };

    try {
      await axios
        .post(REGISTER_URL, JSON.stringify(credentials), {
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
          if (response.status === 201) {
            setSuccess('Your profile is created... Now Login!');
            setTimeout(() => {
              navigate('/login', { replace: true });
            }, 4000);
          }
        });
    } catch (error) {
      if (error.response.status === 500) {
        setAlert('Email Taken');
      } else {
        setAlert(error.response.data.message);
      }
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
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

export default SignUp;
