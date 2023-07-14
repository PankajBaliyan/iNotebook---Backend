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
const connectToMongo = require('./db');
const path = require('path');

// Set dotenv
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000; // Update the port value
const mongoURI = process.env.MONGOURI;

// CORS setup
const cors = require('cors');
app.use(cors());

connectToMongo(mongoURI);

app.use(express.json());

// Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Serve static files from the 'dist' directory
// app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static('public'));

// Serve the index.html file for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
