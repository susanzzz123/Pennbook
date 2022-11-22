/* ---
Routes
-----*/
const db = require("../models/database")
const CryptoJS = require("crypto-js")
const secret_key = "nets2120 secret"

// Define the routes to be used here
const testRoute = function (req, res) {
  res.send("this is a test route")
}

const isLogged = function (req, res) {
  console.log("USER: " + req.session.user)
  res.send(req.session.user)
}

var signup = function (req, res) {
  const { username, password, first_name, last_name, email, affiliation, birthday, interests } = req.body
  var hash = CryptoJS.SHA256(password).toString()

  db.check_signup(username, hash, first_name, last_name, email, affiliation, birthday, interests, function (err, data) {
    if (err || data === "user already exists") {
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

const changeEmail = async (req, res) => {
  const { username, newEmail } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //db calls for updating email
    db.update_email(username, newEmail, function (err, data) {
      if (err || data === "unable to update email") {
        res.send("unable to update email")
      } else {
        res.send(data)
      }
    })
  }
}

const changePassword = async (req, res) => {
  const { username, newPassword } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //hash the password
    var hash = CryptoJS.SHA256(newPassword).toString()
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
  }
}

const addInterest = async (req, res) => {
  const { username, newInterest } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //db calls for adding interest
  }
}

const deleteInterest = async (req, res) => {
  const { username, interest } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.user === username) {
    //hash the password
    //db calls for deleting interest
  }
}

const searchUser = async (req, res) => {
  const { username } = req.body
  //db calls
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
  is_logged: isLogged,
}

module.exports = routes
