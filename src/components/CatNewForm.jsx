import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import DataSaverOnOutlinedIcon from '@mui/icons-material/DataSaverOnOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import axios from '../services/axios';

const theme = createTheme();
const CAT_URL = '/categories';

const Login = () => {
  const [alert, setAlert] = useState();
  const [success, setSuccess] = useState();
  const navigate = useNavigate();

  const token = window.localStorage.getItem('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await axios
        .post(CAT_URL, JSON.stringify({ name: data.get('name') }), {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            setSuccess('Category was created succesfully');
            setTimeout(() => {
              navigate('/');
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
            <DataSaverOnOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create a new Category
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
              id="name"
              label="Category Name"
              name="name"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              CREATE
            </Button>
            <Grid container>
              <Grid item xs={12}>
                <Link href="/" variant="body2">
                  Go back to home
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
