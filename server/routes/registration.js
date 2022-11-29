/* ---------------------------
Routes for account registration
-----------------------------*/

const db = require("../models/database")
const CryptoJS = require("crypto-js")

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

const registration_routes = {
  signup,
  login,
}

module.exports = registration_routes
