import AWS from 'aws-sdk';
import fetch from 'node-fetch';

AWS.config.update({ region: "us-east-1" });
const db = new AWS.DynamoDB();

const loadNews = async () => {
  fetch("https://penn-cis545-files.s3.amazonaws.com/News_Category_Dataset_v2.json")
   .then(response => response.text())
   .then((response) => {
      const entries = response.split('\r\n').slice(0, 100).map((n, i) => ({id: i.toString(), ...JSON.parse(n)}));
      console.log(entries);

      entries.forEach(e => {
         const date = new Date(Date.parse(e.date));
         date.setFullYear(date.getFullYear() + 5);

         var params = {
            TableName: 'news',
            Item: {
              'news_id': {'S': e.id},
              'link': {'S': e.link},
              'category': {'S': e.category},
              'headline': {'S': e.headline},
              'authors': {'S': e.authors},
              'short_description': {'S': e.short_description},
              'date': {'S': date.toString()},
            }
         };

         db.putItem(params, function(err, data) {
            console.log(err);
            console.log(data);
         });
      })
   })
   .catch(err => console.log(err))
}

loadNews()

