import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Homepage from './pages/homepage.jsx';
import Register from './pages/register.jsx';
import ForgotPassword from './pages/forgotpass.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recover" element={<ForgotPassword />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
