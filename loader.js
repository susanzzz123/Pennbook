const AWS = require('aws-sdk')
AWS.config.update({region:'us-east-1'})
const db = new AWS.DynamoDB();
const async = require('async')

var initTable = function(key, tableName, callback) {
  db.listTables(function(err, data) {
    if (err)  {
      console.log(err, err.stack);
      callback('Error when listing tables: ' + err, null);
    } else {
      console.log("Connected to AWS DynamoDB");
          
      var tables = data.TableNames.toString().split(",");
      console.log("Tables in DynamoDB: " + tables);
      if (tables.indexOf(tableName) == -1) {
        console.log("Creating new table '"+tableName+"'");

        var params = {
            AttributeDefinitions: 
              [ 
                {
                  AttributeName: key,
                  AttributeType: 'S'
                }
              ],
            KeySchema: 
              [ 
                {
                  AttributeName: key,
                  KeyType: 'HASH'
                }
              ],
            ProvisionedThroughput: { 
              ReadCapacityUnits: 20,       // DANGER: Don't increase this too much; stay within the free tier!
              WriteCapacityUnits: 20       // DANGER: Don't increase this too much; stay within the free tier!
            },
            TableName: tableName /* required */
        };

        db.createTable(params, function(err, data) {
          if (err) {
            console.log(err)
            callback('Error while creating table '+tableName+': '+err, null);
          }
          else {
            console.log("Table is being created; waiting for 20 seconds...");
            setTimeout(function() {
              console.log("Success");
              callback(null, 'Success');
            }, 20000);
          }
        });
      } else {
        console.log("Table "+tableName+" already exists");
        callback(null, 'Success');
      }
    }
  });
}

initTable("uid", "users", function(err, data) {
  if (err) {
    console.log("error making table users")
  } else {
    console.log("successfully created table users")
  }
})

initTable("post_id", "posts", function(err, data) {
  if (err) {
    console.log("error making table posts")
  } else {
    console.log("successfully created table posts")
  }
})

initTable("sender_uid", "friends", function(err, data) {
  if (err) {
    console.log("error making table friends")
  } else {
    console.log("successfully created table friends")
  }
})

initTable("sender_uid", "friends", function(err, data) {
  if (err) {
    console.log("error making table friends")
  } else {
    console.log("successfully created table friends")
  }
})

initTable("group_id", "groups", function(err, data) {
  if (err) {
    console.log("error making table groups")
  } else {
    console.log("successfully created table groups")
  }
})

initTable("sender_uid", "messages", function(err, data) {
  if (err) {
    console.log("error making table messages")
  } else {
    console.log("successfully created table messages")
  }
})

initTable("news_id", "news", function(err, data) {
  if (err) {
    console.log("error making table news")
  } else {
    console.log("successfully created table news")
  }
})