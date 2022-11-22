var express = require("express")
var session = require("express-session")
var routes = require("./routes/routes")
var cors = require("cors")
const path = require("path")
var cookieSession = require("cookie-session")
const isAuthenticated = require("./middlewares/isAuthenticated")

// Initialization
var app = express()

app.use(cors({ credentials: true, origin: "*" }))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //please change it based on your needs
      secure: app.get("env") === "production" ? true : false,
      sameSite: "none",
      secure: false,
      httpOnly: false,
    },
    secret: "loginSecret",
    resave: false,
    saveUninitialized: false,
  })
)
app.use(express.json())
app.use(express.static("dist"))

// Routes
app.get("/test", routes.test_route)
app.post("/signup", routes.signup)
app.post("/login", routes.login)
app.put("/changeEmail", routes.change_email)
app.get("/isLogged", routes.is_logged)

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
