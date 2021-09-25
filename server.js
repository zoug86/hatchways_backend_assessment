const express = require('express');
const app = express();
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

// load env variables
dotenv.config({ path: '/config/config.env' })

// Body parser
app.use(express.json());

// logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Route files
const blogPosts = require('./routes/blogPosts');

// Mount router
app.use('/api', blogPosts);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server sunning in ${process.env.NODE_ENV} mode on port ${PORT}`.green.underline.bold));

// Handle unhadled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.underline.bold);
    // Close server & exit process
    server.close(() => process.exit(1));
})