/* ---
Routes
-----*/
const db = require('../models/database')

// Define the routes to be used here
const testRoute = function (req, res) {
  res.send("this is a test route")
}

var addUser = function (req, res) {
  const email = req.body.email
}

const login = async (req, res) => {
  const { username, password } = req.body
  //hash the password and check against the db
}
const signUp = async (req, res) => {
  const { 
    username, 
    password, 
    first_name, 
    last_name,
    email,
    affiliation,
    birthday,
    interests
  } = req.body

  //take in interests as string/array
  //generate user id for storing in the table
  //hash the password for storage
}

const changeEmail = async (Req, res) => {
  const { username, newEmail } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.username === username) {
    //db calls for updating email
  }
}

const changePassword = async (req, res) => {
  const { username, newPassword } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.username === username) {
    //hash the password
    //db calls for updating password
  }
}

const changeAffiliation = async (req, res) => {
  const { username, affiliation } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.username === username) {
    //db calls for updating affiliation
  }
}

const addInterest = async (req, res) => {
  const { username, newInterest } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.username === username) {
    //hash the password
    //db calls for adding interest
  }
}

const deleteInterest = async (req, res) => {
  const { username, interest } = req.body
  //somehow check if it's the logged-in user changing their email
  if (req.session.username === username) {
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
  sign_up: signUp,
  change_email: changeEmail,
  change_password: changePassword,
  change_affiliation: changeAffiliation,
  add_interest: addInterest,
  delete_interest: deleteInterest,
  search_user: searchUser
}

module.exports = routes 
