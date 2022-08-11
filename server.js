const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.end(req.url + 'message from backend');
});

app.listen(3001);
