const express = require('express');
const connectToMongo = require('./db');
const path = require('path');

//set dotenv
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGOURI;

//cors setup
const cors = require('cors');
app.use(cors());

connectToMongo(mongoURI);

app.use(express.json());

//Define all catch routes
app.use(express.static(__dirname));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

//Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`Server => http://localhost:${port}`);
});
