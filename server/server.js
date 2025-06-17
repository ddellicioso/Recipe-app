import express from 'express';
import cors from 'cors';
import multer from 'multer';             // ← import cors
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app        = express();
const PORT       = process.env.PORT || 3001;

// — Allow CORS from your Vite dev origin
app.use(cors({
  origin: 'http://localhost:5173',  // React/Vite dev server
  credentials: true,             // only if you use cookies
}));

app.use(express.json());

// Auth and recipe routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Serve static React build in prod
const distPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
