import express from 'express';
import { addRecipe } from '../controllers/recipeController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', authenticateToken, addRecipe);

export default router;
