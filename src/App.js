// import Products from './components/Products';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import Login from './components/Login';
import SignUp from './components/Signup';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  </Router>
);
export default App;
