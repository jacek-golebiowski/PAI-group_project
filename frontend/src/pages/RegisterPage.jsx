import { useState } from 'react';
import { registerUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(email, password, name);
      setMsg('Registered successfully: ' + JSON.stringify(data));
      navigate('/login');
    } catch (err) {
      setMsg('Registration failed: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div style={styles.container}>
      <h1>Register</h1>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
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
        <button type="submit" style={styles.button}>Register</button>
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
