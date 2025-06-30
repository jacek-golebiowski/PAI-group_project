import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => {
        console.error(err);
        setError('Failed to load product.');
      });
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="page">
      <Navbar />

      <div style={styles.container}>
        <div style={styles.card}>
          <img
            src={`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}${product.imageName}`}
            alt={product.name}
            loading="lazy"
            style={styles.image}
          />
          <div style={styles.info}>
            <h1 style={styles.title}>{product.name}</h1>
            <p style={styles.description}>{product.description}</p>
            <p style={styles.price}><strong>{product.price} zł</strong></p>
            <p style={styles.stock}>
              {product.stock > 0 ? 'Available' : 'Out of Stock'} — {product.stock} pcs
            </p>
            <p style={styles.category}>
              Category: {product.category?.name || 'Uncategorized'}
            </p>
            <Link to="/" style={styles.backLink}>← Back to All Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '3rem auto',
    padding: '0 1rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  image: {
    width: '100%',
    height: '30rem',
    objectFit: 'cover',
  },
  info: {
    padding: '2rem',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    color: '#555',
  },
  price: {
    fontSize: '1.3rem',
    color: '#2c7a4d',
    marginBottom: '0.5rem',
  },
  stock: {
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  category: {
    fontSize: '1rem',
    marginBottom: '1.5rem',
    color: '#666',
  },
  backLink: {
    fontSize: '1rem',
    textDecoration: 'none',
    color: '#0077cc',
  },
};
