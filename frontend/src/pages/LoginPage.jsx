import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      setMsg(`Logged in as ${data.user?.email || JSON.stringify(data)}`);
      login(data.user);
      navigate('/');
    } catch (err) {
      setMsg('Login failed: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '40px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 10,
    background: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
  },
};
