/* -------------------
Database Access Routes
---------------------*/
const AWS = require("aws-sdk")
AWS.config.update({ region: "us-east-1" })
const db = new AWS.DynamoDB()

var checkLogin = function (username, callback) {
  // With username as key
  console.log(username)
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "users",
    AttributesToGet: ["password"],
  }

  // If the user exists then return the password to the callback
  db.query(params, function (err, data) {
    console.log({ err, data })
    if (err || data.Items.length == 0) {
      callback(err, "user not found")
    } else {
      const password = data.Items[0].password.S

      callback(err, { password })
    }
  })
}

var database = {
  check_login: checkLogin,
}

module.exports = database
