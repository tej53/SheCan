const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const dataPath = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Get all users
app.get('/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  res.json(users);
});

// Register new user (Signup)
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  if (users.find(u => u.name === name)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = {
    name,
    email,
    password, // In real apps, hash this!
    referalCode: name + '2025',
    totalDonations: Math.floor(Math.random() * 10001) + 10000,
    rewards: ['T-shirt', 'Certificate']
  };

  users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  res.status(201).json({ message: 'User registered successfully' });
});

// Login (verify password)
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const users = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const user = users.find(u => u.name === name);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  res.status(200).json({ message: 'Login successful' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
