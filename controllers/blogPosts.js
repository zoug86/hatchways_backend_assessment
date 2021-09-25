const asyncHandler = require('../middleware/asyncHandler');
const axios = require('axios');

// @desc    Ping URL
// @route   GET  /api/ping
// @access  Public

exports.ping = asyncHandler(async (req, res, next) => {
    res.status(200).json({ sucess: true });
})

// @desc    Get Blog Posts
// @route   GET  /api/posts
// @access  Public

exports.getPosts = asyncHandler(async (req, res, next) => {

    let { tags, sortBy, direction } = { ...req.query };
    tags = tags.split(',')

    //load all Posts (including duplicates)
    let tempPosts;
    try {
        const posts = Promise.all(tags.map((tag) => {
            return axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`);
        }));
        tempPosts = await Promise.all([posts]);

    } catch (err) {
        console.log(err.stack);
    }
    let allPosts = []
    for (let tempPost of tempPosts[0]) {
        allPosts.push(...tempPost.data.posts)
    }

    // remove duplicates
    keys = ['author', 'authorId', 'id', 'likes', 'popularity', 'reads'],
        filteredPosts = allPosts.filter(
            (s => o =>
                (k => !s.has(k) && s.add(k))
                    (keys.map(k => o[k]).join('|'))
            )
                (new Set)
        );

    res.status(200).json({ sucess: true, posts: filteredPosts });
    // // Fields to exclude
    // let removedFields = ['select', 'sort', 'page', 'limit'];

    // // Delete the fields from reqQuery
    // removedFields.forEach(param => delete reqQuery[param]);

    // let queryStr = JSON.stringify(reqQuery);


    // if (req.query.select) {
    //     const fields = req.query.select.split(',').join(' ');
    //     query = query.select(fields);
    // }

    // // sorting
    // if (req.query.sort) {
    //     const sortBy = req.query.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // } else {
    //     query = query.sort('-createdAt');
    // }

    // Pagination
    // const page = parseInt(req.query.page, 10) || 1;
    // const limit = parseInt(req.query.limit, 10) || 25;
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // const total = await model.countDocuments();
    // //console.log(page, limit, startIndex)

    // query = query.skip(startIndex).limit(limit);

    // if (populate) {
    //     query = query.populate(populate);
    // }

    // const results = await query;

    // // pagination result
    // const pagination = {};
    // if (endIndex < total) {
    //     pagination.next = {
    //         page: page + 1,
    //         limit
    //     }
    // }

    // if (startIndex > 0) {
    //     pagination.prev = {
    //         page: page - 1,
    //         limit
    //     }
    // }

    // res.advancedResults = {
    //     success: true, count: results.length, data: results
    // }
    // next();

})
