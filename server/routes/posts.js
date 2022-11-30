/* -------------
Routes for posts
---------------*/

const db = require("../models/postsdb")

const getPostsForUser = function (req, res) {
  const { username } = req.body
  db.get_posts_for_user(username, function (err, data) {
    if (err || data === "user has no posts") {
      res.send("no posts")
    } else {
      res.send(data)
    }
  })
}

const addPost = function (req, res) {
  const { username, author, type, parent_name, parent_id, content } = req.body
  db.add_post(username, author, type, parent_name, parent_id, content, function (err, data) {
    if (err) {
      res.send(err)
    } else {
      res.send("Success")
    }
  })
}

const posts_routes = {
  get_posts_for_user: getPostsForUser,
  add_post: addPost,
}

module.exports = posts_routes
