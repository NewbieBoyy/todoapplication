const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todo',   
});  

connection.connect((error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log('Connected to MySQL database.');

  // Create users table with email and password columns
  const createUsersTableSql = `
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    acccessToken VARCHAR(255)  NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;  
 
  // Create todo table with required columns
  const createTodoTableSql = `
    CREATE TABLE IF NOT EXISTS todo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,   
    message VARCHAR(255) NOT NULL,
    complete BOOLEAN DEFAULT false,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(id)
    )`; 

  connection.query(createUsersTableSql, (error, results) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log('Created users table.');
    connection.query(createTodoTableSql, (error, results) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('Created todo table.');
      connection.end();
    });
  });
});
