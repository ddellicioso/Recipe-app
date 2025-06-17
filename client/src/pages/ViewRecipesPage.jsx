// client/src/pages/ViewRecipesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ViewRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError]     = useState(null);
  const token = localStorage.getItem('token');

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
        // Cache for offline use
        localStorage.setItem('recipes', JSON.stringify(data));
      } catch (err) {
        console.warn('Fetch failed, loading from cache:', err);
        const cached = localStorage.getItem('recipes');
        if (cached) {
          setRecipes(JSON.parse(cached));
        } else {
          setError('Unable to load recipes (offline and no cache)');
        }
      }
    }

    loadRecipes();
  }, [token]);

  if (error) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto font-nunito">
      <h2 className="text-2xl font-bold mb-4 text-navy">My Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes yet.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map(r => (
            <li
              key={r.id}
              className="border rounded-lg p-4 bg-pastelAccent shadow flex justify-between items-start"
            >
              <div>
                <h3 className="text-xl font-semibold text-navy">{r.title}</h3>
                <p className="text-sm text-navy/70 mb-1">
                  {r.category || '–'} • {r.duration || '–'}
                </p>
                <p className="text-navy mb-1">
                  <strong>Servings:</strong> {r.servings ?? '–'}
                </p>
                <p className="text-navy mb-1">
                  <strong>Calories:</strong> {r.calories ?? '–'}
                </p>
                <p className="text-navy mb-1">
                  <strong>Ingredients:</strong> {r.ingredients}
                </p>
                <p className="text-navy">
                  <strong>Instructions:</strong>
                  <br />
                  {r.instructions.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link to={`/recipes/${r.id}/edit`} className="text-blue-500 hover:underline">Edit</Link>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Delete this recipe?')) {
                    fetch(`http://localhost:3001/api/recipes/${r.id}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` }
                    })
                      .then(res => res.json())
                      .then(() => {
                        setRecipes(rs => rs.filter(x => x.id !== r.id));
                        // update cache
                        localStorage.setItem(
                          'recipes',
                          JSON.stringify(recipes.filter(x => x.id !== r.id))
                        );
                      })
                      .catch(err => setError(err.message));
                  }
                }}
                className="text-red-600 hover:underline ml-4 self-start"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
