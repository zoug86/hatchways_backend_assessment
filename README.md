# Hatchways-Backend-Challenge

This project adds additional functionalities to a third party API:

```
 https://api.hatchways.io/assessment/blog/posts
```
 All added features are built with Node.js and Express.js (Mocha and Chai.js for testing).

## General Idea
The third party API is supposed to return a list of JSON blog posts when triggered with an HTTP GET request. However, in order to achieve that, a one valued *tag* query field needs to be added to the query string:

```
https://api.hatchways.io/assessment/blog/posts$tag=history
```

## Added Features

1- Our task is to add functionality to search with two tag values (one at least)

```
http://localhost:5000/api/posts?tags=history,tech
```

The above URL will trigger the 3rd party API and call it twice to fetch all posts with tags: history and tech.

A simple JSON return looks as follows:
```JSON
{
     "posts": [
        {
            "author": "Rylee Paul",
            "authorId": 9,
            "id": 1,
            "likes": 960,
            "popularity": 0.13,
            "reads": 50361,
            "tags": [
                "tech",
                "health"
            ]
        },
        {
            "author": "Zackery Turner",
            "authorId": 12,
            "id": 2,
            "likes": 469,
            "popularity": 0.68,
            "reads": 90406,
            "tags": [
                "startups",
                "tech",
                "history"
            ]
        },
        ....
    ]
},
```

2- Since some posts may have multiple tags, we might end up with many duplicattions. A filteration method needs to be implemented. 

3- We need to sort the posts based on a specific sorting criteria (usually a post property of a number type)

Now our route will look like this:

```
http://localhost:5000/api/posts?tags=history,tech&sortBy=popularity
```
This will return posts ordered by the number of their popularity values and in ascending order by default.
 
4- Sorting needs a direction (ascending by default and descending when specified).

```
http://localhost:5000/api/posts?tags=history,tech&sortBy=popularity&direction=desc
```


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:5000/api](http://localhost:5000/api) to view it in the browser.

1- PING route:

Go to:
[http://localhost:5000/api/ping](http://localhost:5000/api/ping)

2- Posts route:

Go to:
[http://localhost:5000/api/posts?tags=history,tech&sortBy=popularity&direction=desc](http://localhost:5000/api/posts?tags=history,tech&sortBy=popularity&direction=desc)

### `npm test`

Run ``` npm test``` on your terminal and checking the 9 tests included in: ```tests/posts.js```