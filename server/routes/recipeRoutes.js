import express from 'express';
import {
  addRecipe,
  listRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create
router.post('/add', authenticateToken, addRecipe);

// Read All
router.get('/', authenticateToken, listRecipes);

// Read One
router.get('/:id', authenticateToken, getRecipe);

// Update
router.put('/:id', authenticateToken, updateRecipe);

// Delete
router.delete('/:id', authenticateToken, deleteRecipe);

export default router;
