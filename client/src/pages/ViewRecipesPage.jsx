import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

const CATEGORIES = ['All', 'Italian', 'Japanese', 'Quick Prep', 'Indonesian', 'Korean'];

export default function ViewRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError]     = useState(null);
  const [category, setCategory] = useState('All');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Fetch recipes
  useEffect(() => {
    async function loadRecipes() {
      try {
        const res = await fetch('http://localhost:3001/api/recipes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          const { message } = await res.json();
          throw new Error(message || 'Failed to fetch recipes');
        }
        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      }
    }
    loadRecipes();
  }, [token]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Filter by category
  const filtered = category === 'All'
    ? recipes
    : recipes.filter(r => r.category === category);

  return (
    <div className="w-screen h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Make the title a logout/back link */}
        <h1
          className="text-pastelYellow text-3xl font-bold text-center pt-6 cursor-pointer"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Savoré
        </h1>

        {/* Category Selector */}
        <div className="px-4 mt-6">
          <label className="block mb-2">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full p-2 bg-pastelAccent text-navy rounded border border-pastelPink focus:outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Recipe Cards */}
        <div className="px-4 mt-6 space-y-4">
          {filtered.map(r => (
            <div
              key={r.id}
              onClick={() => navigate(`/recipes/${r.id}`)}
              className="flex items-center bg-navy border border-pastelPink rounded-lg p-4 cursor-pointer hover:bg-opacity-90 transition"
            >
              {r.image_path && (
                <img
                  src={`http://localhost:3001${r.image_path}`}
                  alt={r.title}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-pastelYellow">{r.title}</h3>
                <p className="text-sm text-pastelPink/80">
                  {r.duration || '-'} • {r.calories ? `${r.calories}kcal` : '-'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Add Button */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => navigate('/add-recipe')}
            className="w-12 h-12 bg-pastelPink text-navy rounded-full text-4xl flex items-center justify-center shadow-lg"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
