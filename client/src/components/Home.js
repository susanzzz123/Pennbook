import React, { useEffect, useState } from "react";
import AddedFriend from "./icons/AddedFriend";
import PendingFriend from "./icons/PendingFriend";
import Header from "./Header";
import $ from "jquery";
import Post from "./Post";
import Chat from "./Chat";
import socket from "./Socket";
import OfflineFriend from "./icons/OfflineFriend";
import OnlineFriend from './icons/OnlineFriend'

const Home = () => {
	// const socket = io.connect("http://localhost:3000");
	// const [message, setMessage] = useState("");
	// const [messageReceived, setMessageReceived] = useState("");
	// const [showChat, setShowChat] = useState(false);
	const [user, setUser] = useState("");
	const [friends, setFriends] = useState([]);
	const [friendsList, setFriendsList] = useState([]);
	const curr_date = Date.now();
	// posts are sorted in ascending order
	const [posts, setPosts] = useState([]);
  const [searchArticle, setSearchArticle] = useState('')

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
		$.get("http://localhost:80/getUser", (data, status) => {
			const username = data;
			setUser(username);
      console.log("GOT USER")
			$.post(
				"http://localhost:80/getFriends",
				{ username: data },
				(data, status) => {
          console.log("GOT FRIENDS")
					if (data === "user has no friends") {
						setFriends([]);
					} else if (typeof data === "string") {
						setFriends([]);
					} else {
            console.log("USER HAS FRIENDS")
						const promises = [];
						const friend_list = [];
						data.forEach(function (individual_friend) {
							promises.push(
								$.post(
									"http://localhost:80/getWallInformation",
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

						const postPromises = [];
						let postList = [];
						postPromises.push(
							$.post(
								"http://localhost:80/getPosts",
								{ username },
								(dataResponse, status) => {
									if (dataResponse !== "no posts") {
										const newList = [...dataResponse];
										postList = postList.concat(newList);
									}
								}
							)
						);

						data.forEach((friend) => {
							if (friend.status.N == 1) {
								postPromises.push(
									$.post(
										"http://localhost:80/getPosts",
										{ username: friend.receiver.S },
										(dataResponse, status) => {
											if (dataResponse !== "no posts") {
												const newList = [...dataResponse];
												console.log(newList);
												postList = postList.concat(newList);
											}
										}
									)
								);
							}
						});
						Promise.all(postPromises).then((values) => {
							postList.sort((a, b) => (a.post_id.N > b.post_id.N ? -1 : 1));
							setPosts([...postList]);
						});
					}
				}
			);
			socket.emit("get_online_friends", data);
		});
	}, []);

	return (
		<>
    <style>
      {`
        #overflow-div::-webkit-scrollbar {
          display: none;
        }
      `}
    </style>
    <div></div>
			<Header></Header>
			<div className="container text-center">
				<div className="row">
					<div className="col-3">
            Search for a news article:
            <div>
              <input
                id="search-input"
                // onBlur={() => handleBlur()}
                // onFocus={() => handleFocus()}
                onChange={(e) => setSearchArticle(e.target.value)}
                type="search"
                className="form-control"
                placeholder="Search for an article..."
                aria-label="Search"
              />
            </div>
            News articles recommended for you
            <div>
              here should be like top 10 articles recommended
            </div>
            Active group chats
            <div>
              <Chat userName={user} friends={friendsList} />
            </div>
          </div>
					<div id="overflow-div" style={{height:"90vh", overflow: "auto"}} className="col-7 text-center">
              {posts.map((post) => (
								<Post
									user={post.author.S}
									wall={post.username.S}
									content={post.content.S}
									type={post.type.S}
									date={parseInt(post.post_id.N)}
									visitingUser={user}
								></Post>
							))}
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
								console.log(elem.last_time);
								return (
									<div className="d-flex my-2">
                  {curr_date - parseInt(elem.last_time) > 300000 ? (
                    <>
                      <span className="d-inline">
                        <OfflineFriend></OfflineFriend>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="d-inline">
                        <OnlineFriend></OnlineFriend>
                      </span>
                    </>
                  )}
										<a
											href={`/wall?user=${elem.friend}`}
											className="text-decoration-none d-inline pe-auto mx-2"
										>
											{elem.friend}
										</a>
									</div>
								);
							})}
					</div>
				</div>
			</div>
			
			{/* {!showChat ? (
				<div className="joinChatContainer">
					<button onClick={() => setShowChat(true)}>Chat</button>
				</div>
			) : (
				<div className="chatContainer">
					<button onClick={() => setShowChat(false)}>Chat</button>
					<Chat userName={user} friends={friendsList} />
				</div>
			)} */}
		</>
	);
};

export default Home;
