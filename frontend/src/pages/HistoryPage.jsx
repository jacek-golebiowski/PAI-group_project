// src/pages/HistoryPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Navbar from '../components/Navbar';

export default function HistoryPage() {
    const { token } = useAuth();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch('/api/rentals/history', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(setHistory)
            .catch(console.error);
    }, [token]);

    return (
        <div className="page">
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>All Rentals History</h1>
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                        <tr>
                            <th style={styles.th}>User</th>
                            <th style={styles.th}>Rented At</th>
                            <th style={styles.th}>Returned At</th>
                            <th style={styles.th}>Products</th>
                        </tr>
                        </thead>
                        <tbody>
                        {history.map((r, idx) => (
                            <tr
                                key={r.id}
                                style={idx % 2 === 0 ? styles.trEven : styles.trOdd}
                            >
                                <td style={styles.td}>
                                    <strong>{r.user.name}</strong>
                                    <br />
                                    <small style={styles.small}>({r.user.email})</small>
                                </td>
                                <td style={styles.td}>{new Date(r.rentedAt).toLocaleString()}</td>
                                <td style={styles.td}>
                                    {r.returnedAt
                                        ? new Date(r.returnedAt).toLocaleString()
                                        : '-'}
                                </td>
                                <td style={styles.td}>
                                    {r.items.map(item => (
                                        <div key={item.id}>
                                            {item.product?.name || item.productName}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '4rem auto',
        padding: '0 2rem'
    },
    title: {
        fontSize: '2.4rem',
        marginBottom: '2rem',
        color: '#333'
    },
    tableWrapper: {
        overflowX: 'auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        padding: '1.5rem'
    },
    table: {
        width: '100%',
        minWidth: '800px',
        borderCollapse: 'separate',
        borderSpacing: 0
    },
    thead: {
        background: '#f5f5f5'
    },
    th: {
        padding: '1rem',
        fontSize: '1.1rem',
        color: '#555',
        textAlign: 'left',
        borderBottom: '2px solid #e0e0e0'
    },
    trEven: {
        background: '#ffffff'
    },
    trOdd: {
        background: '#fafafa'
    },
    td: {
        padding: '1rem',
        fontSize: '1rem',
        color: '#444',
        borderBottom: '1px solid #eee',
        verticalAlign: 'top'
    },
    small: {
        color: '#777',
        fontSize: '0.9rem'
    }
};
