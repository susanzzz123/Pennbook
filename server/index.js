var express = require('express')
var session = require('express-session')
var routes = require('./routes/routes')
var cors = require('cors')
const path = require('path')

// Initialization
var app = express();
app.use(cors({origin: '*'}));
app.use(express.urlencoded({ extended: true }))
app.use(session({secret: "loginSecret", resave: true, saveUninitialized: true}));
app.use(express.json())
app.use(express.static('dist'))

// Routes
app.get("/test", routes.test_route)
app.post("/addUser", routes.add_user)

// set favicon
app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

// set the initial entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

// Start node server
app.listen(3000, () => {
  console.log('listening on 3000');
})