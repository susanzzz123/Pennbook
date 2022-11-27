const db = require("../models/postsdb")
const express = require('express')

const getPostsForUser = function(req, res) {
  const { username } = req.body
  db.get_posts_for_user(username, function(err, data) {
    if (err || data === "user has no posts") {
      res.send("no posts")
    } else {
      res.send(data)
    }
  })
}

const routes = {
  get_posts_for_user: getPostsForUser
}

module.exports = routes