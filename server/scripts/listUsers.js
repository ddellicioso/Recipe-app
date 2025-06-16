// server/scripts/listUsers.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname in ESM:
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Open the same DB your app uses:
const db = new sqlite3.Database(path.join(__dirname, '../db/recipes.db'));

// Query and print all users:
db.all(
  'SELECT id, username FROM users',
  [],
  (err, rows) => {
    if (err) {
      console.error('Error reading users:', err.message);
      process.exit(1);
    }
    console.log('Users table:');
    rows.forEach(r => console.log(` • [${r.id}] ${r.username}`));
    process.exit(0);
  }
);
