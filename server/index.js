var express = require("express");
var session = require("express-session");
var routes = require("./routes/routes");
var cors = require("cors");
const path = require("path");
const db = require("./models/database");

// Initialization
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
const users = {};

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

// listening for incoming sockets
io.on("connection", async (socket) => {
	console.log(`User connected: ${socket.id}`);
	socket.on("join_room", (data) => {
		socket.join(data);
	});
	socket.on("start_chat", (data) => {
		socket.join(users[data]);
		socket.to(users[data]).emit("chat_invite_accepted", users[data]);
	});
	socket.on("send_message", (data) => {
		// socket.rooms.forEach((set) => console.log("send" + set));
		io.to(data.room).emit("receive_message", data);
		// socket.broadcast.emit("receive_message", data);
	});
	socket.on("get_online_friends", (data) => {
		socket.data.username = data;
		users[socket.data.username] = socket.id;
		io.fetchSockets().then((sockets) => {
			var onlineUsers = [];
			sockets.forEach((s) => {
				onlineUsers.push(s.data.username);
			});
			db.get_online_friends(
				socket.data.username,
				onlineUsers,
				function (err, data) {
					if (err) {
						console.log(err);
					} else {
						socket.emit("load_online_friends", data);
					}
				}
			);
		});
	});
	socket.on("invite_to_chat", (data) => {
		const inviter = { name: socket.data.username, id: socket.id };
		socket.to(users[data]).emit("receive_invite", inviter);
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
app.post("/logout", routes.logout);
app.post("/changeEmail", routes.change_email);
app.post("/changePassword", routes.change_password);
app.get("/getUser", routes.get_user);
app.post("/searchUser", routes.search_user);
app.post("/getWallInformation", routes.get_wall_information);
app.post("/changeAffiliation", routes.change_affiliation);
app.post("/getFriends", routes.get_friends);
app.post("/addPost", routes.add_post);
app.post("/getPosts", routes.get_posts_for_user);
app.post("/addFriend", routes.add_friend);
app.post("/removeFriend", routes.remove_friend);
app.post("/updateTimestamp", routes.update_timestamp);
app.post("/getTimestamp", routes.get_timestamp);

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
