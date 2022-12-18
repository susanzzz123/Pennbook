import React, { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import socket from "./Socket";

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
					new Date(Date.now()).getHours() +
					":" +
					new Date(Date.now()).getMinutes(),
			};
			await socket.emit("send_message", messageData);
			setMessageList((list) => [...list, messageData]);
			setCurrentMessage("");
		}
	};

	const inviteToChat = (e) => {
		var friend = e.target.value;
		socket.emit("invite_to_chat", friend);
	};

	const startChat = (inviter) => {
		setShowChatBox(true);
		socket.emit("start_chat", inviter);
	};

	useEffect(() => {
		socket.on("receive_message", (data) => {
			setMessageList((list) => [...list, data]);
		});
		socket.on("receive_invite", (data) => {
			setInviter(data.name);
			setRoom(data.id);
			setShowNotificationWindow(true);
		});
		socket.on("chat_invite_accepted", (data) => {
			setShowChatBox(true);
			socket.emit("join_room", data);
			setRoom(data);
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
												<p id="time">{messageContent.time}</p>
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
