const axios = require('axios');
const fs = require('fs');
const path = require('path');

const USERS_API_URL = 'https://reqres.in/api/users';
const DB_FILE_PATH = path.join(__dirname, 'db.json');

async function fetchUsers(page = 1) {
  try {
    const response = await axios.get(USERS_API_URL, {
      params: { page }
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching users from API: ${error}`);
    return [];
  }
}

async function populateDatabase() {
  let allUsers = [];
  for (let page = 1; page <= 2; page++) {
    const users = await fetchUsers(page);
    allUsers = allUsers.concat(users);
  }

  const db = {
    users: {
      page: 1,
      per_page: 6,
      total: allUsers.length,
      total_pages: Math.ceil(allUsers.length / 6),
      data: allUsers
    }
  };
  
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2));
  console.log('Database populated successfully!');
}

populateDatabase();
