import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

export default function RentalsPage() {
  const { token } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [returnQuantities, setReturnQuantities] = useState({});

  useEffect(() => {
    fetchUserRentals();
  }, []);

  const fetchUserRentals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/rentals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load rentals');
      const data = await res.json();
      setRentals(data);

      const flatItems = data.flatMap(rental =>
          rental.items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            itemId: item.id,
          }))
      );

      const grouped = flatItems.reduce((acc, { product, quantity, itemId }) => {
        const pid = product?.id || `deleted-${itemId}`;
        if (!acc[pid]) {
          acc[pid] = {
            product: product || { id: pid, name: 'Deleted product' },
            total: 0,
            pid
          };
        }
        acc[pid].total += quantity;
        return acc;
      }, {});

      const initial = {};
      Object.entries(grouped).forEach(([id, g]) => {
        initial[id] = g.total > 0 ? 1 : 0;
      });
      setReturnQuantities(initial);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (productId) => {
    const qtyToReturn = returnQuantities[productId];
    if (!qtyToReturn || qtyToReturn < 1) return;
    setActionLoading(a => ({ ...a, [productId]: true }));
    try {
      let remaining = qtyToReturn;

      const itemsToReturn = rentals
          .flatMap(r => r.items.map(item => ({ rentalId: r.id, item })))
          .filter(({ item }) => item.product?.id === productId && item.quantity > 0);

      for (const { rentalId, item } of itemsToReturn) {
        if (remaining <= 0) break;
        await fetch(`/api/rentals/${rentalId}/return`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId: item.id })
        });
        remaining -= 1;
      }

      await fetchUserRentals();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setActionLoading(a => ({ ...a, [productId]: false }));
    }
  };

  if (error) return (
      <div className="page">
        <Navbar />
        <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
  );

  const flatItems = rentals.flatMap(rental =>
      rental.items.map(item => ({
        rental,
        item
      }))
  );

  const groups = flatItems.reduce((acc, { item }) => {
    const pid = item.product?.id || `deleted-${item.id}`;
    if (!acc[pid]) {
      acc[pid] = {
        product: item.product || { id: pid, name: 'Deleted product' },
        total: 0,
        pid
      };
    }
    acc[pid].total += item.quantity;
    return acc;
  }, {});

  return (
      <div className="page">
        <Navbar />
        <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>Your Rentals</h1>
          {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                  border: '3px solid #ccc',
                  borderTop: '3px solid green',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  margin: 'auto',
                  animation: 'spin 1s linear infinite'
                }} />
                <style>
                  {`@keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }`}
                </style>
              </div>
          ) : Object.values(groups).length === 0 ? (
              <p>No active rentals found.</p>
          ) : (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {Object.values(groups).map(({ product, total, pid }) => (
                    <div key={pid} style={{
                      background: '#fff',
                      padding: '1rem',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <h3 style={{ margin: 0 }}>
                        {product.name || <em style={{ color: '#777' }}>Deleted product</em>}
                      </h3>
                      <p style={{ margin: '0.5rem 0' }}>Total Rented: {total}</p>
                      <div style={{ margin: '0.5rem 0' }}>
                        <label htmlFor={`return-${pid}`} style={{ marginRight: '0.5rem' }}>Return:</label>
                        <select
                            id={`return-${pid}`}
                            value={returnQuantities[pid] || 0}
                            onChange={e => setReturnQuantities(rq => ({ ...rq, [pid]: +e.target.value }))}
                            style={{ padding: '0.3rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: '60px' }}
                        >
                          {Array.from({ length: total }, (_, i) => i + 1).map(n => (
                              <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                      <Button
                          onClick={() => product?.id && handleReturn(product.id)}
                          disabled={!product?.id || actionLoading[pid] || total < 1}
                      >
                        {actionLoading[pid] ? 'Returning...' : `Return ${returnQuantities[pid] || 0}`}
                      </Button>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
}
