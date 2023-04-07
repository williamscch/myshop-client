import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddToQueueOutlinedIcon from '@mui/icons-material/AddToQueueOutlined';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from '../services/axios';

const theme = createTheme();
const PRODUCTS_URL = '/products';
const CAT_URL = '/categories';

const Login = () => {
  const [alert, setAlert] = React.useState();
  const [success, setSuccess] = React.useState();
  const [cat, setCat] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [cats, setCats] = React.useState(null);
  const navigate = useNavigate();
  const token = window.localStorage.getItem('token');

  React.useEffect(() => {
    axios
      .get(CAT_URL)
      .then((response) => {
        setCats(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleChange = (event) => {
    setCat(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const dataValues = {
      name: data.get('name'),
      description: data.get('description'),
      image: data.get('image'),
      price,
      categoryId: cat,
    };
    try {
      await axios
        .post(PRODUCTS_URL, JSON.stringify(dataValues), {
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
            <AddToQueueOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create a new Product
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
              label="ProductName"
              name="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="image"
              label="Image Link (only proper links allowed)"
              name="image"
              autoFocus
            />
            <FormControl fullWidth margin="normal" name="price" value="price">
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput
                type="number"
                onChange={handlePriceChange}
                id="outlined-adornment-amount"
                endAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Price"
                value={price}
              />
            </FormControl>
            <FormControl
              required
              margin="normal"
              sx={{ width: '100%' }}
              name="category"
              value="category"
            >
              <InputLabel id="demo-simple-select-autowidth-label">
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cat}
                onChange={handleChange}
                label="Select a Category"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {cats
                  && cats.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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
