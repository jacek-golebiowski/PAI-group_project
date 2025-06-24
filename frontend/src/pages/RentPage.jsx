import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

export default function RentPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div className="page">
      <Navbar />
      <h1 style={styles.title}>Available Equipment</h1>
      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products available at the moment.</p>
        ) : (
          products.map(product => (
            <div key={product.id} className="product-card dark">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><b>{product.price} zł</b> – Stock: {product.stock}</p>
              <p style={styles.category}>{product.category?.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  title: {
    fontSize: '2rem',
    marginBottom: '30px',
    color: '#333',
  },
  grid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    width: '100%',
    maxWidth: '1100px',
  },
  card: {
    background: '#ffffffdd',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
  },
  category: {
    fontStyle: 'italic',
    color: '#fff',
    marginTop: '10px',
  }
};
