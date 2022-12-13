/* -----------
Utility routes
------------*/

const db = require("../models/database")
const timestamp = require("./timestamp")

const getUser = function (req, res) {
  res.send(req.session.user)
}

const getWallInformation = function (req, res) {
  const { user } = req.body

  db.get_user_info(user, function (err, data) {
    if (err || data === "user not found") {
      res.send("err1")
    } else {
      res.send(data)
    }
  })
}

// searches for users in the database by a particular prefix
const searchUser = async (req, res) => {
  const { username } = req.body

  db.get_users(username, function (err, data) {
    if (err) {
      res.send("Error occurred when searching for users")
    } else {
      if (data.Items.length == 0) {
        res.send("No users found")
      } else {
        // Returns the usernames of the people - might change to make async calls to each of the usernames
        const usernames = data.Items[0].usernames.SS
        res.send(usernames)
      }
    }
  })
}

const utility_routes = {
  search_user: searchUser,
  get_user: getUser,
  get_wall_information: getWallInformation,
}

module.exports = utility_routes
