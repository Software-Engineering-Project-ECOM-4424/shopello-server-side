const { verifyToken } = require('../utils/jwt');

const {
  env: { SECRET_KEY },
} = process;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.Authorization;
    if (token) {
      const value = await verifyToken(token, SECRET_KEY);
      req.body.userId = value.userId;
      next();
    } else {
      res.status(401).json({ message: 'invalid' });
    }
  } catch (err) {
    res.status(401).json({ message: 'invalid' });
  }
};