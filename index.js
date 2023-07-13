// const express = require('express');
// const connectToMongo = require('./db');

// //set dotenv
// require('dotenv').config();
// const app = express();
// const port = process.env.PORT;
// const mongoURI = process.env.MONGOURI;

// //cors setup
// const cors = require('cors');
// app.use(cors());

// connectToMongo(mongoURI);

// app.use(express.json());

// //Available routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/notes', require('./routes/notes'));

// app.listen(port, () => {
//     console.log(`Server => http://localhost:${port}`);
// });

const express = require('express');
const httpProxy = require('http-proxy');
const connectToMongo = require('./db');

// set dotenv
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGOURI;

// cors setup
const cors = require('cors');
app.use(cors());

connectToMongo(mongoURI);

app.use(express.json());

// Reverse proxy setup
const proxy = httpProxy.createProxyServer();

app.use((req, res, next) => {
    // Conditionally determine the target URL based on the request
    let targetURL = 'https://www.example.com'; // Replace with your frontend URL

    // Update the targetURL based on the request's path
    if (req.path.startsWith('/api')) {
        // If the request starts with '/api', forward it to the backend
        targetURL = `http://localhost:${port}`;
    }

    // Proxy the request to the appropriate target URL
    proxy.web(req, res, { target: targetURL }, (err) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
    });
});

// Proxy error handling
proxy.on('error', (err) => {
    console.error('Proxy error:', err);
});

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
    console.log(`Server => http://localhost:${port}`);
});
