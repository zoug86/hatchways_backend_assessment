// Using Mocha and Chai for testing purposes
process.env.NODE_ENV = 'test';

const server = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSorted = require('chai-sorted');
const should = chai.should();

chai.use(chaiSorted);
chai.use(chaiHttp);

describe('BlogPosts', () => {

    //Test: /GET api/ping
    describe('/GET api/ping', () => {
        it('it should ping the server and return object {suceess: true} with statusCode: 200', (done) => {
            chai.request(server)
                .get('/api/ping')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.deep.equal({ 'success': true });
                    done();
                });
        });
    });

    //Test: get all blog posts based on Tag values
    describe('/GET api/posts?tags=history,tech', () => {
        it('it should return an array of objects with statusCode: 200', (done) => {
            chai.request(server)
                .get('/api/posts?tags=history,tech')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.posts.map((e) => {
                        e.should.be.a('object');
                        e.should.have.property('author');
                        e.should.have.property('authorId');
                        e.should.have.property('id');
                        e.should.have.property('likes');
                        e.should.have.property('popularity');
                        e.should.have.property('reads');
                        e.should.have.property('tags');
                    });
                    done();
                });
        });
    });

    //Test: return an error if tag field is missing
    describe('/GET api/posts', () => {
        it('it should return an object { error: Tags parameter is required } with statusCode: 400', (done) => {
            chai.request(server)
                .get('/api/posts')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({ error: 'Tags parameter is required' });
                    done();
                });
        });
    });

    //Test: return blog posts sorted by id and in ascending order(default)
    describe('/GET api/posts?tags=history,tech', () => {
        it('it should return a sorted array (sorted by id) of objects with statusCode: 200', (done) => {
            chai.request(server)
                .get('/api/posts?tags=history,tech')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.posts.should.be.sortedBy("id", { descending: false });
                    res.body.posts.should.be.ascendingBy("id");
                    done();
                });
        });
    });

    //Test: return error if sortBy field has the wrong paramter
    describe('/GET api/posts?tags=history,tech&sortBy=author', () => {
        it('it should return an object { error: sortBy parameter is invalid } with statusCode: 400', (done) => {
            chai.request(server)
                .get('/api/posts?tags=history,tech&sortBy=author')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({ error: 'sortBy parameter is invalid' });
                    done();
                });
        });
    });

    //Test: return error if direction field has a worng paramter
    describe('/GET api/posts?tags=history,tech&sortBy=likes&direction=ascending', () => {
        it('it should return an object { error: direction parameter is invalid } with statusCode: 400', (done) => {
            chai.request(server)
                .get('/api/posts?tags=history,tech&sortBy=likes&direction=ascending')
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.deep.equal({ error: 'direction parameter is invalid' });
                    done();
                });
        });
    });

    //Test: return posts sorted by their number of likes, in ascending order (default order)
    describe('/GET api/posts?tags=history,tech&sortBy=likes', () => {
        it('it should return a sorted array (sorted by # of likes) of objects, with statusCode: 200', (done) => {
            chai.request(server)
                .get('/api/posts?tags=history,tech&sortBy=likes')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.posts.should.be.sortedBy("likes");
                    res.body.posts.should.be.ascendingBy("likes");
                    done();
                });
        });
    });

    //Test: return posts sorted by their number of likes, in a descending order
    describe('/GET api/posts?tags=history,tech&sortBy=likes&direction=desc', () => {
        it('it should return a sorted array (sorted by # of likes) of objects in a descending order, with statusCode: 200', (done) => {
            chai.request(server)
                .get('/api/posts?tags=history,tech&sortBy=likes&direction=desc')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.posts.should.be.sortedBy("likes", { descending: true });
                    done();
                });
        });
    });

    //Test: return unique posts only (delete duplicates) when we have 2 tags
    describe('/GET api/posts?tags=history,tech', () => {
        it('it should return an array of unique objects, with statusCode: 200', (done) => {
            chai.request(server)
                .get('/api/posts?tags=history,tech')
                .end((err, res) => {
                    res.should.have.status(200);

                    // looking for duplicate objects based on their "id" values
                    const lookup = res.body.posts.reduce((a, e) => {
                        a[e.id] = ++a[e.id] || 0;
                        return a;
                    }, {});

                    // duplicates will have the repeated objects if we have any
                    const duplicates = res.body.posts.filter(e => lookup[e.id]);

                    duplicates.should.deep.equal([]);
                    done();
                });
        });
    });

});