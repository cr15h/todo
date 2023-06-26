const mysql = require('mysql2');
const db = mysql.createConnection({
    host: "localhost",
    user: "user_db",
    password: "user_db",
    database: "todoapp"
    // rowsAsArray: true
});

const createdb = `
  CREATE TABLE IF NOT EXISTS todo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskTitle VARCHAR(255) NOT NULL,
    taskDescription TEXT
  )
`;

db.query(createdb, (err) => {
    if (err) {
        console.error('Failed to create the todos table:', err);
    } else {
        console.log('Todos table created successfully');
    }
});

module.exports = db;