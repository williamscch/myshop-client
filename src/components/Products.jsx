import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

const Products = () => {
  const [products, setProducts] = useState(null);
  const endPoint = 'products';
  const baseURL = 'http://localhost:3050/api/v1/';

  useEffect(() => {
    axios.get(baseURL + endPoint).then((response) => {
      setProducts(response.data);
    });
  }, []);

  if (!products) return null;

  return (
    <Grid container spacing={2}>
      {products.map((item) => (
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
              <Button size="small" color="primary">
                Add to car
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

// Products.propTypes = {
//   baseURL: PropTypes.string.isRequired,
// };

export default Products;
