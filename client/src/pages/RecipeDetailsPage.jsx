// client/src/pages/RecipeDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import TimeIcon     from '../components/icons/TimeIcon';
import ServingsIcon from '../components/icons/ServingsIcon';
import CaloriesIcon from '../components/icons/CaloriesIcon';
import { useParams, useNavigate } from 'react-router-dom';

// Determine API base: VITE_API_URL in dev, '' in production
const API_BASE = import.meta.env.VITE_API_URL || '';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [recipe, setRecipe] = useState(null);
  const [error, setError]   = useState('');

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(`${API_BASE}/api/recipes/${id}`, {
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
        if (res.status === 403) {
          navigate('/');
          return;
        }
        if (!res.ok) throw new Error(data.message || 'Failed to load');
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchRecipe();
  }, [id, token, navigate]);

  if (error) {
    return (
      <div className="w-screen h-screen bg-navy flex items-center justify-center px-4">
        <p className="text-pastelPink">{error}</p>
      </div>
    );
  }
  if (!recipe) {
    return (
      <div className="w-screen h-screen bg-navy flex items-center justify-center px-4">
        <p className="text-pastelPink">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-screen bg-navy min-h-screen flex justify-center px-4 py-8">
      <div className="w-full max-w-md overflow-y-auto pb-24">
        {/* back link */}
        <button
          onClick={() => navigate('/recipes')}
          className="bg-navy text-pastelPink text-sm mb-4 hover:underline"
        >
          &lt; recipes
        </button>

        {/* Title */}
        <h1 className="text-center text-3xl font-bold text-pastelYellow mb-4">
          Savoré
        </h1>

        {/* Image */}
        {recipe.image_path && (
          <img
            src={`${API_BASE}${recipe.image_path}`}
            alt={recipe.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        {/* Recipe name & category */}
        <h2 className="text-2xl font-semibold text-pastelYellow mb-1">
          {recipe.title}
        </h2>
        <p className="text-sm italic text-pastelPink mb-4">
          {recipe.category || '-'}
        </p>

        {/* Details row */}
        <div className="flex justify-between text-pastelAccent mb-6">
          <div className="flex items-center space-x-1">
            <TimeIcon className="w-5 h-5" />
            <span>{recipe.duration || '-'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ServingsIcon className="w-5 h-5" />
            <span>{recipe.servings ?? '-'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <CaloriesIcon className="w-5 h-5" />
            <span>{recipe.calories ? `${recipe.calories} kcal` : '-'}</span>
          </div>
        </div>

        {/* Ingredients */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold text-pastelAccent mb-2">
            Ingredients
          </h3>
          <ul className="list-disc list-inside text-pastelAccent space-y-1">
            {recipe.ingredients.split(', ').map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section>
          <h3 className="text-xl font-semibold text-pastelAccent mb-2">
            Step by step
          </h3>
          <ol className="list-decimal list-inside text-pastelAccent space-y-1">
            {recipe.instructions.split('\n').map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </section>

        {/* Floating Edit button */}
        <button
          onClick={() => navigate(`/recipes/${id}/edit`)}
          className="mt-6 w-full py-2 bg-pastelPink text-navy font-bold rounded hover:bg-pastelAccent transition"
        >
          Edit Recipe
        </button>

        {/* Footer */}
        <footer className="text-xs text-pastelYellow mt-8 text-center opacity-70">
          © 2025 Adeline Agna. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
