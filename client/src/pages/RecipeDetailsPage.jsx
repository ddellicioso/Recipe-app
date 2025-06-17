import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`http://localhost:3001/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load recipe');
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchRecipe();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate('/recipes');
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="p-4 max-w-xl mx-auto text-red-500">
        <p>Error: {error}</p>
        <Link to="/recipes" className="underline text-pastelPink mt-2 inline-block">Back to list</Link>
      </div>
    );
  }

  if (!recipe) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto font-nunito bg-pastelAccent rounded-lg shadow mt-8">
      <Link to="/recipes" className="text-pastelPink hover:underline">&larr; Back</Link>

      {/* Display image if exists */}
      {recipe.image_path && (
        <img
            src={`http://localhost:3001${recipe.image_path}`}
            alt={recipe.title}
            className="w-full h-64 object-cover rounded mb-4"
        />
        )}

      <h1 className="text-3xl font-bold text-navy mb-2">{recipe.title}</h1>
      <p className="text-sm text-navy/70 mb-4">
        {recipe.category || '-'} &#8226; {recipe.duration || '-'}
      </p>
      <div className="mb-4 text-navy">
        <p><strong>Servings:</strong> {recipe.servings ?? '-'}</p>
        <p><strong>Calories:</strong> {recipe.calories ?? '-'}</p>
      </div>
      <section className="mb-4">
        <h2 className="text-xl font-semibold text-navy mb-2">Ingredients</h2>
        <ul className="list-disc list-inside text-navy">
          {recipe.ingredients.split(', ').map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-navy mb-2">Instructions</h2>
        <ol className="list-decimal list-inside text-navy">
          {recipe.instructions.split('\n').map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </section>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(`/recipes/${id}/edit`)}
          className="px-4 py-2 bg-pastelYellow text-navy rounded hover:bg-pastelPink transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
