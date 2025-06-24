import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import RentPage from './pages/RentPage';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, padding: 0}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rent" element={<RentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    </div>
  );
}
