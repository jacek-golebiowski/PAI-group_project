import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav style={styles.nav}>
      <div>
        <Link to="/" style={styles.logo}>🏠 Home</Link>
      </div>

      <div style={styles.userArea} ref={menuRef}>
        {user && <span style={styles.hello}>Hello, {user.name}!</span>}
        <FaUserCircle
          size={28}
          style={styles.icon}
          onClick={() => setOpen((prev) => !prev)}
        />
        {open && (
          <div style={styles.dropdown}>
            {!user && <Link to="/login" style={styles.link}>Login</Link>}
            {!user && <Link to="/register" style={styles.link}>Register</Link>}
            {user && <span style={styles.link} onClick={logout}>Logout</span>}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#1976d2',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  logo: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  hello: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  icon: {
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    background: '#fff',
    color: '#000',
    borderRadius: 6,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 120,
  },
  link: {
    color: '#1976d2',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};
