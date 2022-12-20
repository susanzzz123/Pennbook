import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import socket from "./Socket";
const img = require("./logout.png");

const Chat = ({ userName, friends }) => {
	const [currentMessage, setCurrentMessage] = useState("");
	const [messageList, setMessageList] = useState([]);
	const [inviter, setInviter] = useState("");
	const [showNotificationWindow, setShowNotificationWindow] = useState(false);
	const [showChatBox, setShowChatBox] = useState(false);
	const [room, setRoom] = useState("");

	const sendMessage = async () => {
		if (currentMessage !== "") {
			const messageData = {
				room: room,
				author: userName,
				message: currentMessage,
				time:
					// new Date(Date.now()).getHours() +
					// ":" +
					// new Date(Date.now()).getMinutes(),
					new Date(Date.now()),
			};
			await socket.emit("send_message", messageData);
			setCurrentMessage("");
		}
	};

	const inviteToChat = (e) => {
		var friend = e.target.value;
		socket.emit("invite_to_chat", friend);
	};

	const startChat = (inviter) => {
		const startData = {
			inviter: inviter,
			user: userName,
		};
		// setShowChatBox(true);
		// var room = startData.inviter + "" + startData.user;
		// setRoom(room);
		socket.emit("start_chat", startData);
	};

	const leaveChat = () => {
		const leaveData = {
			room: room,
			user: userName,
		};
		socket.emit("leave_chat", leaveData);
		setRoom("");
		setShowChatBox(false);
	};

	useEffect(() => {
		socket.on("receive_message", (data) => {
			console.log("receive working");
			setMessageList((list) => [...list, data]);
		});
		socket.on("receive_invite", (data) => {
			setInviter(data.name);
			setShowNotificationWindow(true);
		});
		socket.on("chat_invite_accepted", (data) => {
			setShowChatBox(true);
			socket.emit("join_room", data);
			setRoom(data);
		});
		socket.on("user_left", (data) => {
			setMessageList((list) => [...list, data]);
		});
		socket.on("load_chat", (data) => {
			setShowChatBox(true);
			socket.emit("join_room", data.room.S);
			setRoom(data.room.S);
			var sortedMessages = data.messages.L.sort(
				(x, y) => new Date(x.M.time.S) - new Date(y.M.time.S)
			).map((item) => {
				const { message, author, time } = item.M;
				const messageData = {
					author: author.S,
					message: message.S,
					time: time.S,
				};
				return messageData;
			});
			setMessageList(sortedMessages);
		});
	}, [socket]);

	return (
		<div className="container">
			{showNotificationWindow ? (
				<div className="notification-window">
					<strong>{inviter}</strong> invited you to chat!
					<button
						onClick={() => {
							startChat(inviter);
							setShowNotificationWindow(false);
						}}
					>
						Accept
					</button>
					<button onClick={() => setShowNotificationWindow(false)}>
						Decline
					</button>
				</div>
			) : (
				<div className="notification-window"></div>
			)}
			<div className="friends-window">
				{friends.map((friend) => {
					return (
						<button onClick={(e) => inviteToChat(e, "value")} value={friend}>
							{friend}
						</button>
					);
				})}
			</div>
			{showChatBox ? (
				<div className="chat-window">
					<img
						className="d-inline align-top"
						src={img}
						width="25"
						onClick={() => leaveChat()}
					></img>
					<div className="chat-header">
						<p>Live Chat</p>
					</div>
					<div className="chat-body">
						<ScrollToBottom className="message-container">
							{messageList.map((messageContent) => {
								return (
									<div
										className="message"
										id={userName === messageContent.author ? "own" : "other"}
									>
										<div>
											<div className="message-content">
												<p>{messageContent.message}</p>
											</div>
											<div className="message-meta">
												<p id="time">
													{new Date(messageContent.time).getHours() +
														":" +
														new Date(messageContent.time).getMinutes()}
												</p>
												<p id="author">{messageContent.author}</p>
											</div>
										</div>
									</div>
								);
							})}
						</ScrollToBottom>
					</div>
					<div className="chat-footer">
						<input
							type="text"
							value={currentMessage}
							placeholder="Message..."
							onChange={(event) => {
								setCurrentMessage(event.target.value);
							}}
							onKeyPress={(event) => {
								event.key === "Enter" && sendMessage();
							}}
						/>
						<button onClick={sendMessage}>&#9658;</button>
					</div>
				</div>
			) : (
				<div className="chat-window"></div>
			)}
		</div>
	);
};

export default Chat;
