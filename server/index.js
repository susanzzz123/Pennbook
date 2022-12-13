var express = require("express")
var session = require("express-session")
var routes = require("./routes/routes")
var cors = require("cors")
const path = require("path")

// Initialization
var app = express()

app.use(cors({ credentials: true, origin: "http://localhost:1234" }))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: "loginSecret",
    resave: false,
    saveUninitialized: true,
  })
)
app.use(express.json())
app.use(express.static("dist"))

// Routes
app.post("/signup", routes.signup)
app.post("/login", routes.login)
app.post("/logout", routes.logout)
app.post("/changeEmail", routes.change_email)
app.post("/changePassword", routes.change_password)
app.get("/getUser", routes.get_user)
app.post("/searchUser", routes.search_user)
app.post("/getWallInformation", routes.get_wall_information)
app.post("/changeAffiliation", routes.change_affiliation)
app.post("/getFriends", routes.get_friends)
app.post("/addPost", routes.add_post)
app.post("/getPosts", routes.get_posts_for_user)
app.post("/addFriend", routes.add_friend)
app.post("/removeFriend", routes.remove_friend)
app.post("/updateTimestamp", routes.update_timestamp)
app.post("/getTimestamp", routes.get_timestamp)
app.post("/addInterest", routes.add_interest)
app.post("/deleteInterest", routes.delete_interest)
app.post("/addComment", routes.add_comment)
app.post("/getComments", routes.get_comments_for_post)

// set favicon
app.get("/favicon.ico", (req, res) => {
  res.status(404).send()
})

// set the initial entry point
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"))
})

// Start node server
app.listen(3000, () => {
  console.log("listening on 3000")
})
