const mongoose = require('mongoose');

// Connect to MongoDB
const connectToMongo = (mongoURI) => {
    mongoose
        .connect(mongoURI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(() => {
            console.log('Not Connected to MongoDB');
        });
};

module.exports = connectToMongo;
