/* -------------------
Database Access Routes
---------------------*/
const AWS = require("aws-sdk")
AWS.config.update({ region: "us-east-1" })
const db = new AWS.DynamoDB()
const async = require("async")

/* -------------------
Table: posts
---------------------*/

const addPost = (username, author, type, parent_name, parent_id, content, callback) => {
  const post_id = `${Date.now()}`
  var params = {
    Item: {
      username: {
        S: username,
      },
      author: {
        S: author,
      },
      post_id: {
        N: post_id,
      },
      type: {
        S: type,
      },
      parent_name: {
        S: parent_name,
      },
      parent_id: {
        N: parent_id
      },
      content: {
        S: content,
      }
    },
    TableName: "posts",
    ReturnValues: "NONE",
  }
  db.putItem(params, function (err, data) {
    if (err) {
      callback(err)
    } else {
      //a post on another person's wall should also show up on their list of posts
      if (username !== author) {
        var params1 = {
          Item: {
            username: {
              S: author,
            },
            author: {
              S: author,
            },
            post_id: {
              N: post_id,
            },
            type: {
              S: type,
            },
            parent_name: {
              S: parent_name,
            },
            parent_id: {
              N: parent_id
            },
            content: {
              S: content,
            }
          },
          TableName: "posts",
          ReturnValues: "NONE",
        }
        db.putItem(params1, function (err, data) {
          if (err) {
            callback(err)
          } else {
            callback(null, "Successfully added to both walls")
          }
        })
      } else {
        callback(null, "Success")
      }
    }
  })
}

const getPostsForUser = (username, callback) => {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "posts",
    ScanIndexForward: false,
  }

  db.query(params, function(err, data) {
    if (err || data.Items.length === 0) {
      callback(err, "user has no posts")
    } else {
      callback(null, data.Items)
    }
  })
}

const database = {
  add_post: addPost,
  get_posts_for_user: getPostsForUser
}
  
  module.exports = database