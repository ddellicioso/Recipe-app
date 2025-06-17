import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    try {
      const res = await fetch(`http://localhost:3001${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'An error occurred');
        return;
      }
      if (isLogin) {
        login(data.token);
        navigate('/recipes');
      } else {
        setMessage('Registered successfully! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  return (
    <div className="w-screen h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-navy text-pastelPink rounded-2xl p-8 shadow-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-pastelYellow"></div>
        </div>
        <h1 className="text-center text-3xl font-extrabold text-pastelYellow mb-2">Savoré</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && <>
            <h2 className="text-2xl font-bold text-pastelPink text-center">Register</h2>
            <p className="text-xs text-pastelYellow mb-2 text-center">Create your new account now!</p>
          </>}
          <div>
            <label className="block text-xs mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 border border-pastelPink rounded focus:outline-none focus:ring-2 focus:ring-pastelYellow bg-transparent text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border border-pastelPink rounded focus:outline-none focus:ring-2 focus:ring-pastelYellow bg-transparent text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-pastelYellow text-navy font-bold rounded hover:bg-pastelAccent transition"
          >
            {isLogin ? 'Log in' : 'Sign up'}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-pastelYellow text-sm">{message}</p>}
        <div className="mt-4 text-center text-xs">
          {isLogin ? (
            <p>
              Don't have an account yet?{' '}
              <button onClick={toggleMode} className="text-pastelYellow hover:underline focus:outline-none">
                Sign up now!
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={toggleMode} className="text-pastelYellow hover:underline focus:outline-none">
                Log in
              </button>
            </p>
          )}
        </div>
        <footer className="mt-6 text-center text-xs text-pastelYellow opacity-70">
          © 2025 Adeline Agna. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
