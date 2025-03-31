import jwt from "jsonwebtoken";
import errorHandler from "./error.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  

  if (!token) {
    // Just call the error handler and RETURN - don't call next()
    return errorHandler(res, 401, "Unauthorized, no token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
     
      // Just call the error handler and RETURN - don't call next()
      return errorHandler(res, 401, "Unauthorized, invalid token");
    }
    req.user = user;
    
    next();
  });
};

export default verifyToken;
