const asyncHandler = require('../middleware/asyncHandler');
const axios = require('axios');

// @desc    Ping URL
// @route   GET  /api/ping
// @access  Public

exports.ping = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true });
})

// @desc    Get Blog Posts
// @route   GET  /api/posts
// @access  Public

exports.getPosts = asyncHandler(async (req, res) => {

    let { tags, sortBy = 'id', direction = 'asc' } = { ...req.query };

    const sortByValues = ['id', 'likes', 'popularity', 'reads'];
    const directionValues = ['asc', 'desc'];

    if (!tags) {
        res.status(400).json({ error: 'Tags parameter is required' });
    }
    else if (sortByValues.indexOf(sortBy) === - 1) {
        res.status(400).send({ error: 'sortBy parameter is invalid' });
    }
    else if (directionValues.indexOf(direction) === -1) {
        res.status(400).send({ error: 'direction parameter is invalid' });
    }
    else {
        let allPosts = []
        tags = tags.split(',')

        //load all Posts (including duplicates) concurrently
        axios.all([
            axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tags[0]}`),
            axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tags[1]}`)
        ])
            .then(axios.spread((data1, data2) => {

                allPosts = [...data1.data.posts, ...data2.data.posts];

                //remove duplicates
                keys = ['author', 'authorId', 'id', 'likes', 'popularity', 'reads'];
                allPosts = allPosts.filter(
                    (s => o =>
                        (k => !s.has(k) && s.add(k))
                            (keys.map(k => o[k]).join('|'))
                    )
                        (new Set)
                );

                // Sorting (asc by default)
                allPosts = allPosts.sort((a, b) => (direction === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]));

                res.status(200).json({ posts: allPosts });
            }));

        /*load all Posts (including duplicates) in parallel requests*/
        // 
        //     let tempPosts;
        //     try {
        //         const posts = Promise.all(tags.map((tag) => {
        //             return axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}`);
        //         }));
        //         tempPosts = await Promise.all([posts]);

        //     } catch (err) {
        //         console.log(err.stack);
        //     }
        /*************************************************************/
    }

})
