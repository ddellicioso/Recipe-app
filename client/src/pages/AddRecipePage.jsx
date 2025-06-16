import React, { useState } from "react";

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

    const body = {
      title: form.foodName,
      category: form.category,
      duration: form.duration,
      servings: form.servings,
      calories: form.calories,
      ingredients,
      steps,
    };

    try {
      const res = await fetch("http://localhost:3001/api/recipes/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage("Recipe added!");
      // Optionally clear form
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div style={{
      background: "#424a6e",
      color: "white",
      padding: "2rem",
      borderRadius: "20px",
      maxWidth: 400,
      margin: "2rem auto",
      fontFamily: "Nunito, sans-serif"
    }}>
      <a href="#" style={{ color: "#ffb7c5" }}>&lt; cancel</a>
      <h2 style={{ textAlign: "center", marginBottom: "1rem", fontWeight: "700", fontSize: "2rem" }}>Savoré</h2>
      <form onSubmit={handleSubmit}>
        <label>food name</label>
        <input name="foodName" value={form.foodName} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

        <label>category</label>
        <select name="category" value={form.category} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>duration</label>
        <input name="duration" value={form.duration} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

        <label>servings</label>
        <input name="servings" value={form.servings} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

        <label>calories</label>
        <input name="calories" value={form.calories} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />

        <label>ingredients</label>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <input
            name="ingredientInput"
            value={form.ingredientInput}
            onChange={handleChange}
            style={{ flex: 1 }}
            placeholder="Type ingredient"
          />
          <button type="button" onClick={addIngredient} style={{ marginLeft: 5, background: "#ffb7c5" }}>+ add</button>
        </div>
        <ul>
          {ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>

        <label>step by step</label>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <input
            name="stepInput"
            value={form.stepInput}
            onChange={handleChange}
            style={{ flex: 1 }}
            placeholder="Type step"
          />
          <button type="button" onClick={addStep} style={{ marginLeft: 5, background: "#ffb7c5" }}>+ add</button>
        </div>
        <ol>
          {steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>

        <button type="submit" style={{ marginTop: 20, background: "#fefeaa", color: "#424a6e", border: "none", padding: "10px 30px", borderRadius: "8px" }}>add recipe</button>
      </form>
      <div style={{ color: "#fffaa0", marginTop: 10 }}>{message}</div>
      <footer style={{ fontSize: 12, color: "#ddd", marginTop: 40, textAlign: "center" }}>
        © 2025 Adeline Agna. All rights reserved.
      </footer>
    </div>
  );
};

export default AddRecipePage;
