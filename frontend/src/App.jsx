import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import Button from './components/Button';
import RentPage from './pages/RentPage';
import ProductPage from './pages/ProductPage';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: 0}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/products/:id" element={<ProductPage />} />
        </Routes>
      </main>
    </div>
  );
}
