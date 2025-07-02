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
        }))
      );
      const grouped = flatItems.reduce((acc, { product, quantity }) => {
        if (!acc[product.id]) acc[product.id] = { product, total: 0 };
        acc[product.id].total += quantity;
        return acc;
      }, {});
      const initial = {};
      Object.values(grouped).forEach(g => {
        initial[g.product.id] = g.total > 0 ? 1 : 0;
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
      for (const rental of rentals) {
        const item = rental.items.find(i => i.product.id === productId && !rental.returnedAt);
        if (!item) continue;
        const returnCount = Math.min(remaining, item.quantity);
        if (returnCount < 1) continue;
        await fetch(`/api/rentals/${rental.id}/return`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity: returnCount }),
        });
        remaining -= returnCount;
        if (remaining <= 0) break;
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
    <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    </div>
  );

  const flatItems = rentals.flatMap(rental =>
    rental.items.map(item => ({
      rental,
      item,
    }))
  );
  const groups = flatItems.reduce((acc, { rental, item }) => {
    const pid = item.product.id;
    if (!acc[pid]) acc[pid] = { product: item.product, total: 0 };
    acc[pid].total += item.quantity;
    return acc;
  }, {});

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#333' }}>Your Rentals</h1>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
            <div style={{
              background: 'white',
              border: '2px solid black',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                border: '3px solid transparent',
                borderTop: '5px solid green',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : Object.values(groups).length === 0 ? (
          <p>No active rentals found.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {Object.values(groups).map(({ product, total }) => (
              <div key={product.id} style={{ background: '#fff', padding: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: 0 }}>{product.name}</h3>
                <p style={{ margin: '0.5rem 0' }}>Total Rented: {total}</p>
                <div style={{ margin: '0.5rem 0' }}>
                  <label htmlFor={`return-${product.id}`} style={{ marginRight: '0.5rem' }}>Return:</label>
                  <select
                    id={`return-${product.id}`}
                    value={returnQuantities[product.id] || 0}
                    onChange={e => setReturnQuantities(rq => ({ ...rq, [product.id]: +e.target.value }))}
                    style={{ padding: '0.3rem', borderRadius: '6px', border: '1px solid #ccc', minWidth: '60px' }}
                  >
                    {Array.from({ length: total }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <Button onClick={() => handleReturn(product.id)} disabled={actionLoading[product.id] || total < 1}>
                  {actionLoading[product.id] ? 'Returning...' : `Return ${returnQuantities[product.id] || 0}`}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
