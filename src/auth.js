const jwt = require('jsonwebtoken');

const jwtkey = 'Lw8RKTPutNEPpy1mWrJx';

const auth = async (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
      return res.status(401).json({
         error: 'true',
         message: 'anda tidak punya izin',
      });
   }

   const token = authHeader;
   try {
      const decode = jwt.verify(token, jwtkey);
      const { id, email } = decode;
      req.user = { id, email };

      next();
   } catch (error) {
      return res.status(401).json({ error: 'true', message: 'anda tidak memiliki akses' });
   }
};

module.exports = auth;
