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

var checkSignup = function (username, password, first_name, last_name, email, affiliation, birthday, interests, callback) {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [ { S: username } ]
      }
    },
    TableName: "users",
    AttributesToGet: [ 'password' ]
  };

  db.query(params, function(err, data) {
    if (err || data.Items.length !== 0) {
      callback(err, "user already exists");
    } else {
    //add the user to db if they don't exist
      var paramsAddUser = {
        Item: {
          "username": {
            S: username
          },
          "password": { 
            S: password
          },
          "first_name": {
            S: first_name
          },
          "last_name": {
            S: last_name
          },
          "email": {
            S: email
          },
          "affiliation": {
            S: affiliation
          },
          "birthday": {
            S: birthday
          },
          "interests": {
            SS: interests
          }
        },
        TableName: "users",
        ReturnValues: 'NONE'
      };

      db.putItem(paramsAddUser, function(err, data){
        if (err)
          callback(err)
        else
          callback(null, 'Success')
      });
    }
  });
}

var updateEmail = (username, email, callback) => {
  const params = {
    TableName: "users",
    Key: {
      username: {
        S: username
      }
    },
    ProjectionExpression: "#email",
    ExpressionAttributeNames: { "#email": "email" },
    UpdateExpression: "set #email = :val",
    ExpressionAttributeValues: {
      ":val": {
        S: email
      }
    },
  };
  db.updateItem(params, function(err, data) {
    if (err) {
      callback(err, "unable to update email")
    } else {
      callback(null, "email updated successfully")
    }
  })
}

var database = {
  check_login: checkLogin,
  check_signup: checkSignup,
  update_email: updateEmail
}

module.exports = database
