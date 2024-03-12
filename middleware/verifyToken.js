const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // console.log('verifying token');
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    // Verify token if defined
    jwt.verify(req.token, process.env.secret_key, (err, authData) => {
      if (err) {
        return res.status(403);
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    // Forbidden if token is undefined
    res.sendStatus(403);
  }
}

module.exports = verifyToken;
