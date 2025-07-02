import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import sportsBanner from '../../images/sports-banner.png';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [messages, setMessages] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        const q = {};
        data.forEach(p => { q[p.id] = p.stock > 0 ? 1 : 0; });
        setQuantities(q);
      })
      .catch(err => console.error('Error fetching products:', err));
  };

  const handleQtyChange = (productId, value) => {
    const v = Math.max(1, Math.min(value, products.find(p => p.id === productId).stock));
    setQuantities(q => ({ ...q, [productId]: v }));
  };

  const handleRent = async (productId) => {
    const quantity = quantities[productId];
    if (!quantity || quantity < 1) return;

    try {
      const res = await fetch('/api/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ items: [{ productId, quantity }] }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Rental failed');
      }
      const data = await res.json();
      setMessages(m => ({ ...m, [productId]: `✅ Rented (ID: ${data.rentalId})` }));
      fetchProducts();
    } catch (err) {
      setMessages(m => ({ ...m, [productId]: `❌ ${err.message}` }));
    }
  };

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={styles.bannerContainer}>
        <img src={sportsBanner} alt="Sports Banner" style={styles.banner} />
        <div style={styles.overlayText}>
          <h1 style={styles.title}>Gear Up, Game On.</h1>
          <p style={styles.subtitle}>Rent top‑quality sports gear for your next adventure.</p>
        </div>
      </div>

      <h1 style={styles.heading}>Available Equipment</h1>
      <div
        className="product-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          alignItems: 'stretch',
          width: '100%',
          flex: 1,
        }}
      >
        {products.map(product => {
          const qty = quantities[product.id] || 1;
          const total = (qty * product.price).toFixed(2);
          return (
            <div
              key={product.id}
              className="product-card dark"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1rem',
                boxSizing: 'border-box',
                height: '100%',
                textAlign: 'left',
              }}
            >
              {/* Top: Info */}
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>
                  <Link
                    to={`/products/${product.id}`}
                    style={{ color: '#ffA500', textDecoration: 'none' }}
                  >
                    {product.name}
                  </Link>
                </h3>
                <p style={{ margin: '0.5rem 0' }}>{product.description}</p>
                <p style={{ margin: '0.5rem 0' }}>
                  <strong>{product.price} zł</strong> –{' '}
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                </p>
                {product.stock > 0 && (
                  <div style={{ margin: '0.5rem 0' }}>
                    <label htmlFor={`qty-${product.id}`} style={{ marginRight: '0.5rem' }}>
                      Qty:
                    </label>
                    <select
                      id={`qty-${product.id}`}
                      value={qty}
                      onChange={e => handleQtyChange(product.id, +e.target.value)}
                      style={{
                        padding: '0.3rem',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        minWidth: '50px',
                      }}
                    >
                      {Array.from({ length: product.stock }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <span style={{ marginLeft: '1rem', fontWeight: 'bold' }}>
                      Total: {total} zł
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom: Button + Message */}
              <div style={{ marginTop: 'auto' }}>
                {product.stock > 0 && (
                  <>
                    <Button onClick={() => handleRent(product.id)}>
                      Rent {qty}
                    </Button>
                    {messages[product.id] && (
                      <p
                        style={{
                          marginTop: '0.5rem',
                          color: messages[product.id].startsWith('✅') ? 'green' : 'red',
                          fontSize: '0.9rem',
                        }}
                      >
                        {messages[product.id]}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
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
