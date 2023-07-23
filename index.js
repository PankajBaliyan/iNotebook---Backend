const express = require('express');
const connectToMongo = require('./db');
const path = require('path');

// Set dotenv
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000; // Use the appropriate port for your backend
const mongoURI = process.env.MONGOURI;

// CORS setup
const cors = require('cors');
app.use(cors());

connectToMongo(mongoURI);

app.use(express.json());

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Serve the React app's build files
app.use(express.static(path.join(__dirname, 'https://inotebook-0ybd.onrender.com')));

// Wildcard route to serve the React app's index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'https://inotebook-0ybd.onrender.com', 'index.html'),
    );
});

app.listen(port, () => {
    console.log(`Server => http://localhost:${port}`);
});
