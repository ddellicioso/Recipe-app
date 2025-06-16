import db from '../db/database.js';

export const addRecipe = (req, res) => {
  const { title, ingredients, instructions } = req.body;
  const userId = req.user.id; // will be added by auth middleware

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const sql = `INSERT INTO recipes (title, ingredients, instructions, user_id) VALUES (?, ?, ?, ?)`;

  db.run(sql, [title, ingredients, instructions, userId], function (err) {
    if (err) {
        console.error('Add recipe error:', err); // <--- Add this line
        return res.status(500).json({ message: 'Failed to add recipe.' });
    }
    res.status(201).json({ message: 'Recipe added successfully', recipeId: this.lastID });
});

};
