import React, { useEffect, useState } from "react";
import AddedFriend from "./icons/AddedFriend";
import PendingFriend from "./icons/PendingFriend";
import Header from "./Header";
import $ from "jquery";
import { Post } from "./Post";
import io from "socket.io-client";
import Chat from "./Chat";

const Home = () => {
	const [user, setUser] = useState();
	const [friends, setFriends] = useState([]);
	const socket = io.connect("http://localhost:3000");
	const [userName, setUserName] = useState("");
	// const [message, setMessage] = useState("");
	// const [messageReceived, setMessageReceived] = useState("");
	const [room, setRoom] = useState("");
	const [showChat, setShowChat] = useState(false);

	const joinRoom = () => {
		if (userName !== "" && room !== "") {
			socket.emit("join_room", room);
			setShowChat(true);
		}
	};

	// const sendMessage = () => {
	// 	socket.emit("send_message", { message, room });
	// };

	// useEffect(() => {
	// 	socket.on("receive_message", (data) => {
	// 		setMessageReceived(data.message);
	// 	});
	// }, [socket]);

	useEffect(() => {
		$.get("http://localhost:3000/getUser", (data, status) => {
			setUser(data);
			$.post(
				"http://localhost:3000/getFriends",
				{ username: data },
				(data, status) => {
					if (data === "Error occured when searching for friends") {
						setFriends([]);
					} else {
						setFriends(data);
					}
				}
			);
		});
	}, []);

	return (
		<>
			<Header></Header>
			<div className="container text-center">
				<div className="row">
					<div className="col-3">Menu</div>
					<div className="col-7 text-center">
						Welcome <div>{user}</div>
						<div className="d-flex justify-content-center">
							<Post></Post>
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
							friends.map((elem) => (
								<div className="d-flex my-2">
									{elem.status.N == 0 && (
										<span className="d-inline">
											<PendingFriend></PendingFriend>
										</span>
									)}
									{elem.status.N == 1 && (
										<span className="d-inline">
											<AddedFriend></AddedFriend>
										</span>
									)}
									<a
										href={`/wall?user=${elem.receiver.S}`}
										className="text-decoration-none d-inline pe-auto mx-2"
									>
										{elem.receiver.S}
									</a>
								</div>
							))}
					</div>
				</div>
			</div>
			{!showChat ? (
				<div className="joinChatContainer">
					<input
						id="input"
						autoComplete="off"
						placeholder="Username"
						onChange={(event) => {
							setUserName(event.target.value);
						}}
					/>
					<br />
					<input
						id="input"
						autoComplete="off"
						placeholder="Room Number"
						onChange={(event) => {
							setRoom(event.target.value);
						}}
						onKeyPress={(event) => {
							event.key === "Enter" && joinRoom();
						}}
					/>
					<button onClick={joinRoom}>Join Room</button>
					{/* <br />
				<input
					id="input"
					autoComplete="off"
					placeholder="Message..."
					onChange={(event) => {
						setMessage(event.target.value);
					}}
				/>
				<button onClick={sendMessage}>Send</button>
				<h1>Message: </h1>
				{messageReceived} */}
				</div>
			) : (
				<Chat socket={socket} userName={userName} room={room} />
			)}
		</>
	);
};

export default Home;
