const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todo',
});

class Users {
  static signUp(email, password, callback) { 
    // Check if user with given email already exists
    const selectSql = 'SELECT * FROM users WHERE email = ?';
    connection.query(selectSql, [email], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (results.length > 0) {
        // User with given email already exists
        callback('User with given email already exists', null);
        return;
      }

      // Insert new user into the database
      const insertSql = 'INSERT INTO users (email, password) VALUES (?, ?)';
      connection.query(insertSql, [email, password], (error, results) => {
        if (error) {
          callback(error, null);
          return;
        }
        
      
        // User inserted successfully
        const user = { email };
        callback(null, user);
      });
    });
  }

  static findByEmail(email, callback) {
    const selectSql = 'SELECT * FROM users WHERE email = ?';
    connection.query(selectSql, [email], (error, results) => {
      if (error) {
        callback(error, null);
        return;
      }

      if (results.length === 0) {
        callback(null, null);
        return;
      }

      const user = { email: results[0].email, password: results[0].password };
      callback(null, user);
    });
  }  

  static updateAccessToken(email, token, callback) {
    const updateSql = 'UPDATE users SET acccessToken = ? WHERE email = ?';
    connection.query(updateSql, [token, email], (err, result) => {
      if (err) {
        console.error(err);
        callback(err, null);
        return;
      }
      callback(null, result);
    }); 
  }  
  
  static getIdByAccessToken(token, callback) {
    jwt.verify(token, 'my_secret_key', (err, decoded) => {
      if (err) { 
        console.error(err);
        callback(err, null);
        return;
      }
      const userEmail = decoded.email;
      const selectSql = 'SELECT id FROM users WHERE acccessToken = ?';
      connection.query(selectSql, [token], (err, result) => {
        if (err) {
          console.error(err);
          callback(err, null);
          return; 
        }
        if (result.length === 0) {
          console.log(`No user found with access token ${id}`);
          callback(null, null);
          return;
        }
        const id = result[0].id;
        callback(null, id); 
      });
    });
  }

  static VerifyItemId(itemId, userEmail, callback) {
    console.log(userEmail)  
    // Query the database to check if the item ID exists and retrieve the associated user email
    const query = `
      SELECT todo.*, users.email 
      FROM todo 
      JOIN users ON todo.userID = users.id 
      WHERE todo.id = ?;
    `;
    connection.query(query, [itemId], (error, result) => {
      if (error) { 
        callback(error, null);
        return; 
      }
  
      if (result.length === 0) {
        const error = new Error(`Item ID ${itemId} does not exist.`);
        error.status = 404;
        callback(error, null);
        return;
      }
  
      // check if the user email matches the email associated with the item ID
      const item = result[0];
      if (item.email !== userEmail) {
        const error = new Error(`User ${userEmail} is not authorized to delete item ID ${itemId}.`);
        error.status = 401;
        callback(error, null);
        return;
      }  
  
      callback(null, result);
    });
  }
  
  static updateItemId(itemId, userEmail, callback) {
    console.log(userEmail)  
    // Query the database to check if the item ID exists and retrieve the associated user email
    const query = `
      SELECT todo.*, users.email 
      FROM todo 
      JOIN users ON todo.userID = users.id 
      WHERE todo.id = ?;
    `;
    connection.query(query, [itemId], (error, result) => {
      if (error) { 
        callback(error, null);
        return; 
      }
  
      if (result.length === 0) {
        const error = new Error(`Item ID ${itemId} does not exist.`);
        error.status = 404;
        callback(error, null);
        return;
      }
  
      // check if the user email matches the email associated with the item ID
      const item = result[0];
      if (item.email !== userEmail) {
        const error = new Error(`User ${userEmail} is not authorized to delete item ID ${itemId}.`);
        error.status = 401;
        callback(error, null);
        return;
      }  
  
      callback(null, result);
    });
  }
  
  

}  



module.exports = Users;
