const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthenticated' });
  };
  
  const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.email === process.env.ADMIN_EMAIL_BULK_SENDING) {
      return next();
    }
    return res.status(403).json({ error: 'Forbidden' });
  };
  
module.exports = { ensureAuthenticated, ensureAdmin };
  