/* -------------------
Database Access Routes
---------------------*/
const AWS = require("aws-sdk")
AWS.config.update({ region: "us-east-1" })
const db = new AWS.DynamoDB()
const async = require("async")

/* -------------------
Table(s): posts
---------------------*/

const addPost = (username, type, wall, parent_name, parent_id, content, callback) => {
  var params = {
    KeyConditions: {
      username: {
        ComparisonOperator: "EQ",
        AttributeValueList: [{ S: username }],
      },
    },
    TableName: "posts",
  }
  db.query(params, function (err, data) {
    const post_id = Date.now()
    // const date_created = new Date(post_id).toString() to get the date
    if (err) {
      callback(err, "error occurred while querying user's posts")
    } else if (data.Items.length !== 0) { 

    } else {
      var paramsAddPost = {
        Item: {
          username: {
            S: username,
          },
          post_id: {
            S: post_id,
          },
          wall: {
            S: wall,
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
      db.putItem(paramsAddPost, function (err, data) {
        if (err) {
          callback(err)
        } else {
          callback(null, "Success")
        }
      })
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