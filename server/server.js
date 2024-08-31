const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // replace with your MySQL password
  database: 'mydatabase', // replace with your MySQL database name
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Register endpoint ::
// Request , Response ::
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  //  const sqlCheck = `
  //   SELECT 'email' AS type FROM users WHERE email = ?
  //   UNION
  //   SELECT 'name' AS type FROM users WHERE name = ?
  // `;
  const sqlCheck = 'SELECT * FROM users WHERE email = ?';
  const sqlInsert = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  db.query(sqlCheck, [email], (err, result) => {
    // Database Check :
    if (err) {
      res.status(500).send('Database error');
      return;
    }

    // Check for existing email or name
    // const existingEmail = result.some(row => row.type === 'email');
    // const existingName = result.some(row => row.type === 'name');

    // Email Validation :
    if (result.length > 0) {
      // If result.length > 0: 
      // This means that the query found at least one row where the email matches. 
      res.status(400).send('Email already exists');
    }

    // Inserting User Details :
    else {
      db.query(sqlInsert, [name, email, password], (err, result) => {
        if (err) {
          res.status(500).send('Error inserting user');
          return;
        }
        res.send('User registered successfully');
      });
    }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, result) => {
    // Error during the execution of the SQL query
    if (err) {
      res.status(500).send('Error fetching user');
      return;
    }

    // Fetched Succes :
    if (result.length > 0) {
      //  If result.length > 0, 
      // it means a user with the provided email and password exists in the database.
      res.send({ message: 'Login successful' });
    }
    // Email Or Password MisMatch
    else {
      res.status(401).send({ message: 'Invalid Email or Password' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
