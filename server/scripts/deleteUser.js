// server/scripts/deleteUser.js
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// — Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// — Open the same DB your app uses
const db = new sqlite3.Database(path.join(__dirname, '../db/recipes.db'));

// — Read the username from the command line
const username = process.argv[2];
if (!username) {
  console.error('Usage: node deleteUser.js <username>');
  process.exit(1);
}

// — Delete the user
db.run(
  'DELETE FROM users WHERE username = ?',
  [username],
  function (err) {
    if (err) {
      console.error('Error deleting user:', err.message);
      process.exit(1);
    }
    console.log(`Deleted ${this.changes} user(s) with username="${username}".`);
    process.exit(0);
  }
);
