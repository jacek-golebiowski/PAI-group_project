import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../AuthContext';


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef();
  const navigate = useNavigate();


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
        <Link to="/" style={{...styles.link, marginRight: 20 }}>🏠 Home</Link>
        {user && <Link to="/rent" style={{...styles.link, marginRight: 20}}>Rent</Link>}
        {user?.role === 'admin' && (
              <>
                  <Link to="/history" style={{...styles.link, marginRight: 20 }}>History</Link>
                  <Link to="/manage-products" style={{...styles.link, marginRight: 20}}>Products</Link>
              </>
            )}
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
            {user && (
                <span
                    style={styles.link}
                    onClick={() => {
                      logout();
                      setTimeout(() => {
                        navigate('/', { replace: true });
                      }, 0);
                    }}
                >
                Logout
                </span>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
nav: {
  position: 'sticky',
  top: 0,
  zIndex: 999,
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  padding: '12px 24px',
  background: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
},
  link: {
    color: '#FFF',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: 18,
    cursor: 'pointer',
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
    background: 'rgba(0, 0, 0, 0.6)',
    color: '#000',
    borderRadius: 6,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 120,
  },
};
