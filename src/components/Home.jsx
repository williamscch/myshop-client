import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import axios from '../services/axios';
import decodeJWT from '../services/decodeJWT';
import NavBar from './NavBar';

const CAT_URL = '/categories';
const CUSTOMERS_URL = '/customers/';
const PRODUCTS_URL = '/products';
const token = window.localStorage.getItem('token');

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(4),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const Home = () => {
  const [products, setProducts] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [session, setSession] = React.useState(false);
  const [role, setRole] = React.useState();
  // const [userId, setUserId] = React.useState();
  const theme = useTheme();
  const [cats, setCats] = React.useState(null);
  const [customer, setCustomer] = React.useState(null);
  const [selectedCat, setSelectedCat] = React.useState();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(false);

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
  }));

  React.useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      setSession(true);
    }
  }, []);

  React.useEffect(() => {
    if (session === true || window.localStorage.getItem('token') != null) {
      const decode = decodeJWT(window.localStorage.getItem('token'));
      setRole(decode.role);
      // setUserId(decode.sub);
    }
  }, []);

  React.useEffect(() => {
    axios.get(CAT_URL).then((response) => {
      setCats(response.data);
    });
  }, []);

  React.useEffect(() => {
    if (session && role === 'customer') {
      const userId = decodeJWT(window.localStorage.getItem('token')).sub;
      axios
        .get(CUSTOMERS_URL + userId)
        .then((response) => {
          setCustomer(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  React.useEffect(() => {
    axios.get(PRODUCTS_URL).then((response) => {
      setProducts(response.data);
    });
  }, [products]);

  const handleClickOpenDialog = (id) => {
    setOpenDialog(true);
    setItemToDelete(id);
  };

  const handleClickCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteProduct = (id) => {
    axios
      .delete(`${PRODUCTS_URL}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => response.json);
    setOpenDialog(false);
    axios.get(PRODUCTS_URL).then((response) => {
      setProducts(response.data);
    });
  };

  const handleSetCat = (id) => {
    if (selectedCat !== null) {
      setProducts(null);
      setSelectedCat(id);
      axios.get(`categories/${id}`).then((response) => {
        if (response.status === 200) {
          setProducts(response.data.products);
        }
      });
    }
  };

  const handleSetAllCat = () => {
    axios.get(PRODUCTS_URL).then((response) => {
      setProducts(response.data);
    });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <NavBar
        session={session}
        setSession={setSession}
        position="fixed"
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        drawerWidth={drawerWidth}
      />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        {session && role === 'customer' && customer != null ? (
          <DrawerHeader>
            <Typography variant="subtitle1">
              {customer.name}
              {' '}
              {customer.lastName}
              {' '}
              {customer.user.email}
            </Typography>
          </DrawerHeader>
        ) : (
          ''
        )}
        {session && role === 'admin' ? (
          <DrawerHeader>
            <Typography variant="h6">ADMIN ROLE ACTIVE</Typography>
          </DrawerHeader>
        ) : (
          ''
        )}
        <Divider />
        <Div>Categories</Div>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleSetAllCat}>
              <ListItemText primary="All Products" />
            </ListItemButton>
          </ListItem>
          {cats !== null
            ? cats.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton onClick={() => handleSetCat(item.id)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))
            : ''}
        </List>
        {session && role === 'admin' ? (
          <List>
            <Div>Admin Tools</Div>

            <ListItem disablePadding>
              <ListItemButton onClick={handleSetAllCat}>
                <Link to="/new-category">
                  <ListItemText primary="New Category" />
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleSetAllCat}>
                <Link to="/new-product">
                  <ListItemText primary="New Product" />
                </Link>
              </ListItemButton>
            </ListItem>
          </List>
        ) : (
          ''
        )}
      </Drawer>
      <Main open={open}>
        <Grid container spacing={2} sx={{ paddingTop: '5rem' }}>
          {products !== null
            ? products.map((item) => (
              <Grid key={item.id} item xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.price}
                        $
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    {session && role === 'admin' ? (
                      <>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleClickOpenDialog(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton aria-label="delete">
                          <EditIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Button size="small" color="primary">
                        Add to car
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
            : ''}

          {products === undefined ? (
            <Typography variant="h3" color="text.secondary">
              This category has no products
            </Typography>
          ) : (
            ''
          )}
        </Grid>
      </Main>
      <Dialog
        open={openDialog}
        onClose={handleClickCloseDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure of deleting this product?
        </DialogTitle>
        <DialogActions>
          <Button color="primary" onClick={handleClickCloseDialog}>
            No, cancel
          </Button>
          <Button
            color="error"
            onClick={() => {
              handleDeleteProduct(itemToDelete);
              handleClickCloseDialog();
            }}
            autoFocus
          >
            Delete this Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
