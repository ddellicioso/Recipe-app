// client/src/pages/EditRecipePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const CATEGORIES = ['Italian', 'Japanese', 'Quick Prep', 'Indonesian', 'Korean'];

export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    foodName: '',
    category: CATEGORIES[0],
    duration: '',
    servings: '',
    calories: '',
    ingredientInput: '',
    stepInput: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load');
        setForm({
          foodName: data.title,
          category: data.category || CATEGORIES[0],
          duration: data.duration || '',
          servings: data.servings || '',
          calories: data.calories || '',
          ingredientInput: '',
          stepInput: '',
        });
        setIngredients(data.ingredients.split(', ').filter(Boolean));
        setSteps(data.instructions.split('\n').filter(Boolean));
      } catch (err) {
        setMessage(err.message);
      }
    })();
  }, [id, token]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const handleSubmit = async e => {
    e.preventDefault();
    const body = new FormData();
    body.append('title', form.foodName);
    body.append('category', form.category);
    body.append('duration', form.duration);
    body.append('servings', form.servings);
    body.append('calories', form.calories);
    body.append('ingredients', ingredients.join(', '));
    body.append('instructions', steps.join('\n'));
    if (imageFile) body.append('image', imageFile);

    try {
      const res = await fetch(`http://localhost:3001/api/recipes/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      navigate(`/recipes/${id}`);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="w-screen h-screen bg-navy flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-y-auto pb-8">
        <div className="bg-navy text-pastelPink p-8 rounded-3xl font-nunito shadow-lg relative">
          {/* Cancel link */}
          <Link
            to={`/recipes/${id}`}
            className="absolute left-8 top-8 text-pastelPink underline hover:text-pastelAccent text-sm"
          >
            &lt; cancel
          </Link>

          {/* Header */}
          <h2 className="text-center mb-4 font-extrabold text-3xl tracking-tight text-pastelPink">
            Savoré
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Photo */}
            <div>
              <label>Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files[0])}
                className="block mt-1"
              />
            </div>

            {/* Food Name */}
            <div>
              <label className="block mb-1">food name</label>
              <input
                name="foodName"
                value={form.foodName}
                onChange={handleChange}
                className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1">category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration | Servings | Calories */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block mb-1">duration</label>
                <input
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
                  placeholder="e.g. 30 min"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">servings</label>
                <input
                  name="servings"
                  value={form.servings}
                  onChange={handleChange}
                  className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
                  placeholder="e.g. 2"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1">calories</label>
                <input
                  name="calories"
                  value={form.calories}
                  onChange={handleChange}
                  className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
                  placeholder="e.g. 350"
                />
              </div>
            </div>

            {/* Ingredients */}
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
                {ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Step by step */}
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
                {steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mt-2 w-full py-2 rounded-lg bg-pastelYellow text-navy font-bold shadow hover:bg-pastelPink transition"
            >
              Update Recipe
            </button>
          </form>

          {/* Message */}
          <div className="text-pastelYellow mt-3">{message}</div>

          {/* Footer */}
          <footer className="text-xs text-pastelYellow mt-8 text-center opacity-70">
            © 2025 Adeline Agna. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
