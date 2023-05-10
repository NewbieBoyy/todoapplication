const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todo',
}); 

class Todos {
  static createTodo(userId, message, completed, callback) {
    console.log(userId)
    console.log(message)
    console.log(completed) 
    console.log('we are here ') 
    const insertSql = 'INSERT INTO todo (message, complete, userID) VALUES (?, ?, ?)';
    connection.query(insertSql, [message, completed, userId], (error, results) => {
      if (error) {
        callback(error, null);
        return; 
      } 
  
      const todo = { id: results.insertId, message, complete: completed, userID: userId };
      callback(null, todo); 
    }); 
  }

  static deleteTodo(itemId, callback) {
    // Query the database to delete the todo item
    const query = `DELETE FROM todo WHERE id = ?`;
    connection.query(query, [itemId], (error, result) => {
      if (error) {
        callback(error, null);
        return;
      }  
      callback(null, result);
    });
  }

  static updateTodo(itemId, completed, callback) {
    // Query the database to update the todo item
    const query = `UPDATE todo
                   SET complete = ?
                   WHERE id = ?`;
    connection.query(query, [completed, itemId], (error, result) => {
      if (error) {
        callback(error, null);
        return;
      }  
      // Query the database to fetch the updated todo item
      const selectQuery = `SELECT * FROM todo WHERE id = ?`;
      connection.query(selectQuery, [itemId], (error, selectResult) => {
        if (error) {
          callback(error, null);
          return;
        }
        const updatedTodo = selectResult[0];
        // Query the database to fetch the user id associated with the todo item
        const userQuery = `SELECT userID FROM todo WHERE id = ?`;
        connection.query(userQuery, [itemId], (error, userResult) => {
          if (error) {
            callback(error, null);
            return;
          } 
          const userId = userResult[0].userID;
          // Return the updated todo item and associated user id
          callback(null, {
            code: 200,
            message: "Successfully updated the required todo item.",
            data: {
              userId: userId,
              message: updatedTodo.message,
              completed: updatedTodo.complete,
              date: updatedTodo.date,
              id: updatedTodo.id,
            },
          }); 
        });
      });
    });
}


  static paginateItem(userEmail, page, limit, callback) {
    // Query the database to fetch the user by email
    const userQuery = `SELECT id FROM users WHERE email = ?`;
    connection.query(userQuery, [userEmail], (error, userResult) => {
      if (error) {
        callback(error, null);
        return;
      }
      const userId = userResult[0].id;
      
      // Calculate the offset based on the page and limit
      const offset = (page - 1) * limit;
      
      // Query the database to fetch paginated todo items for the specified user id
      const query = `SELECT *
                     FROM todo
                     WHERE userID = ? 
                     ORDER BY id DESC
                     LIMIT ?
                     OFFSET ?`;
      connection.query(query, [userId, limit, offset], (error, results) => {
        if (error) {
          callback(error, null);
          return;
        }
        // Query the database to count the total number of todo items for the specified user id
        const countQuery = `SELECT COUNT(*) AS total
                             FROM todo
                             WHERE userID = ?`; 
        connection.query(countQuery, [userId], (error, countResult) => {
          if (error) {
            callback(error, null);
            return;
          }
          // Construct the paginated result object
          const result = {
            total: countResult[0].total,
            page: page,
            limit: limit,
            items: results
          };
          callback(null, result);
        }); 
      });
    });
  }
  
  

 
} 

module.exports = Todos;

