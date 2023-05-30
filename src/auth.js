const jwt = require('jsonwebtoken');

const jwtkey = 'Lw8RKTPutNEPpy1mWrJx';

const auth = async (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
      return res.status(400).json({
         message: "you don't have permission ",
         status: 'error',
      });
   }

   const token = authHeader;
   try {
      const decode = jwt.verify(token, jwtkey);
      const { id, email } = decode;
      req.user = { id, email };

      next();
   } catch (error) {
      return res
         .status(401)
         .json({ message: 'token is not valid', status: 'error' });
   }
};

module.exports = auth;
