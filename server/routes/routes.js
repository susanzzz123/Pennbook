/* ---
Routes
-----*/
const db = require("../models/database")
const CryptoJS = require("crypto-js")

// Define the routes to be used here
const testRoute = function (req, res) {
  res.send("this is a test route")
}

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

const login = async (req, res) => {
  const { username, password } = req.body
  var hash = CryptoJS.SHA256(password).toString()

  db.check_login(username, function (err, data) {
    if (err || data === "user not found") {
      res.send("err1")
    } else {
      const password = data.password

      if (password === hash) {
        req.session.user = username
        req.session.save()
        res.send("works")
      } else {
        res.send("err2")
      }
    }
  })
}

var signup = function (req, res) {
  const { username, password, first_name, last_name, email, affiliation, birthday, interests } = req.body
  var hash = CryptoJS.SHA256(password).toString()

  db.check_signup(username, hash, first_name, last_name, email, affiliation, birthday, interests, function (err, data) {
    if (data === "user already exists") {
      res.send("err1")
    } else {
      if (data === "Success") {
        req.session.user = username
        req.session.save()
        res.send("works")
      } else {
        res.send("err2")
      }
    }
  })
}

const changeEmail = async (req, res) => {
  const { username, email } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //db calls for updating email
    db.update_email(username, email, function (err, data) {
      if (err || data === "unable to update email") {
        res.send("unable to update email")
      } else {
        res.send(data)
      }
    })
  }
}

const changePassword = async (req, res) => {
  const { username, password } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //hash the password
    var hash = CryptoJS.SHA256(password).toString()
    //db calls for updating password
    db.update_password(username, hash, function (err, data) {
      if (err || data === "unable to update password") {
        res.send("unable to update password")
      } else {
        res.send(data)
      }
    })
  }
}

const changeAffiliation = async (req, res) => {
  const { username, affiliation } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //db calls for updating affiliation
    db.update_affiliation(username, affiliation, function (err, data) {
      if (err || data === "unable to update affiliation") {
        res.send("unable to update affiliation")
      } else {
        res.send(data)
      }
    })
  } else {
    res.send("user has no access permissions")
  }
}

const addInterest = async (req, res) => {
  const { username, newInterest } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //db calls for adding interest
    db.add_interest(username, newInterest, function (err, data) {
      if (err) {
        res.send("failed to add interest")
      } else {
        res.send(data)
      }
    })
  }
}

const deleteInterest = async (req, res) => {
  const { username, interest } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //hash the password
    //db calls for deleting interest
    db.remove_interest(username, interest, function (err, data) {
      if (err) {
        res.send("failed to remove interest")
      } else {
        res.send(data)
      }
    })
  }
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

// Routes object
const routes = {
  test_route: testRoute,
  login,
  signup,
  change_email: changeEmail,
  change_password: changePassword,
  change_affiliation: changeAffiliation,
  add_interest: addInterest,
  delete_interest: deleteInterest,
  search_user: searchUser,
  get_user: getUser,
  get_wall_information: getWallInformation,
}

module.exports = routes
