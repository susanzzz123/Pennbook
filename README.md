1. the full names and SEAS login names of all team members, 2) a description of featuresimplemented, 3) any extra credit claimed, 4) a list of source files included, 5) a declaration that all ofthe code you are submitting was written by you, and 6) instructions for building an running yourproject. The instructions must be sufficiently detailed for us to set up and run your application

Team Members:
Jason Ren: jren2
Brian Williams: bewill
Ryan de Lopez: vdelopez
Susan Zhang: szhang25

Features Implemented:

- In this project, we implemented a facebook themed around Penn students. This allows user to sign up and login
  with accounts, change their information, add friends, comment on friends' posts, chat with others and
  get news suggested to them. All of this information is persistent and maintains on login. This app also allows
  the user to view their network of friends and those with similar affiliations.

Source files included:
G22
|**_loader.js
|_**server
| |\_**\_middlewares
| | |\_\_**isAuthenticated.js
| |\_**\_models
| | |\_\_**database.js
| | |\_**\_postsdb.js
| |\_\_**routes
| | |\_**\_account.js
| | |\_\_**friends.js
| | |\_**\_posts.js
| | |\_\_**registration.js
| | |\_**\_routes.js
| | |\_\_**timestamp.js
| | |\_**\_utility.js
| |\_\_**index.js
|**\_client
| |\_\_**src
| | |\_**\_components
| | | |\_\_**icons
| | | | |\_**\_AddedFriend.js
| | | | |\_\_**AddFriend.js
| | | | |\_**\_Edit.js
| | | | |\_\_**PendingFriend.js
| | | | |\_**\_Profile.js
| | | |\_\_**Error.js
| | | |\_**\_Header.js
| | | |\_\_**Home.js
| | | |\_**\_Landing.js
| | | |\_\_**penguin.png
| | | |\_**\_Post.js
| | | |\_\_**Signup.js
| | | |\_**\_Visualizer.js
| | | |\_\_**Wall.js
| | |\_**\_App.js
| | |\_\_**index.html
| | |\_\_\_\_index.js

Running this project:
To run this project, navigate to G22 and run npm run dev.

## News
1. `mvn package`
2. `mvn exec:java@local`