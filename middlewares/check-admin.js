const { verifyToken } = require('../utils/jwt');
const dbContext = require('../database/connection')

module.exports = async (req, res, next) => {

  try {
    const token = req.headers.Authorization;
    if (token) {
      const value = await verifyToken(token, SECRET_KEY);
      const { rows } = await dbContext.query('SELECT * FROM users WHERE id = $1', [value.userId]);
      if (rows[0].role !== "Admin") {
        res.status(401).json({ message: 'invalid' });
      }
      req.body.userId = value.userId;
      next();
    } else {
      res.status(401).json({ message: 'invalid' });
    }
  } catch (err) {
    res.status(401).json({ message: 'invalid' });
  }
};