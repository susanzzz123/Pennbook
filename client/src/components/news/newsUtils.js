import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });
const db = new AWS.DynamoDB();

export const getRecommendedArticle = (username) => {
  var params = {
    ExpressionAttributeValues: {
      ":u": { S: "U#" + username },
    },
    KeyConditionExpression: "label = :u",
    ProjectionExpression: "Episode, Title, Subtitle",
    FilterExpression: "contains (Subtitle, :topic)",
    TableName: "EPISODES_TABLE",
  };

  db.scan((err, data) => {});
};
