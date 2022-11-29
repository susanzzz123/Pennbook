/* ---------------
Routes for friends
-----------------*/

const db = require("../models/database")

const requestFriend = async (req, res) => {
  res.send("TODO")
}

const addFriend = async (req, res) => {
  const { username, friendUsername } = req.body
  res.send("TODO")
}

const removeFriend = async (req, res) => {
  const { username, friendUsername } = req.body
  res.send("TODO")

  //users db calls to get ids
  //friends db calls to remove from each's friends list
}

const getFriends = async (req, res) => {
  const { username } = req.body

  db.get_friends(username, function (err, data) {
    if (err) {
      res.send("Error occured when searching for friends")
    } else {
      const friendships = data
      res.send(friendships)
    }
  })
}

const friend_routes = {
  get_friends: getFriends,
  remove_friend: removeFriend,
  add_friend: addFriend,
  request_friend: requestFriend,
}

module.exports = friend_routes
