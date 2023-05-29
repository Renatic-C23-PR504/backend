const jwt = require('jsonwebtoken');

const jwtkey = 'Lw8RKTPutNEPpy1mWrJx';

const auth = async (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
      return res.status(400).json({
         message: "uppsss sorry you don't have permission ",
         status: 'error',
      });
   }

   const token = authHeader;
   console.log(token);
   try {
      const decode = jwt.verify(token, jwtkey);
      const { id, email } = decode;
      req.user = { id, email };

      console.log(decode);
      next();
   } catch (error) {
      return res
         .status(401)
         .json({ message: 'Token tidak valid', status: 'error' });
   }
};

module.exports = auth;
