const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express;
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydatabase2'
})



db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed " + err.stack);
        return
    }
    console.log('Database Connected');
})


app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const sqlCheck = 'SELECT * from users WHERE email = ? ';
    const sqlInsert = 'INSERT into users (name,email,password) VALUES (?,?,?)';

    db.query(sqlCheck, [email], (err, result) => {
        if (err) {
            res.status(500).send("Database Error");
            return
        }

        if (result.length > 0) {
            res.status(400).send('Already Exists');
        }
        else {
            db.query(sqlInsert, [name, email, password], (err, result) => {
                if (err) {
                    res.status(500).send('Error Inserting');
                    return
                }
                res.send("User Successfully registered");
            })
        }
    })
});


// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, result) => {

        if (err) {
            res.status(500).send('Error fetching user');
            return;
        }


        if (result.length > 0) {
            res.send({ message: 'Login successful' });
        }

        else {
            res.status(401).send({ message: 'Invalid email or password' });
        }
    });
});








app.listen(port, () => {
    console.log(`Server Running in ${port}`);
})