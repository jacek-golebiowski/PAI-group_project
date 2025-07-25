import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RentPage from './pages/RentPage';
import ProductPage from './pages/ProductPage';
import HistoryPage   from './pages/HistoryPage.jsx';
import ManageProductsPage from './pages/ManageProductsPage';
import PrivateRoute  from './components/PrivateRoute';

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
          <Route
              path="/history"
              element={
                <PrivateRoute roles={['admin']}>
                  <HistoryPage />
                </PrivateRoute>
              }
          />

          <Route
              path="/manage-products"
              element={
                <PrivateRoute roles={['admin']}>
                  <ManageProductsPage />
                </PrivateRoute>
              }
          />

        </Routes>
      </main>
    </div>
  );
}
