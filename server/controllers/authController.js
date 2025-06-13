import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/database.js';
import dotenv from 'dotenv';

dotenv.config();

function registerUser(req, res) {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

  db.run(sql, [username, hashedPassword], function (err) {
    if (err) {
      return res.status(400).json({ message: "Username already exists" });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
}

function loginUser(req, res) {
  const { username, password } = req.body;

  const sql = `SELECT * FROM users WHERE username = ?`;
  db.get(sql, [username], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: "Login successful", token });
  });
}

export { registerUser, loginUser };
