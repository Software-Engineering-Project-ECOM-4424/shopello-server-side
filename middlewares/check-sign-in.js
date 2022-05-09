const { verifyToken } = require('../utils/jwt');

const {
  env: { SECRET_KEY },
} = process;

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const value = await verifyToken(token, SECRET_KEY);
      req.body.userId = value;
      next();
    } else {
      return res.status(401).json({ message: 'invalid' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'invalid' });
  }
};