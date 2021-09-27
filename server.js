const express = require('express');
const app = express();
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const cache = require('apicache').middleware;

// load env variables
dotenv.config({ path: './config/config.env' })

// Body parser
app.use(express.json());

// Route files
const blogPosts = require('./routes/blogPosts');

// logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount router  and cache all routes(since we don't have many!)
const onlyStatus200 = (req, res) => res.statusCode === 200; // cache the successful responses only!
const cacheSuccesses = cache('60 minutes', onlyStatus200); // cache available for one hour!

app.use('/api', cacheSuccesses, blogPosts);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server sunning in ${process.env.NODE_ENV} mode on port ${PORT}`.green.underline.bold));

// Handle unhadled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.underline.bold);
    // Close server & exit process
    server.close(() => process.exit(1));
})

module.exports = server; // for testing
