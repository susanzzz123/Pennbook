/* ---
Routes
-----*/
const account_routes = require("./account")
const friend_routes = require("./friends")
const registration_routes = require("./registration")
const utility_routes = require("./utility")

// Routes object
const routes = {
  login: registration_routes.login,
  signup: registration_routes.signup,
  change_email: account_routes.change_email,
  change_password: account_routes.change_password,
  change_affiliation: account_routes.change_affiliation,
  add_interest: account_routes.add_interest,
  delete_interest: account_routes.delete_interest,
  search_user: utility_routes.search_user,
  get_user: utility_routes.get_user,
  get_wall_information: utility_routes.get_wall_information,
  get_friends: friend_routes.get_friends,
  remove_friend: friend_routes.remove_friend,
  add_friend: friend_routes.add_friend,
  request_friend: friend_routes.request_friend,
}

module.exports = routes
