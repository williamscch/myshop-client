// import Products from './components/Products';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewCat from 'components/CatNewForm';
import NewProduct from 'components/CatNewForm';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/Signup';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/new-category" element={<NewCat />} />
      <Route path="/new-category" element={<NewProduct />} />

    </Routes>
  </Router>
);
export default App;
