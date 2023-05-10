// validatePasswordMiddleware.js

module.exports = function validatePasswordMiddleware(req, res, next) {
    const { password } = req.body;
  
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long' });
      return;
    } 
  
    if (!/[A-Z]/.test(password)) {
      res.status(400).json({ error: 'Password must contain at least one capital letter' });
      return;
    }
  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      res.status(400).json({ error: 'Password must contain at least one symbol' });
      return;
    }
  
    if (!/[0-9]/.test(password)) {
      res.status(400).json({ error: 'Password must contain at least one number' });
      return;
    }
  
    // Password is valid, move on to the next middleware
    next();
  };
  