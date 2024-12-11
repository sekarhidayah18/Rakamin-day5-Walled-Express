const express = require('express')
const bodyParser = require('body-parser')
const Joi = require('joi')
const app = express()
const port = 8080

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'walled_db',
    password: 'jogJakarta18',
    port: 5432,
})

const getUsers = (req, res) => {
    pool.query("SELECT * FROM users", (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

// arrow function
const schema = Joi.object({
    a: Joi.string(),
});

const registerSchema = Joi.object({
    user_email: Joi.string().email(),
    username: Joi.string(),
    user_fullname: Joi.string(),
    user_password: Joi.string(),
    balance: Joi.number()
});

app.get('/users', getUsers);

const createUsers = (req, res) => {
    const { username, user_email, user_password, user_fullname, balance } = req.body;
    const { error, value } = registerSchema.validate(req.body)
    if (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
    pool.query("INSERT into users (username, user_email, user_password, user_fullname, balance) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [username, user_email, user_password, user_fullname, balance],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(201).json(results.rows[0]);
        });
};

app.post('/users', createUsers)
app.listen(port, () => {
    console.log("Running")
})

