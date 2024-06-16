const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const USERS_API_URL = 'https://reqres.in/api/users';
const DB_FILE_PATH = path.join(__dirname, 'db.json');
const IMAGE_API_URL = 'https://randomuser.me/api/portraits/men';

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf-8'));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
}

app.get('/users', (req, res) => {
  const { page = 1, per_page = 6 } = req.query;
  const db = readDb();

  const pageNumber = parseInt(page, 10);
  const perPageNumber = parseInt(per_page, 10);
  const startIndex = (pageNumber - 1) * perPageNumber;
  const endIndex = startIndex + perPageNumber;

  const paginatedData = {
    page: pageNumber,
    per_page: perPageNumber,
    total: db.users.data.length,
    total_pages: Math.ceil(db.users.data.length / perPageNumber),
    data: db.users.data.slice(startIndex, endIndex)
  };

  res.json(paginatedData);
});

app.post('/users', async (req, res) => {
  try {
    const newUser = req.body;
    const response = await axios.post(USERS_API_URL, newUser);

    if (response.status === 201 || response.status === 200) {
      const db = readDb();
      const id = db.users.data.length ? db.users.data[db.users.data.length - 1].id + 1 : 1;
      const avatar = `${IMAGE_API_URL}/${id}.jpg`;
      const createdAt = new Date().toISOString();
      const userWithId = { ...response.data, id, avatar, createdAt };
      db.users.data.push(userWithId);
      db.users.total = db.users.data.length;
      db.users.total_pages = Math.ceil(db.users.data.length / db.users.per_page);
      writeDb(db);
      res.status(201).json(userWithId);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    res.status(500).send('Failed to create user');
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.delete(`${USERS_API_URL}/${id}`);

    if (response.status === 204) {
      const db = readDb();
      db.users.data = db.users.data.filter(user => user.id !== parseInt(id));
      db.users.total = db.users.data.length;
      db.users.total_pages = Math.ceil(db.users.data.length / db.users.per_page);
      writeDb(db);
      res.sendStatus(204);
    } else {
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    console.error(`Error deleting user: ${error}`);
    res.status(500).send('Failed to delete user');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
