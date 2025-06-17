import express from 'express';
import {
  addRecipe,
  listRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Create
router.post('/add', authenticateToken, upload.single('image'), addRecipe);

// Read All
router.get('/', authenticateToken, upload.single('image'), listRecipes);

// Read One
router.get('/:id', authenticateToken, upload.single('image'), getRecipe);

// Update
router.put('/:id', authenticateToken, upload.single('image'), updateRecipe);

// Delete
router.delete('/:id', authenticateToken, upload.single('image'), deleteRecipe);

export default router;
