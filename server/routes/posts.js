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
  const { username, type, wall, parent_name, parent_id, content, img } = req.body
  db.add_post(username, type, wall, parent_name, parent_id, content, img, function (err, data) {
    if (err) {
      res.send(err)
    } else {
      res.send("Success")
    }
  })
}

const routes = {
  get_posts_for_user: getPostsForUser,
  add_post: addPost,
}

module.exports = routes
