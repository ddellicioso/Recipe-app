import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const { login }             = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'http://localhost:3001/api/auth/login'
      : 'http://localhost:3001/api/auth/register';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (isLogin) {
        login(data.token);
        setMessage('Logged in!');
      } else {
        setMessage('Registered! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 font-nunito">
      <h2 className="text-2xl mb-4">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-pastelYellow text-navy rounded"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <p className="mt-2 text-sm text-pastelPink">{message}</p>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-2 text-blue-500 hover:underline"
      >
        Switch to {isLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}
