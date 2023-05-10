const bcrypt = require('bcrypt');
const Users = require('../models/User'); 
const jwt = require('jsonwebtoken');
const checkEmailDomainMiddleware = require('../middleware/checkEmailDomain');
const validatePasswordMiddleware = require('../middleware/validatePassword');
const bodyParser = require('body-parser');
 
function generateToken(payload) {
  const secretKey = 'my_secret_key';
  const options = { expiresIn: '1h' }; // token expires in 1 hour
  return jwt.sign(payload, secretKey, options);
}

exports.signUp = async (req, res, next) => {
  const { email, password } = req.body;
  let responseSent = false;  

  try {
    // hash the password 
    const hashedPassword = await bcrypt.hash(password, 10); 

    // save the user to the database
    Users.signUp(email, hashedPassword, (error, message) => {
      if (error) {
        console.error(error);
        if (!res.headersSent && !responseSent) {
          res.status(500).json({ error: 'Email Already In use' });
          responseSent = true; 
        }
        return;
      } 

      // Generate JWT token
      // const token = generateToken({ email });
      // console.log(token) 

      console.log('User created successfully');
      if (!res.headersSent && !responseSent) {
        res.status(200).json({ message: 'User created successfully' });  
        responseSent = true;  
      }
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent && !responseSent) {
      res.status(500).json({ error: 'Internal server error' });
      responseSent = true;
    }
  }
}; 

exports.login = async (req, res, next) => {
  console.log('login');
  const { email, password } = req.body;
  let responseSent = false;

  try {
    // find the user in the database
    Users.findByEmail(email, async (error, user) => {
      if (error) {
        console.error(error);
        if (!res.headersSent && !responseSent) {
          res.status(500).json({ error: 'Internal server error' });
          responseSent = true;
        }
        return;
      }

      // check if user exists
      if (!user) {
        console.log(`User with email ${email} not found`);
        if (!res.headersSent && !responseSent) {
          res.status(401).json({ error: 'Wrong Email' });
          responseSent = true;
        }
        return;
      }

      // compare passwords
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        console.log('Incorrect password');
        if (!res.headersSent && !responseSent) {
          res.status(401).json({ error: 'Wrong Password' });
          responseSent = true;
        }
        return; 
      }

      // generate JWT token
      const token = generateToken({ email }); 
      console.log(token);

    // update user's access token
    Users.updateAccessToken(email, token, async (error, result) => {
      if (error) {
      console.error(error);
      if (!res.headersSent && !responseSent) {
        res.status(500).json({ error: 'Internal server error' });
        responseSent = true;
      }
    return;
  }
  console.log(`Updated access token for user ${email}`);
  }); 
   

      console.log('User authenticated successfully');
      if (!res.headersSent && !responseSent) {
        res.status(200).json({ message: 'User authenticated successfully', token });
        responseSent = true;
      } 
    });
  } catch (error) {
    console.error(error);
    if (!res.headersSent && !responseSent) {
      res.status(500).json({ error: 'Internal server error' });
      responseSent = true;
    }
  }
};


// Apply the middleware to the signUp function
exports.signUp = [checkEmailDomainMiddleware, validatePasswordMiddleware, exports.signUp];
exports.login = [exports.login]; 
