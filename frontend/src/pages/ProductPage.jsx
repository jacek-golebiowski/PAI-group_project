import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setQuantity(data.stock > 0 ? 1 : 0);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load product.');
      });
  }, [id]);

  const handleRent = async () => {
    if (quantity < 1) return;
    try {
      const res = await fetch('/api/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: [{ productId: parseInt(id, 10), quantity }],
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Rental failed');
      }
      const data = await res.json();
      setMessage(`✅ Rental successful! ID: ${data.rentalId}`);
      // Optionally refetch stock:
      const updated = await fetch(`/api/products/${id}`).then(r => r.json());
      setProduct(updated);
      setQuantity(updated.stock > 0 ? 1 : 0);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

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

            {product.stock > 0 && (
            <>
              <div style={{ margin: '1rem 0' }}>
                <label htmlFor="qtySelect" style={{ marginRight: '0.5rem' }}>
                  Quantity:
                </label>
                <select
                  id="qtySelect"
                  value={quantity}
                  onChange={e => setQuantity(+e.target.value)}
                  style={{
                    padding: '0.3rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    minWidth: '60px',
                  }}
                >
                  {Array.from({ length: product.stock }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Total: {(product.price * quantity).toFixed(2)} zł
              </p>
              <Button onClick={handleRent}>Rent {quantity}</Button>
              <br />
              {message && (
                <p
                  style={{
                    marginTop: '1rem',
                    color: message.startsWith('✅') ? 'green' : 'red',
                  }}
                >
                  {message}
                </p>
              )}
            </>
          )}


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
    display: 'inline-block',
    marginTop: '2rem',
  },
};
