var express = require("express");
var session = require("express-session");
var routes = require("./routes/routes");
var cors = require("cors");
const path = require("path");

// Initialization
var app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

app.use(cors({ credentials: true, origin: "http://localhost:1234" }));
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: "loginSecret",
		resave: false,
		saveUninitialized: true,
	})
);
app.use(express.json());
app.use(express.static("dist"));

const io = new Server(server, {
	cors: {
		origin: "http://localhost:1234",
		methods: ["GET", "POST"],
	},
});

// listening for incoming sockets
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);
	socket.on("join_room", (data) => {
		console.log(data);
		socket.join(data);
	});
	socket.on("send_message", (data) => {
		console.log(data.room);
		socket.to(data.room).emit("receive_message", data);
		//socket.broadcast.emit("receive_message", data);
	});
	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});
});

server.listen(3000, () => {
	console.log("listening on :3000");
});

// Routes
app.post("/signup", routes.signup);
app.post("/login", routes.login);
app.post("/changeEmail", routes.change_email);
app.post("/changePassword", routes.change_password);
app.get("/getUser", routes.get_user);
app.post("/searchUser", routes.search_user);
app.post("/getWallInformation", routes.get_wall_information);
app.post("/changeAffiliation", routes.change_affiliation);
app.post("/getFriends", routes.get_friends);
app.post("/addFriend", routes.add_friend);
app.post("/removeFriend", routes.remove_friend);
app.get("/getPosts", routes.get_posts_for_user);

// set favicon
app.get("/favicon.ico", (req, res) => {
	res.status(404).send();
});

// set the initial entry point
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// // Start node server
// app.listen(3000, () => {
// 	console.log("listening on 3000");
// });
