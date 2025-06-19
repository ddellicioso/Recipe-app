import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
  console.log('🛎 Hit /api/auth/register');
  return registerUser(req, res, next);
});
router.post('/login', loginUser);


export default router;
