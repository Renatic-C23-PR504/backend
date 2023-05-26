require('dotenv').config()
const port = process.env.PORT || 9000;
const express = require('express');
const usersRoutes = require('./routes/users');
const middlewareLogRequest = require('./middleware/logs');


const app = express();

// app.method(path.handler);
// app.use('/', (req, res, next) => {
//     res.json({
//         email: "babaw@gmail.com",
//         password: "babawaja"
//     });
// });

app.use(middlewareLogRequest);
app.use(express.json());
app.use('/users', usersRoutes);


app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
