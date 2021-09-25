const express = require('express');
const router = express.Router();

const { ping, getPosts } = require('../controllers/blogPosts');

router.route('/ping').get(ping);
router.route('/posts').get(getPosts);


module.exports = router;