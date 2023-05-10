// checkEmailDomainMiddleware.js

module.exports = function checkEmailDomainMiddleware(req, res, next) {
    const { email } = req.body;
    const emailParts = email.split('@');
    
    if (emailParts.length !== 2) {
      res.status(400).json({ error: 'Invalid email address' });
      return;
    }
  
    const allowedDomains = ['gmail.com', 'hotmail.com', 'live.com'];
    if (!allowedDomains.includes(emailParts[1])) {
      res.status(400).json({ error: 'Invalid email domain' });
      return;
    }
    
    // Email domain is valid, move on to the next middleware
    next();
  };
  