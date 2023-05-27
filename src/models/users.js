const dbPool = require('../database');

const getAllUsers = () => {
   const sqlQuery = 'SELECT * FROM users';
   return dbPool.execute(sqlQuery);
};

module.exports = {
   getAllUsers,
};
