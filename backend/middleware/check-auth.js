const jwt = require("jsonwebtoken");
const { secret} = require('../config.json');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; 
    const decodedToken = jwt.verify(token, secret); 
    req.userData = {email:decodedToken.email, userId:decodedToken.userId, name:decodedToken.name, role:decodedToken.role};   
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed! Try again" }); 
  }
};
