const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    console.log('Auth middleware called');
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Received token:', token);

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });
    console.log('Found user:', user);

    if (!user) {
      console.log('User not found for token');
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};



module.exports = auth;
