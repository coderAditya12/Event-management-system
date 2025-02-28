import jwt from 'jsonwebtoken'
import errorHandler from './error.js';

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("token", token);
  if (!token) {
    return next(errorHandler(res,401, "unauthorized"));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(res,401, "unauthorized"));
    }
    req.user = user;
    console.log("user", req.user);
    next();
  });
};

export default verifyToken;
