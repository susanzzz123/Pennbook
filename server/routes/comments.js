/* -------------
Routes for comments
---------------*/

const db = require("../models/postsdb")

const getCommentsForPost = function(req, res) {
  const { post_identifier } = req.body  
  db.get_comments_for_post(post_identifier, function(err, data) {
    if (err || data === "post has no comments") {
      res.send("no comments")
    } else {
      res.send(data)
    }
  })
}

const addComment = function(req, res) {
  const { post_identifier, content, date, author } = req.body
  db.add_comment(post_identifier, content, date, author, function(err, data) {
    if (err) {
      res.send(err)
    } else {
      res.send("Success")
    }
  })
}

const comment_routes = {
  get_comments_for_post: getCommentsForPost,
  add_comment: addComment
}
  
module.exports = comment_routes