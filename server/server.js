import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const distPath = path.resolve(__dirname, '../client/dist');

console.log('Serving from:', distPath);

app.use(express.static(distPath));
console.log('distPath exists:', distPath);
console.log('index.html exists:', fs.existsSync(path.join(distPath, 'index.html')));

app.get('*', (req, res) => {
  console.log('Trying to send:', path.join(distPath, 'index.html'));
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
