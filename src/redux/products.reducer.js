import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const productsPath = 'http://localhost:3000/api/v1/products';

export const getProducts = createAsyncThunk('products/getproducts', async () => {
  const response = await fetch(productsPath, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
  });
  const products = await response.json();
  return products;
});

export const deleteProduct = createAsyncThunk('products/deleteCar', async (id) => {
  try {
    const response = await fetch(`${productsPath}/${id}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    return response.ok ? id : null;
  } catch (e) {
    return e.errors;
  }
});

export const postProduct = createAsyncThunk('products/postCar', async (data) => {
  await fetch(productsPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Something went wrong');
  });
});
export const updateProduct = createAsyncThunk('products/updateCar', async (data) => {
  await fetch(`${productsPath}/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Something went wrong');
  });
});

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    status: null,
    postStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteProduct.fulfilled, (state, action) => ({
      ...state,
      status: 'success',
      products: state.products.filter((car) => car.id !== action.payload),
    }));
    builder.addCase(deleteProduct.pending, (state) => ({
      ...state,
      status: 'loading',
    }));
    builder.addCase(deleteProduct.rejected, (state) => ({
      ...state,
      status: 'failed',
    }));
    builder.addCase(postProduct.fulfilled, (state, action) => ({
      ...state,
      postStatus: 'success',
      products: [...state.products, action.payload],
    }));
    builder.addCase(postProduct.pending, (state) => ({
      ...state,
      status: 'loading',
    }));
    builder.addCase(postProduct.rejected, (state) => ({
      ...state,
      status: 'failed',
    }));
    builder.addCase(getProducts.fulfilled, (state, action) => ({
      ...state,
      status: 'success',
      products: action.payload,
    }));
    builder.addCase(getProducts.pending, (state) => ({
      ...state,
      status: 'loading',
    }));
    builder.addCase(getProducts.rejected, (state) => ({
      ...state,
      status: 'failed',
    }));
  },
});

export const { productsReducer } = productsSlice.actions;

export default productsSlice.reducer;
