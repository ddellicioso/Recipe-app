// client/src/pages/EditRecipePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

const CATEGORIES = ["Italian", "Japanese", "Quick Prep", "Indonesian"];

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [form, setForm]     = useState({
    foodName: '',
    category: CATEGORIES[0],
    duration: '',
    servings: '',
    calories: '',
    ingredientInput: '',
    stepInput: ''
  });
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps]             = useState([]);
  const [imageFile, setImageFile]     = useState(null);
  const [message, setMessage]         = useState('');

  // Fetch the existing recipe
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/api/recipes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRecipe(data);
        // Prefill form
        setForm({
          foodName: data.title || '',
          category: data.category || CATEGORIES[0],
          duration: data.duration || '',
          servings: data.servings || '',
          calories: data.calories || '',
          ingredientInput: '',
          stepInput: ''
        });
        setIngredients(data.ingredients ? data.ingredients.split(', ') : []);
        setSteps(data.instructions ? data.instructions.split('\n') : []);
      })
      .catch(err => setMessage(err.message));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addIngredient = () => {
    if (form.ingredientInput.trim()) {
      setIngredients([...ingredients, form.ingredientInput.trim()]);
      setForm({ ...form, ingredientInput: '' });
    }
  };

  const addStep = () => {
    if (form.stepInput.trim()) {
      setSteps([...steps, form.stepInput.trim()]);
      setForm({ ...form, stepInput: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', form.foodName);
    formData.append('category', form.category);
    formData.append('duration', form.duration);
    formData.append('servings', form.servings);
    formData.append('calories', form.calories);
    formData.append('ingredients', ingredients.join(', '));
    formData.append('instructions', steps.join('\n'));
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate('/recipes');
    } catch (err) {
      setMessage(err.message);
    }
  };

  // Show loading state
  if (!recipe) {
    return <p className="p-4">Loading recipe…</p>;
  }

  return (
    <div className="bg-navy text-pastelPink p-8 rounded-3xl max-w-md mx-auto mt-8 font-nunito shadow-lg relative">
      <Link to="/recipes" className="absolute left-8 top-8 text-pastelPink underline hover:text-pastelAccent text-sm">
        &lt; cancel
      </Link>
      <h2 className="text-center mb-4 font-extrabold text-3xl tracking-tight text-pastelPink">
        Edit Recipe
      </h2>

      {/* Existing image preview */}
      {recipe.image_path && (
        <img
          src={`http://localhost:3001${recipe.image_path}`}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1">Change Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="block mt-1"
          />
        </div>

        <div>
          <label className="block mb-1">food name</label>
          <input
            name="foodName"
            value={form.foodName}
            onChange={handleChange}
            className="w-full rounded-md p-2 bg-pastelAccent text-navy focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-md p-2 bg-pastelAccent text-navy focus:outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block mb-1">duration</label>
            <input
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full rounded-md p-2 bg-pastelAccent text-navy focus:outline-none"
              placeholder="e.g. 30 min"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">servings</label>
            <input
              name="servings"
              type="number"
              value={form.servings}
              onChange={handleChange}
              className="w-full rounded-md p-2 bg-pastelAccent text-navy focus:outline-none"
              placeholder="e.g. 2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">calories</label>
            <input
              name="calories"
              type="number"
              value={form.calories}
              onChange={handleChange}
              className="w-full rounded-md p-2 bg-pastelAccent text-navy focus:outline-none"
              placeholder="e.g. 350"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">ingredients</label>
          <div className="flex mb-1">
            <input
              name="ingredientInput"
              value={form.ingredientInput}
              onChange={handleChange}
              className="flex-1 rounded-md p-2 bg-pastelAccent text-navy focus:outline-none"
              placeholder="Type ingredient"
            />
            <button
              type="button"
              onClick={addIngredient}
              className="ml-2 px-3 py-1 rounded-lg bg-pastelPink text-navy hover:bg-pastelAccent transition"
            >
              + add
            </button>
          </div>
          <ul className="list-disc list-inside text-xs text-pastelYellow">
            {ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </div>

        <div>
          <label className="block mb-1">step by step</label>
          <div className="flex mb-1">
            <input
              name="stepInput"
              value={form.stepInput}
              onChange={handleChange}
              className="flex-1 rounded-md p-2 bg-pastelAccent text-navy focus:outline-none"
              placeholder="Type step"
            />
            <button
              type="button"
              onClick={addStep}
              className="ml-2 px-3 py-1 rounded-lg bg-pastelPink text-navy hover:bg-pastelAccent transition"
            >
              + add
            </button>
          </div>
          <ol className="list-decimal list-inside text-xs text-pastelYellow">
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>

        <button
          type="submit"
          className="mt-2 w-full py-2 rounded-lg bg-pastelYellow text-navy font-bold hover:bg-pastelPink transition"
        >
          update recipe
        </button>
      </form>

      {message && <p className="mt-4 text-pastelYellow">{message}</p>}
    </div>
  );
}
