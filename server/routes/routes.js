/* ---
Routes
-----*/
var db = require('../models/database')

// Define the routes to be used here
var testRoute = function (req, res) {
  res.send("this is a test route")
}

var addUser = function (req, res) {
  const email = req.body.email
}

// Routes object
var routes = {
  test_route: testRoute,
  add_user: addUser,
}

module.exports = routes 
