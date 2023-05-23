const express = require('express');
const router = require('./routes/paths');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.use(router);

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});
