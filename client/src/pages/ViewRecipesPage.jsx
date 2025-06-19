// client/src/pages/ViewRecipesPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = ['All', 'Italian', 'Japanese', 'Quick Prep', 'Indonesian', 'Korean'];

// Determine API base: VITE_API_URL in dev, '' in production
const API_BASE = import.meta.env.VITE_API_URL || '';

export default function ViewRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('All');
  const { logout, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch recipes
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/recipes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Handle JSON vs HTML errors
        const contentType = res.headers.get('content-type') || '';
        let data;
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          throw new Error(text || `Server returned ${res.status}`);
        }
        if (!res.ok) throw new Error(data.message || 'Failed to fetch recipes');
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [token]);

  // Delete handler
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this recipe?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server returned ${res.status}`);
      }
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      setRecipes((rs) => rs.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const filtered =
    category === 'All' ? recipes : recipes.filter((r) => r.category === category);

  return (
    <div className="w-screen min-h-screen bg-navy flex justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header & logout */}
        <h1
          className="text-pastelYellow text-3xl font-bold text-center mb-6 cursor-pointer"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          Savoré
        </h1>

        {/* Category selector */}
        <div className="mb-6 px-4">
          <label className="block mb-2 text-pastelYellow">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-pastelAccent text-navy rounded border border-pastelPink focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Recipe list */}
        <div className="space-y-4 px-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="bg-navy border border-pastelPink rounded-lg p-4 flex items-center justify-between hover:bg-opacity-90 transition"
            >
              {/* Clickable preview */}
              <div
                className="flex-1 flex items-center cursor-pointer"
                onClick={() => navigate(`/recipes/${r.id}`)}
              >
                {r.image_path && (
                  <img
                    src={`${API_BASE}${r.image_path}`}
                    alt={r.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                )}

                <div>
                  <h3 className="text-2xl font-semibold text-pastelYellow">{r.title}</h3>
                  <p className="text-sm text-pastelPink/80">
                    {r.duration || '-'} • {r.calories ? `${r.calories} kcal` : '-'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recipes/${r.id}/edit`);
                  }}
                  className="text-sm bg-pastelPink text-navy px-3 py-1 rounded hover:bg-pastelAccent transition"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(e, r.id)}
                  className="text-sm bg-transparent border border-pastelPink text-pastelPink px-3 py-1 rounded hover:bg-red-600 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add recipe button */}
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
