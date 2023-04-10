import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import axios from '../services/axios';

const ORDERS_URL = '/orders/1';

const ShopCar = () => {
  const [orders, setOrders] = React.useState([]);

  const token = window.localStorage.getItem('token');

  React.useEffect(() => {
    if (token) {
      axios
        .get(ORDERS_URL, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // console.log(response);
          setOrders(response.data.items);
          // console.log(orders);
        })
        .catch((e) => console.log(e));
    }
  }, [token, orders]);

  const TAX_RATE = 0.07;

  const ccyFormat = (num) => `${num.toFixed(2)}`;

  const subtotal = (items) => {
    if (!items) return 0;
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
  };

  const priceRow = (qty, unit) => qty * unit;

  const invoiceSubtotal = subtotal(orders);
  const invoiceTaxes = TAX_RATE * invoiceSubtotal;
  const invoiceTotal = invoiceTaxes + invoiceSubtotal;

  React.useEffect(() => {
    console.log(orders);
  }, []);

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My shop
            </Typography>

            <Link to="/">
              {' '}
              <Button variant="contained" color="secondary">
                HOME
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
      <Container sx={{ marginTop: '2rem' }} maxWidth="md">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="spanning table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  Details
                </TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Products Placed</TableCell>
                <TableCell align="right">Qty.</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">1</TableCell>
                  <TableCell align="right">{priceRow(1, row.price)}</TableCell>
                  <TableCell align="right">{ccyFormat(row.price)}</TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">
                  {ccyFormat(invoiceSubtotal)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tax</TableCell>
                <TableCell align="right">
                  {`${(TAX_RATE * 100).toFixed(0)} %`}
                </TableCell>
                <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default ShopCar;
