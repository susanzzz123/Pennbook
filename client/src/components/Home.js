import React, { useEffect, useState } from "react";
import AddedFriend from "./icons/AddedFriend";
import PendingFriend from "./icons/PendingFriend";
import Header from "./Header";
import $ from "jquery";
import { Post } from "./Post";
import Chat from "./Chat";
import socket from "./Socket";

const Home = () => {
	// const socket = io.connect("http://localhost:3000");
	// const [message, setMessage] = useState("");
	// const [messageReceived, setMessageReceived] = useState("");
	const [showChat, setShowChat] = useState(false);
	const [user, setUser] = useState("");
	const [friends, setFriends] = useState([]);
	const [friendsList, setFriendsList] = useState([]);
	const curr_date = Date.now();
	//posts are sorted in ascending order
	const [posts, setPosts] = useState([]);

	// const joinRoom = () => {
	// 	// console.log(user);
	// 	// console.log("join" + room);
	// 	if (room !== "") {
	// 		socket.emit("join_room", room);
	// 		setShowChat(true);
	// 	}
	// };

	useEffect(() => {
		socket.on("load_online_friends", (data) => {
			var onlineFriends = data.online;
			setFriendsList(onlineFriends);
		});
	}, [socket]);

	useEffect(() => {
		$.get("http://localhost:3000/getUser", (data, status) => {
			setUser(data);
			$.post(
				"http://localhost:3000/getFriends",
				{ username: data },
				(data, status) => {
					if (data === "user has no friends") {
						setFriends([]);
					} else if (typeof data === "string") {
						setFriends([]);
					} else {
						const promises = [];
						const friend_list = [];
						data.forEach(function (individual_friend) {
							promises.push(
								$.post(
									"http://localhost:3000/getWallInformation",
									{ user: individual_friend.receiver.S },
									(friend_data, status) => {
										friend_list.push({
											friend: friend_data.username,
											status: individual_friend.status.N,
											last_time: friend_data.last_time,
										});
									}
								)
							);
						});
						Promise.all(promises).then((values) => {
							setFriends(friend_list);
						});

						data.forEach((friend) => {
							if (friend.status.N == 1) {
								$.post(
									"http://localhost:3000/getPosts",
									{ username: friend.receiver.S },
									(data, status) => {
										if (data !== "no posts") {
											setPosts(posts.concat(data));
										} else {
											//error message for display
											console.log("error while retrieving posts");
										}
									}
								);
							}
						});
					}
				}
			);
			socket.emit("get_online_friends", data);
		});
	}, []);

	return (
		<>
			<Header></Header>
			<div className="container text-center">
				<div className="row">
					<div className="col-3">Menu</div>
					<div className="col-7 text-center">
						Welcome {user}
						<div className="col-8 justify-content-center">
							{posts.map((post) => (
								<Post
									user={post.author.S}
									wall={post.username.S}
									content={post.content.S}
									type={post.type.S}
									date={parseInt(post.post_id.N)}
								></Post>
							))}
						</div>
					</div>
					<div className="col-2">
						<h3 className="text-center">Friends</h3>
						{friends.length === 0 && (
							<>
								<div>No friends</div>
							</>
						)}
						{friends.length > 0 &&
							typeof friends != "string" &&
							friends.map((elem) => {
								// console.log(elem.last_time);
								return (
									<div className="d-flex my-2">
										{elem.status == 0 && (
											<span className="d-inline">
												<PendingFriend></PendingFriend>
											</span>
										)}
										{elem.status == 1 && (
											<span className="d-inline">
												<AddedFriend></AddedFriend>
											</span>
										)}
										<a
											href={`/wall?user=${elem.friend}`}
											className="text-decoration-none d-inline pe-auto mx-2"
										>
											{elem.friend}
										</a>
										{curr_date - parseInt(elem.last_time) > 300000 ? (
											<>
												<div>Offline</div>
											</>
										) : (
											<>
												<div>Online</div>
											</>
										)}
									</div>
								);
							})}
					</div>
				</div>
			</div>
			{!showChat ? (
				<div className="joinChatContainer">
					<button onClick={() => setShowChat(true)}>Chat</button>
				</div>
			) : (
				<div className="chatContainer">
					<button onClick={() => setShowChat(false)}>Chat</button>
					<Chat userName={user} friends={friendsList} />
				</div>
			)}
		</>
	);
};

export default Home;
