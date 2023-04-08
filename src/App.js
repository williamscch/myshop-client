import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewCat from './components/CatNewForm';
import NewProduct from './components/ProductNewForm';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/Signup';
import ShopCar from './components/ShopCar';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/new-category" element={<NewCat />} />
      <Route path="/new-product" element={<NewProduct />} />
      <Route path="/shop-car" element={<ShopCar />} />
    </Routes>
  </Router>
);
export default App;
