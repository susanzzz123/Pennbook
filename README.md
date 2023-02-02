**Pennbook**

Team Members:
Jason Ren: jren2
Brian Williams: bewill
Ryan de Lopez: vdelopez
Susan Zhang: szhang25

**Features Implemented**:

In this project, we implemented a facebook themed around Penn students. This allows users to sign up and login with hashed password accounts, change their information (while maintaining security such that other users cannot change others' information) such as affiliation, interests, password and email, add friends, search for friends, comment on friends' posts with dynamicism and persistence, chat with others and get news suggested to them. All of this information is persistent and maintains on login. Along with these features, each user has their own wall where they can view their own posts and posts made on their wall. They will also have a home page to view status updates, new friendships, and profile updates made by friends. This app also allows the user to view their network of friends and those with similar affiliations. 

**Technologies Used**:
- JavaScript
- React.js
- HTML/CSS
- Backend on Node.js with Express.js
- AWS services(DynamoDB, S3, deployed on EC2)
- Socket.io
- Apache Spark

Extra Credit:
- This project also implements dynamic and persistent profile pictures and persistent group chat messages.  

Declaration that all of the code you are submitting was written by us:
Brian Williams bewill
Ryan deLopez vdelopez
Susan Zhang szhang25
Jason Ren jren2

Running this project:
To run this project, navigate to directory G22 in terminal, run "npm install", and run "npm run dev".

## News
1. `mvn package`
2. `mvn exec:java@local`
