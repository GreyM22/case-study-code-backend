const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    console.log('Token verification!')
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'key');
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      department: decodedToken.department
    };
    next();
  } catch(error){
    res.status(401).json({ message: 'You are not authenticated!'});
  }
}
