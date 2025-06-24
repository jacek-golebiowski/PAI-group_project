import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import sportsBanner from '../../images/sports-banner.png';

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div className="page">
      <Navbar />
      <div style={styles.bannerContainer}>
        <img src={sportsBanner} alt="Sports Banner" style={styles.banner} />
        <div style={styles.overlayText}>
          <h1 style={styles.title}>Gear Up, Game On.</h1>
          <p style={styles.subtitle}>Rent top-quality sports gear for your next adventure.</p>
        </div>
      </div>

      <h1 style={styles.heading}>Available Equipment</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card dark">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>{product.price} zł</strong> – Stock: {product.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  bannerContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '1100px',
    marginTop: '3rem',
    marginBottom: '40px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  banner: {
    width: '100%',
    height: '35rem',
    objectFit: 'cover',
    display: 'block',
  },
  overlayText: {
    position: 'absolute',
    top: '30px',
    left: '30px',
    color: '#fff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: '2.5rem',
    margin: 0,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginTop: '10px',
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '20px',
    marginTop: '10px',
    color: '#333',
  },
};
