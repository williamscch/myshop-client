/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  CardActionArea,
  CardActions,
  CardMedia,
  CardContent,
  Grid,
  Card,
  Button,
  IconButton,
  Divider,
  Drawer,
  CssBaseline,
  Box,
  styled,
  useTheme,
  Dialog,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import axios from '../services/axios';
import NavBar from './NavBar';
import decodeJWT from '../services/decodeJWT';

const CUSTOMERS_URL = '/customers/';
const CAT_URL = '/categories';
const PRODUCTS_URL = '/products';
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
  const [cats, setCats] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState(null);
  const [maxPrice, setMaxPrice] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [session, setSession] = React.useState(false);
  const [role, setRole] = React.useState('');
  const [customer, setCustomer] = React.useState(null);
  const [idOrder, setOrderId] = React.useState();
  const [token, setToken] = React.useState(
    window.localStorage.getItem('token'),
  );
  const [showConfirmationDialog, setShowConfirmationDialog] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);

  const theme = useTheme();

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(1),
  }));

  React.useEffect(() => {
    setToken(window.localStorage.getItem('token'));
    const filters = {};
    if (categoryId !== null) {
      filters.categoryId = categoryId;
    }
    if (maxPrice !== '') {
      filters.price_max = maxPrice;
    }
    if (searchQuery !== '') {
      filters.name = searchQuery;
    }
    const queryString = Object.keys(filters)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`,
      )
      .join('&');

    const url = queryString ? `${PRODUCTS_URL}?${queryString}` : PRODUCTS_URL;

    axios.get(url).then((response) => {
      setProducts(response.data);
    });
  }, [categoryId, maxPrice, searchQuery]);

  React.useEffect(() => {
    axios.get(CAT_URL).then((response) => {
      setCats(response.data);
    });
  }, []);

  React.useEffect(() => {
    if (token !== null) {
      setSession(true);
      setRole(decodeJWT(token).role);

      if (role === 'customer') {
        axios
          .get(CUSTOMERS_URL + decodeJWT(token).sub, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setCustomer(response.data);
          });

        axios
          .get('profile/my-orders', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.length >= 1) {
              setOrderId(response.data[0].id);
            } else {
              axios
                .post('/orders', JSON.stringify({ customerId: customer.id }), {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then((response) => setOrderId(response.id));
            }
          });
      }
    }
  }, [session, role, token]);

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
      .then((response) => {
        if (response.status === 201) {
          setOpenDialog(false);
          axios.get(PRODUCTS_URL).then((response) => {
            setProducts(response.data);
          });
        }
      });
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCategoryChange = (id) => {
    setCategoryId(id);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAddToCart = () => {
    setShowConfirmationDialog(true);
  };

  const handleConfirmationDialogClose = (confirmed, p) => {
    setShowConfirmationDialog(false);

    if (confirmed) {
      // Lógica para agregar el producto al carrito aquí
      setShowSuccessMessage(true);
      axios
        .post(
          '/orders/add-item',
          JSON.stringify({
            orderId: idOrder,
            productId: p,
            amount: 1,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((response) => console.log(response));
    }
  };

  const handleSuccessMessageClose = () => {
    setShowSuccessMessage(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <NavBar
        role={role}
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
            <ListItemButton onClick={() => handleCategoryChange(null)}>
              <ListItemText primary="All Products" />
            </ListItemButton>
          </ListItem>
          {cats !== null
            ? cats.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton onClick={() => handleCategoryChange(item.id)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))
            : ''}
        </List>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            type="number"
            id="maxPrice"
            name="maxPrice"
            margin="normal"
            fullWidth
            value={maxPrice}
            onChange={handleMaxPriceChange}
            label="Max Price"
            autoFocus
          />

          <TextField
            type="text"
            id="searchQuery"
            name="searchQuery"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            margin="normal"
            fullWidth
            label="Serch by name"
            autoFocus
          />
        </Box>
        {session && role === 'admin' ? (
          <List>
            <Div>Admin Tools</Div>
            <ListItem disablePadding>
              <ListItemButton>
                <Link to="/new-category">
                  <ListItemText primary="New Category" />
                </Link>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
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
                        <IconButton aria-label="edit">
                          <EditIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <Button
                          size="small"
                          color="primary"
                          onClick={handleAddToCart}
                          startIcon={<AddShoppingCartIcon />}
                        >
                          Add to car
                        </Button>
                        <Dialog
                          open={showConfirmationDialog}
                          onClose={() => handleConfirmationDialogClose(false)}
                        >
                          <DialogTitle>
                            Are you sure about adding this product to your
                            car?
                          </DialogTitle>
                          <DialogContent>
                            <p>{item.name}</p>
                            <p>
                              Price:
                              {' '}
                              {item.price}
                              $
                            </p>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => handleConfirmationDialogClose(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleConfirmationDialogClose(true, item.id)}
                            >
                              Yes, add it!
                            </Button>
                          </DialogActions>
                        </Dialog>
                        <Snackbar
                          severity="success"
                          open={showSuccessMessage}
                          autoHideDuration={3000}
                          onClose={handleSuccessMessageClose}
                          message="Product Added Successfully"
                        />
                      </>
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
          Are you sure of deleting this?
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
