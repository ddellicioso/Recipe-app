import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

// Determine API base: VITE_API_URL in dev, '' in production
const API_BASE = import.meta.env.VITE_API_URL || '';

const CATEGORIES = ["Italian", "Japanese", "Quick Prep", "Indonesian"];

const AddRecipePage = () => {
  const [form, setForm] = useState({
    foodName: "",
    category: CATEGORIES[0],
    duration: "",
    servings: "",
    calories: "",
    ingredientInput: "",
    stepInput: "",
  });
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addIngredient = () => {
    if (form.ingredientInput.trim()) {
      setIngredients([...ingredients, form.ingredientInput.trim()]);
      setForm({ ...form, ingredientInput: "" });
    }
  };

  const addStep = () => {
    if (form.stepInput.trim()) {
      setSteps([...steps, form.stepInput.trim()]);
      setForm({ ...form, stepInput: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in.");
      return;
    }

    const formData = new FormData();
    formData.append('title', form.foodName);
    formData.append('category', form.category);
    formData.append('duration', form.duration);
    formData.append('servings', form.servings);
    formData.append('calories', form.calories);
    formData.append('ingredients', ingredients.join(', '));
    formData.append('instructions', steps.join('\n'));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const res = await fetch(`${API_BASE}/api/recipes/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Handle JSON vs. non-JSON responses
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || `Server returned ${res.status}`);
      }

      if (!res.ok) throw new Error(data.message || 'An error occurred');

      setMessage("Recipe added! 🎉");
      navigate('/recipes');
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="bg-navy text-pastelPink p-8 rounded-3xl max-w-md mx-auto mt-8 font-nunito shadow-lg relative">
      {/* Cancel link */}
      <Link
        to={`/recipes`}
        className="absolute left-8 top-8 text-pastelPink underline hover:text-pastelAccent text-sm"
      >
        &lt; cancel
      </Link>
      <h2 className="text-center mb-4 font-extrabold text-3xl tracking-tight text-pastelPink">Savoré</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label>Photo</label>
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
            className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
          />
        </div>
        <div>
          <label className="block mb-1">category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block mb-1">duration</label>
            <input name="duration" value={form.duration} onChange={handleChange}
              className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
              placeholder="e.g. 30 min"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">servings</label>
            <input name="servings" value={form.servings} onChange={handleChange}
              className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
              placeholder="e.g. 2"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">calories</label>
            <input name="calories" value={form.calories} onChange={handleChange}
              className="w-full rounded-md p-2 bg-pastelAccent text-navy mb-1 focus:outline-none"
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
            <button type="button" onClick={addIngredient}
              className="ml-2 px-3 py-1 rounded-lg bg-pastelPink text-navy hover:bg-pastelAccent transition"
            >+ add</button>
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
            <button type="button" onClick={addStep}
              className="ml-2 px-3 py-1 rounded-lg bg-pastelPink text-navy hover:bg-pastelAccent transition"
            >+ add</button>
          </div>
          <ol className="list-decimal list-inside text-xs text-pastelYellow">
            {steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>
        <button type="submit"
          className="mt-2 w-full py-2 rounded-lg bg-pastelYellow text-navy font-bold shadow hover:bg-pastelPink transition"
        >
          add recipe
        </button>
      </form>
      <div className="text-pastelYellow mt-3">{message}</div>
      <footer className="text-xs text-pastelYellow mt-8 text-center opacity-70">
        © 2025 Adeline Agna. All rights reserved.
      </footer>
    </div>
  );
};

export default AddRecipePage;
