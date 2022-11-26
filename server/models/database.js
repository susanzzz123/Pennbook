/* -------------------
Database Access Routes
---------------------*/
const AWS = require("aws-sdk")
AWS.config.update({ region: "us-east-1" })
const db = new AWS.DynamoDB()

var getUserInfo = function (username, callback) {
  // With username as key
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "users",
  }

  // If the user exists then return the password to the callback
  db.query(params, function (err, data) {
    if (err || data.Items.length == 0) {
      callback(err, "user not found")
    } else {
      const first_name = data.Items[0].first_name.S
      const last_name = data.Items[0].last_name.S
      const interests = data.Items[0].interests.SS
      const affiliation = data.Items[0].affiliation.S
      const username = data.Items[0].username.S
      const email = data.Items[0].email.S
      const birthday = data.Items[0].birthday.S

      callback(err, { first_name, last_name, interests, affiliation, username, email, birthday })
    }
  })
}

var checkLogin = function (username, callback) {
  // With username as key
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
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "users",
    AttributesToGet: ["password"],
  }

  db.query(params, function (err, data) {
    if (err || data.Items.length !== 0) {
      callback(err, "user already exists")
    } else {
      //add the user to db if they don't exist
      var paramsAddUser = {
        Item: {
          username: {
            S: username,
          },
          password: {
            S: password,
          },
          first_name: {
            S: first_name,
          },
          last_name: {
            S: last_name,
          },
          email: {
            S: email,
          },
          affiliation: {
            S: affiliation,
          },
          birthday: {
            S: birthday,
          },
          interests: {
            SS: interests,
          },
        },
        TableName: "users",
        ReturnValues: "NONE",
      }

      db.putItem(paramsAddUser, function (err, data) {
        if (err) callback(err)
        else callback(null, "Success")
      })
    }
  })
}

var updateEmail = (username, email, callback) => {
  const params = {
    TableName: "users",
    Key: {
      username: {
        S: username,
      },
    },
    ExpressionAttributeNames: { "#email": "email" },
    UpdateExpression: "set #email = :val",
    ExpressionAttributeValues: {
      ":val": {
        S: email,
      },
    },
  }
  db.updateItem(params, function (err, data) {
    if (err) {
      callback(err, "unable to update email")
    } else {
      callback(null, "email updated successfully")
    }
  })
}

var updatePassword = (username, password, callback) => {
  const params = {
    TableName: "users",
    Key: {
      username: {
        S: username,
      },
    },
    ExpressionAttributeNames: { "#password": "password" },
    UpdateExpression: "set #password = :val",
    ExpressionAttributeValues: {
      ":val": {
        S: password,
      },
    },
  }
  db.updateItem(params, function (err, data) {
    if (err) {
      callback(err, "unable to update password")
    } else {
      callback(null, "password updated successfully")
    }
  })
}

var updateAffiliation = (username, affiliation, callback) => {
  const params = {
    TableName: "users",
    Key: {
      username: {
        S: username,
      },
    },
    ExpressionAttributeNames: { "#affiliation": "affiliation" },
    UpdateExpression: "set #affiliation = :val",
    ExpressionAttributeValues: {
      ":val": {
        S: affiliation,
      },
    },
  }
  db.updateItem(params, function (err, data) {
    if (err) {
      callback(err, "unable to update affiliation")
    } else {
      callback(null, "affiliation updated successfully")
    }
  })
}

var addInterest = (username, interest, callback) => {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "users",
    AttributesToGet: ["interests"],
  }

  db.query(params, function (err, data) {
    if (err || data.Items.length !== 0) {
      callback(err, "user doesn't exist")
    } else {
      //add interest to list
      const currInterests = data.Items[0].interests.SS
      currInterests.push(interest)
      const paramsAddInterest = {
        TableName: "users",
        Key: {
          username: {
            S: username,
          },
        },
        ExpressionAttributeNames: { "#interests": "interests" },
        UpdateExpression: "set #interests = :val",
        ExpressionAttributeValues: {
          ":val": {
            SS: currInterests,
          },
        },
      }
      db.updateItem(paramsAddInterest, function (err, data) {
        if (err) {
          callback(err, "unable to add interests")
        } else {
          callback(null, "interest added successfully")
        }
      })
    }
  })
}

var removeInterest = (username, interest, callback) => {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "users",
    AttributesToGet: ["interests"],
  }

  db.query(params, function (err, data) {
    if (err || data.Items.length !== 0) {
      callback(err, "user doesn't exist")
    } else {
      //add interest to list
      const currInterests = data.Items[0].interests.SS
      const idx = currInterests.indexOf(interest)
      currInterests = currInterests.splice(idx, 1)
      const paramsAddInterest = {
        TableName: "users",
        Key: {
          username: {
            S: username,
          },
        },
        ProjectionExpression: "#interests",
        ExpressionAttributeNames: { "#interests": "interests" },
        UpdateExpression: "set #interests = :val",
        ExpressionAttributeValues: {
          ":val": {
            SS: currInterests,
          },
        },
      }
      db.updateItem(paramsAddInterest, function (err, data) {
        if (err) {
          callback(err, "unable to remove interests")
        } else {
          callback(null, "interest removed successfully")
        }
      })
    }
  })
}

var database = {
  check_login: checkLogin,
  get_user_info: getUserInfo,
  check_signup: checkSignup,
  update_email: updateEmail,
  update_password: updatePassword,
  update_affiliation: updateAffiliation,
  add_interest: addInterest,
  remove_interest: removeInterest,
}

module.exports = database
