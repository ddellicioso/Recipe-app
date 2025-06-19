import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const app        = express();

// Use the port Fly injects (or 8080 locally)
const PORT = process.env.PORT || 8080;

// ─── CSP via Helmet ────────────────────────────────────────────────
const apiOrigin =
  process.env.VITE_API_URL ||
  `https://${process.env.FLY_APP_NAME}.fly.dev`;

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.tailwindcss.com",
        "'unsafe-inline'"
      ],
      styleSrc: [
        "'self'",
        "https://cdn.tailwindcss.com",
        "'unsafe-inline'"
      ],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'", apiOrigin],
      objectSrc: ["'none'"],
      baseUri:   ["'self'"],
      formAction:["'self'"]
    }
  })
);

// ─── CORS (only for your Vite dev server) ──────────────────────────
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);

// ─── JSON + File Uploads ───────────────────────────────────────────
app.use(express.json());
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) =>
      cb(null, path.join(__dirname, 'uploads')),
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  })
});

// ─── API Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── JSON‑only 404 for unmatched /api routes ───────────────────────
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// ─── Global JSON error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

// ─── Serve React Build ─────────────────────────────────────────────
const clientBuildPath = path.join(__dirname, 'public');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  // Only handle non-API routes with SPA fallback
  app.get(/^(?!\/api\/).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// ─── Start the server ──────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Server listening on 0.0.0.0:${PORT}`)
);
