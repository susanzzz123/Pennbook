/* ---
Routes
-----*/
var db = require('../models/database')

// Define the routes to be used here
var testRoute = function (req, res) {
  res.send("this is a test route")
}

// Routes object
var routes = {
  test_route: testRoute
}

module.exports = routes 
