var express = require("express")
var session = require("express-session")
var routes = require("./routes/routes")
var postRoutes = require("./routes/posts")
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
app.get("/test", routes.test_route)
app.post("/signup", routes.signup)
app.post("/login", routes.login)
app.post("/changeEmail", routes.change_email)
app.post("/changePassword", routes.change_password)
app.get("/getUser", routes.get_user)
app.post("/searchUser", routes.search_user)
app.post("/getWallInformation", routes.get_wall_information)
app.post("/changeAffiliation", routes.change_affiliation)
app.post("/getFriends", routes.get_friends)

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
