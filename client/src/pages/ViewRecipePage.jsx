
import React, { useEffect, useState } from 'react';

export default function ViewRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError]     = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    fetch('http://localhost:3001/api/recipes/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setRecipes)
      .catch(err => setError(err.message));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this recipe?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // remove from state
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 max-w-xl mx-auto font-nunito">
      <h2 className="text-2xl font-bold mb-4 text-navy">My Recipes</h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes yet.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map(r => (
            <li key={r.id}
                className="border rounded-lg p-4 bg-pastelAccent shadow flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-navy">{r.title}</h3>
                {/* ... other fields ... */}
              </div>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-red-600 hover:underline ml-4"
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
