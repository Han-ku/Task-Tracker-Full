import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'todo'
});

const secretKey = process.env.SECRET_KEY_JWT;

// Middleware для проверки токена
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json('Access Denied');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(403).json('Invalid Token');
        req.user = decoded;
        next();
    });
};

// Регистрация пользователя
app.post('/register', (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) return res.status(400).json('Please provide all required fields');

    bcrypt.hash(password.toString(), 5, (err, hash) => {
        if (err) return res.status(500).json('Error hashing password');

        const sql = 'INSERT INTO user_demographics (`fullName`, `email`, `user_password`) VALUES (?)';
        const values = [fullName, email, hash];
        db.query(sql, [values], (err) => {
            if (err) return res.status(500).json('Error inserting into database');
            res.status(201).json('User registered successfully');
        });
    });
});

// Вход пользователя
app.post('/', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM user_demographics WHERE `email` = ?';
    
    db.query(sql, [email], (err, result) => {
        if (err) return res.json({ Error: 'Error' });
        if (result.length === 0) return res.json({ Error: 'Email not existing' });

        bcrypt.compare(password.toString(), result[0].user_password, (err, response) => {
            if (err || !response) return res.json({ Error: 'Wrong password' });
            const token = jwt.sign({ email: result[0].email, user_id: result[0].user_id }, secretKey, { expiresIn: '1h' });
            res.json({ Status: 'Success', token });
        });
    });
});

// Получение задач
app.get('/home', verifyToken, (req, res) => {
    const sql = 'SELECT * FROM user_todo WHERE user_id = ?';
    
    db.query(sql, [req.user.user_id], (err, data) => {
        if (err) return res.status(500).json({ Error: 'Error fetching todos' });
        res.json({ todos: data });
    });
});

// Создание задачи
app.post('/home', verifyToken, (req, res) => {
    const { description_todo, created_at } = req.body;
    if (!description_todo || !created_at) return res.status(400).json({ message: 'Invalid data provided' });

    const sql = 'INSERT INTO user_todo (user_id, description_todo, completed, history, created_at) VALUES (?, ?, ?, ?, ?)';
    const history = JSON.stringify([{ action: 'Created', date: created_at || new Date().toISOString() }]);
    
    db.query(sql, [req.user.user_id, description_todo, false, history, created_at], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating todo' });
        res.status(201).json({ message: 'Todo created successfully', todo_id: result.insertId });
    });
});


// Обновление задачи
app.put('/home/:todo_id', verifyToken, (req, res) => {
    const { todo_id } = req.params;
    const { description_todo, completed, history } = req.body;
  
    if (!description_todo) return res.status(400).json({ message: 'Invalid data provided' });
    
    const sqlUpdate = `
      UPDATE user_todo
      SET description_todo = ?, completed = ?, history = ?
      WHERE todo_id = ? AND user_id = ?
    `;
  
    const historyJson = JSON.stringify(history);

    db.query(sqlUpdate, [description_todo, completed, historyJson, todo_id, req.user.user_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating todo' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Todo not found' });
    //   res.status(200).json({ message: 'Todo updated successfully' });
      const updatedTodo = { todo_id, description_todo, completed, history };
      res.status(200).json({ updatedTodo });
    });
});
  
  

// Удаление задачи
app.delete('/home/:todo_id', verifyToken, (req, res) => {
    const sql = 'DELETE FROM user_todo WHERE todo_id = ? AND user_id = ?';
    db.query(sql, [req.params.todo_id, req.user.user_id], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(500).json({ message: 'Error deleting todo' });
        res.status(200).json({ message: 'Todo deleted successfully' });
    });
});

app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
