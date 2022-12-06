/* -------------------
Database Access Routes
---------------------*/
const AWS = require("aws-sdk")
AWS.config.update({ region: "us-east-1" })
const db = new AWS.DynamoDB()
const async = require("async")

/* -------------------
Table(s): users (and prefixes)
---------------------*/

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
      const last_time = data.Items[0].last_time.N

      callback(err, { first_name, last_name, interests, affiliation, username, email, birthday, last_time })
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

var getFriends = function (username, callback) {
  // With username as key
  var params = {
    KeyConditions: {
      sender: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "friends",
  }

  // If the user exists then return the password to the callback
  db.query(params, function (err, data) {
    if (err) {
      callback(err, "error")
    } else if (data.Items.length == 0) {
      callback(err, "user has no friends")
    } else {
      const friendships = data.Items

      callback(err, friendships)
    }
  })
}

var addFriend = function (sender, receiver, callback) {
  var params = {
    Item: {
      sender: {
        S: sender,
      },
      receiver: {
        S: receiver,
      },
      status: {
        N: "0",
      },
    },
    TableName: "friends",
  }

  db.putItem(params, function (err, data) {
    if (err) {
      callback(err)
    } else {
      callback(err, "success")
    }
  })
}

var removeFriend = function (sender, receiver, callback) {
  var params = {
    TableName: "friends",
    Key: {
      sender: { S: sender },
      receiver: { S: receiver },
    },
  }

  db.deleteItem(params, function (err, data) {
    if (err) {
      callback(err)
    } else {
      callback(err, "success")
    }
  })
}

const updateTimestamp = function (username, callback) {
  const updated_time = `${Date.now()}`

  const params = {
    TableName: "users",
    Key: {
      username: {
        S: username,
      },
    },
    ExpressionAttributeNames: { "#time": "last_time" },
    UpdateExpression: "set #time = :val",
    ExpressionAttributeValues: {
      ":val": {
        N: updated_time,
      },
    },
  }

  db.updateItem(params, function (err, data) {
    if (err) {
      callback(err, "unable to update time")
    } else {
      callback(null, "timestamp updated successfully")
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

  const time = `${Date.now()}`

  db.query(params, function (err, data) {
    if (err || data == null || data.Items.length !== 0) {
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
          last_time: {
            N: time,
          },
        },
        TableName: "users",
        ReturnValues: "NONE",
      }

      db.putItem(paramsAddUser, function (err, data) {
        if (err) {
          callback(err)
        } else {
          //

          // Also add the user prefixes to the prefixes table if they don't exist
          const prefixes = []
          const word = []
          for (let i = 0; i < username.length; i++) {
            word.push(username.charAt(i))
            prefixes.push([word.join(""), [username]])
          }

          async
            .forEach(prefixes, function (prefix) {
              // Check if the prefix exists
              var params = {
                KeyConditions: {
                  prefix: {
                    ComparisonOperator: "EQ",
                    AttributeValueList: [{ S: prefix[0] }],
                  },
                },
                TableName: "prefixes",
              }

              db.query(params, function (err, data) {
                if (err) {
                  callback(err, "failed")
                } else if (data.Items.length !== 0) {
                  // If the prefix already exists, update the users
                  const newData = [...data.Items[0].usernames.SS, prefix[1][0]]
                  const params = {
                    TableName: "prefixes",
                    Key: {
                      prefix: {
                        S: prefix[0],
                      },
                    },
                    ExpressionAttributeNames: { "#usernames": "usernames" },
                    UpdateExpression: "set #usernames = :val",
                    ExpressionAttributeValues: {
                      ":val": {
                        SS: newData,
                      },
                    },
                  }
                  db.updateItem(params, function (err, data) {
                    if (err) {
                      callback(err, "failed")
                    }
                  })
                } else {
                  // If the prefix doesn't exist, then add it to the table
                  var params = {
                    Item: {
                      prefix: {
                        S: prefix[0],
                      },
                      usernames: {
                        SS: prefix[1],
                      },
                    },
                    TableName: "prefixes",
                  }

                  db.putItem(params, function (err, data) {
                    if (err) {
                      callback(err, "failed")
                    }
                  })
                }
              })
            })
            .then(callback(null, "Success"))
        }
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
    if (err || data.Items.length === 0) {
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
    if (err || data.Items.length === 0) {
      callback(err, "user doesn't exist")
    } else {
      //add interest to list
      const currInterests = data.Items[0].interests.SS
      const idx = currInterests.indexOf(interest)
      currInterests.splice(idx, 1)
      console.log(currInterests)
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
          callback(err, "unable to remove interests")
        } else {
          callback(null, "interest removed successfully")
        }
      })
    }
  })
}

// used for when searching for users publicly
var getUsers = (username, callback) => {
  // With username as the key, look for the prefixes
  var params = {
    KeyConditions: {
      prefix: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "prefixes",
    AttributesToGet: ["usernames"],
  }

  db.query(params, function (err, data) {
    if (err) {
      callback(err, "Error with querying users")
    } else {
      callback(err, data)
    }
  })
}

var database = {
  update_timestamp: updateTimestamp,
  check_login: checkLogin,
  get_user_info: getUserInfo,
  check_signup: checkSignup,
  update_email: updateEmail,
  update_password: updatePassword,
  update_affiliation: updateAffiliation,
  add_interest: addInterest,
  remove_interest: removeInterest,
  get_users: getUsers,
  get_friends: getFriends,
  add_friend: addFriend,
  remove_friend: removeFriend,
}

module.exports = database
