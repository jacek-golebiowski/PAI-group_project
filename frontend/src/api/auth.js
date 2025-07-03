import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export const loginUser = async (email, password) => {
  const res = await API.post('/api/auth/login', { email, password });
  return res.data;
};

export const registerUser = async (email, password, name) => {
  const res = await API.post('/api/auth/register', {
    name,
    email,
    password,
  });
  return res.data;
};
