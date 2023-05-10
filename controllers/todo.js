const bcrypt = require('bcrypt');
const Users = require('../models/User'); 
const Todos = require('../models/Todos'); 
const jwt = require('jsonwebtoken');



exports.create = async (req, res, next) => {
    console.log('create');
    const { message } = req.body;
    const { completed } = req.body;
    console.log(message) 
    console.log(completed)  
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'my_secret_key');
    const userEmail = decodedToken.email;
  
    // check if the token is a login access token
    const isLoginToken = decodedToken.hasOwnProperty('iat') && decodedToken.hasOwnProperty('exp');
    if (!isLoginToken) {
      return res.status(401).json({ error: 'Unauthorized access' });
    } 
    Users.getIdByAccessToken(token, (error, id) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
        return; 
      }
      console.log(`Id associated with access token ${token}: ${id}`);      
      const userId = id;
      Todos.createTodo(userId, message, completed, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        console.log(`Todo created with ID: ${result.insertId}`);
        res.status(201).json({
          code: 200,
          message: 'Successfully created the required todo item.',
          data: {
            userID: userId,
            message: message,
            complete: completed,
            date: new Date().getTime(),
            id: result.id
          }
        });
      });
    });
  }
    
   
  exports.delete = (req, res) => {
    const itemId = req.params.itemId;
    console.log('delete'); 
    const token = req.headers.authorization.split(' ')[1];
  
    try { 
      const decodedToken = jwt.verify(token, 'my_secret_key');
      const userEmail = decodedToken.email;
      console.log(userEmail) 
      // check if the token is a login access token
      const isLoginToken = decodedToken.hasOwnProperty('iat') && decodedToken.hasOwnProperty('exp');
      if (!isLoginToken) {
        return res.status(401).json({ error: 'Unauthorized access' });
      } 
      Users.VerifyItemId(itemId, userEmail, (error, result) => {
        if (error) {
          console.error(error);
          res.status(error.status || 500).json({ error: error.message });
          return;
        } 
      Todos.deleteTodo(itemId, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
      }) 
        console.log(`Todo item deleted with ID: ${itemId}`);
        res.status(200).json({
          code: 200,
          message: `Successfully deleted the required todo item with ID ${itemId} `,
        }); 
      }); 
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid access token' });
    }
  }; 

  exports.update = (req, res) => {
    const { completed } = req.body;
    const itemId = req.params.itemId;
    console.log(itemId);
    console.log(completed); 
    const token = req.headers.authorization.split(' ')[1];
  
    try { 
      const decodedToken = jwt.verify(token, 'my_secret_key');
      const userEmail = decodedToken.email;
      console.log(userEmail) 
      // check if the token is a login access token
      const isLoginToken = decodedToken.hasOwnProperty('iat') && decodedToken.hasOwnProperty('exp');
      if (!isLoginToken) {
        return res.status(401).json({ error: 'Unauthorized access' });
      } 
      Users.updateItemId(itemId, userEmail, (error, result) => {
        if (error) {
          console.error(error);
          res.status(error.status || 500).json({ error: error.message });
          return;
        } 
      console.log('elie') 
      Todos.updateTodo(itemId,completed, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        const userId = result.data.userId;
        const message = result.data.message;
        res.status(200).json({
          code: 200,
          message: `Successfully Updated the required todo item with ID ${itemId} `,
          data: {
            userId: userId,
            message: message,
            completed: completed,
            date: result.data.date,
            id: result.data.id
          }
        }); 
      }) 
      }); 
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid access token' });
    }
  }; 

  exports.paginate = (req, res) => {
    const page = parseInt(req.query.page) || 1; // default page to 1 if not set
    const limit = parseInt(req.query.limit) || 10; // default limit to 10 if not set
    console.log('test') 
    console.log(page);
    console.log(limit); 
    const token = req.headers.authorization.split(' ')[1];
  
    try { 
      const decodedToken = jwt.verify(token, 'my_secret_key');
      const userEmail = decodedToken.email;
      console.log(userEmail) 
      // check if the token is a login access token
      const isLoginToken = decodedToken.hasOwnProperty('iat') && decodedToken.hasOwnProperty('exp');
      if (!isLoginToken) {
        return res.status(401).json({ error: 'Unauthorized access' });
      } 
      console.log('elie') 
      Todos.paginateItem(userEmail, page, limit, (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
      
        const response = {
          code: 200,
          message: 'Found the requested todos from the selected page',
          data: {
            page: result.page,
            limit: result.limit,
            totalPages: Math.ceil(result.total / result.limit),
            todos: result.items.map((todo) => ({
              userId: todo.userId,
              message: todo.message,
              completed: todo.completed,
              date: todo.date,
              id: todo.id,
            })), 
          },
        };
        res.status(200).json(response);
      });      
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Invalid access token' });
    }
  }; 
   
  
exports.create = [exports.create]; 
exports.delete = [exports.delete];  