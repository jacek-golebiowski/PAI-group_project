// src/pages/ManageProductsPage.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import Navbar from '../components/Navbar';

export default function ManageProductsPage() {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [current, setCurrent] = useState(null);
    const initialForm = {
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        imageName: ''
    };

    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const [form, setForm] = useState(initialForm);

    const fetchAll = () => {
        fetch('/api/products', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(setProducts)
            .catch(console.error);
    };

    useEffect(fetchAll, [token]);

    const openAdd = () => {
        setForm(initialForm);
        setShowAdd(true);
    };

    const openEdit = p => {
        setCurrent(p);
        setForm({
            name: p.name,
            description: p.description || '',
            price: p.price,
            stock: p.stock,
            categoryId: p.categoryId,
            imageName: p.imageName || ''
        });
        setShowEdit(true);
    };

    const closeModal = () => {
        setShowAdd(false);
        setShowEdit(false);
        setCurrent(null);
    };

    const handleAdd = async e => {
        e.preventDefault();
        await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock, 10),
                categoryId: parseInt(form.categoryId, 10)
            })
        });
        closeModal();
        fetchAll();
    };

    const extractFilename = (value) => value?.split('/').pop() || '';


    const handleEdit = async e => {
        e.preventDefault();
        await fetch(`/api/products/${current.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                ...form,
                imageName: extractFilename(form.imageName),
                price: parseFloat(form.price),
                stock: parseInt(form.stock, 10),
                categoryId: parseInt(form.categoryId, 10)
            })
        });
        closeModal();
        fetchAll();
    };

    const handleDelete = async id => {
        await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAll();
    };

    return (
        <div className="page">
            <Navbar />
            <div style={styles.container}>
                <h1 style={styles.title}>Manage Products</h1>
                <button style={styles.addBtn} onClick={openAdd}>
                    + Add New Product
                </button>

                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead style={styles.thead}>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Stock</th>
                            <th style={styles.th}>Category ID</th>
                            <th style={styles.th}>Image</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((p, idx) => (
                            <tr
                                key={p.id}
                                style={idx % 2 === 0 ? styles.trEven : styles.trOdd}
                            >
                                <td style={styles.td}>{p.name}</td>
                                <td style={styles.td}>{p.price} zł</td>
                                <td style={styles.td}>{p.stock}</td>
                                <td style={styles.td}>{p.categoryId}</td>
                                <td style={styles.td}>{p.imageName}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.editBtn}
                                        onClick={() => openEdit(p)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => {
                                            setPendingDeleteId(p.id);
                                            setShowConfirm(true);
                                        }}
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Modal */}
                {showAdd && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <h2>Add Product</h2>
                            <form style={styles.form} onSubmit={handleAdd}>
                                <input
                                    style={styles.input}
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={e =>
                                        setForm(f => ({ ...f, name: e.target.value }))
                                    }
                                    required
                                />
                                <input
                                    style={styles.input}
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={e =>
                                        setForm(f => ({ ...f, description: e.target.value }))
                                    }
                                />
                                <input
                                    style={styles.input}
                                    placeholder="Price"
                                    type="number"
                                    step="0.01"
                                    value={form.price}
                                    onChange={e =>
                                        setForm(f => ({ ...f, price: e.target.value }))
                                    }
                                    required
                                />
                                <input
                                    style={styles.input}
                                    placeholder="Stock"
                                    type="number"
                                    value={form.stock}
                                    onChange={e =>
                                        setForm(f => ({ ...f, stock: e.target.value }))
                                    }
                                    required
                                />
                                <input
                                    style={styles.input}
                                    placeholder="Category ID"
                                    type="number"
                                    value={form.categoryId}
                                    onChange={e =>
                                        setForm(f => ({ ...f, categoryId: e.target.value }))
                                    }
                                    required
                                />
                                <input
                                    style={styles.input}
                                    placeholder="Image filename"
                                    value={form.imageName}
                                    onChange={e =>
                                        setForm(f => ({ ...f, imageName: e.target.value }))
                                    }
                                />
                                <div style={styles.modalActions}>
                                    <button type="submit" style={styles.saveBtn}>
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        style={styles.cancelBtn}
                                        onClick={closeModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {showEdit && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <h2>Edit Product</h2>
                            <form style={styles.form} onSubmit={handleEdit}>
                                <div style={styles.field}>
                                    <label style={styles.label}>Name</label>
                                    <input
                                        style={styles.input}
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Description</label>
                                    <input
                                        style={styles.input}
                                        value={form.description}
                                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Price</label>
                                    <input
                                        style={styles.input}
                                        type="number"
                                        step="0.01"
                                        value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Stock</label>
                                    <input
                                        style={styles.input}
                                        type="number"
                                        value={form.stock}
                                        onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Category ID</label>
                                    <input
                                        style={styles.input}
                                        type="number"
                                        value={form.categoryId}
                                        onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div style={styles.field}>
                                    <label style={styles.label}>Image filename</label>
                                    <input
                                        style={styles.input}
                                        value={form.imageName?.split('/').pop() || ''}
                                        onChange={e => setForm(f => ({ ...f, imageName: e.target.value }))}
                                    />
                                </div>
                                <div style={styles.modalActions}>
                                    <button type="submit" style={styles.saveBtn}>Update</button>
                                    <button type="button" style={styles.cancelBtn} onClick={closeModal}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {showConfirm && (
                <div style={styles.modalOverlay}>
                    <div style={styles.confirmBox}>
                        <h3 style={{ marginBottom: '1rem' }}>Are you sure you want to delete this product?</h3>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                style={styles.cancelBtn}
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.confirmBtn}
                                onClick={() => {
                                    handleDelete(pendingDeleteId);
                                    setShowConfirm(false);
                                    setPendingDeleteId(null);
                                }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1100px',
        margin: '3rem auto',
        padding: '0 1rem'
    },
    title: {
        fontSize: '2rem',
        marginBottom: '1rem',
        color: '#333'
    },
    addBtn: {
        marginBottom: '1.5rem',
        padding: '0.6rem 1.2rem',
        fontSize: '1rem',
        background: '#4caf50',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    tableWrapper: {
        overflowX: 'auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        padding: '1rem',
        marginBottom: '2rem'
    },
    table: {
        width: '100%',
        minWidth: '700px',
        borderCollapse: 'separate',
        borderSpacing: 0
    },
    thead: {
        background: '#f5f5f5'
    },
    th: {
        padding: '1rem',
        textAlign: 'left',
        fontSize: '1rem',
        color: '#555',
        borderBottom: '2px solid #e0e0e0'
    },
    trEven: {
        background: '#fafafa'
    },
    trOdd: {
        background: '#ffffff'
    },
    td: {
        padding: '1rem',
        fontSize: '1rem',
        color: '#444',
        borderBottom: '1px solid #eee',
        verticalAlign: 'middle'
    },
    editBtn: {
        marginRight: '0.5rem',
        marginBottom: '0.5rem',
        padding: '0.4rem 0.8rem',
        width: '80px',
        fontSize: '0.9rem',
        background: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    deleteBtn: {
        padding: '0.4rem 0.8rem',
        width: '80px',
        fontSize: '0.9rem',
        background: '#d32f2f',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
    },
    form: {
        display: 'grid',
        gap: '1rem'
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #ccc'
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '1rem',
        marginTop: '1rem'
    },
    saveBtn: {
        padding: '0.6rem 1.2rem',
        background: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    cancelBtn: {
        padding: '0.6rem 1.2rem',
        background: '#aaa',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    label: {
        fontWeight: 'bold',
        marginBottom: '0.3rem',
        color: '#333'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem'
    },
    confirmBox: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        color: '#333'
    },

    confirmBtn: {
        padding: '0.5rem 1rem',
        backgroundColor: '#c00',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
};