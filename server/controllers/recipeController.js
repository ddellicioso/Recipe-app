// server/controllers/recipeController.js
import db from '../db/database.js';

// NEW: insert every field
function addRecipe(req, res) {
  const {
    title,
    category,
    duration,
    servings,
    calories,
    ingredients,
    instructions
  } = req.body;
  const userId = req.user.id;

  // (optional) validate that all required fields are present …

  const sql = `
    INSERT INTO recipes 
      (title, category, duration, servings, calories, ingredients, instructions, user_id)
    VALUES (?,      ?,        ?,        ?,        ?,        ?,           ?,            ?)
  `;
  db.run(
    sql,
    [
      title,
      category,
      duration,
      servings,
      calories,
      ingredients,
      instructions,
      userId
    ],
    function (err) {
      if (err) {
        console.error('Add recipe error:', err);
        return res.status(500).json({ message: 'Failed to add recipe.' });
      }
      res.status(201).json({
        message: 'Recipe added successfully',
        recipeId: this.lastID
      });
    }
  );
}


// Read all
function listRecipes(req, res) {
  console.log('🔍 listRecipes called for user:', req.user.id);
  const userId = req.user.id;
  const sql = `
    SELECT id, title, category, duration, servings, calories, ingredients, instructions
    FROM recipes WHERE user_id = ?
  `;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('List recipes error:', err);
      return res.status(500).json({ message: 'Failed to fetch recipes.' });
    }
    res.json(rows);
  });
}

// Read one
function getRecipe(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const sql = `
    SELECT id, title, category, duration, servings, calories, ingredients, instructions
    FROM recipes WHERE id = ? AND user_id = ?
  `;
  db.get(sql, [id, userId], (err, row) => {
    if (err) {
      console.error('Get recipe error:', err);
      return res.status(500).json({ message: 'Failed to fetch recipe.' });
    }
    if (!row) return res.status(404).json({ message: 'Recipe not found.' });
    res.json(row);
  });
}

// Update
function updateRecipe(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, category, duration, servings, calories, ingredients, instructions } = req.body;

  const sql = `
    UPDATE recipes
    SET title = ?, category = ?, duration = ?, servings = ?, calories = ?, ingredients = ?, instructions = ?
    WHERE id = ? AND user_id = ?
  `;
  db.run(sql, [title, category, duration, servings, calories, ingredients, instructions, id, userId], function (err) {
    if (err) {
      console.error('Update recipe error:', err);
      return res.status(500).json({ message: 'Failed to update recipe.' });
    }
    if (this.changes === 0) return res.status(404).json({ message: 'Recipe not found or not yours.' });
    res.json({ message: 'Recipe updated.' });
  });
}

// Delete
function deleteRecipe(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const sql = `DELETE FROM recipes WHERE id = ? AND user_id = ?`;
  db.run(sql, [id, userId], function (err) {
    if (err) {
      console.error('Delete recipe error:', err);
      return res.status(500).json({ message: 'Failed to delete recipe.' });
    }
    if (this.changes === 0) return res.status(404).json({ message: 'Recipe not found or not yours.' });
    res.json({ message: 'Recipe deleted.' });
  });
}

export { addRecipe, listRecipes, getRecipe, updateRecipe, deleteRecipe };
