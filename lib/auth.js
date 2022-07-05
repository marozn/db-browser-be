import jwt from 'jsonwebtoken';

function auth(req, res, next) {
    const token = req.headers.authorization.replace('Bearer ', '');
    jwt.verify(token, "superbigsecretasdfasdfasdfasf", (err, decoded) => {
        if (err) {
            res.status(401).send({ message: 'Must authenticate' });
            return;
        }
        req.decoded = decoded;
        next();
    });
  }

  export default auth;