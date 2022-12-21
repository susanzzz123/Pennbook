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
    // const interval = setInterval(() => {
      socket.on("load_online_friends", (data) => {
        var onlineFriends = data.online;
        setFriendsList(onlineFriends);
      });
      // if (friends && user) {
      //   socket.emit("get_all_posts", { friends, username: user })
      // }
      // socket.on("load_all_posts", (data) => {
      //   const filteredPosts = data.reduce((acc, current) => {
      //     const x = acc.find(post => 
      //       (post.post_id.N === current.post_id.N) && (post.author.S === current.author.S)
      //     );
      //     if (!x) {
      //       return acc.concat([current]);
      //     } else {
      //       return acc;
      //     }
      //   }, []);
      //   filteredPosts.sort((a, b) => (a.post_id.N > b.post_id.N ? -1 : 1));
      //   setPosts([...filteredPosts]);
      // })
    // }, 5000)
    // return () => clearInterval(interval)
	}, []);


	useEffect(() => {
		$.get("http://localhost:3000/getUser", (data, status) => {
			const username = data;
			setUser(username);
			$.post(
				"http://localhost:3000/getFriends",
				{ username: data },
				(data, status) => {
          const postPromises = []
          let postList = []
					if (data === "user has no friends") {
						setFriends([]);
					} else if (typeof data === "string") {
						setFriends([]);
					} else {
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
              // socket.emit("get_all_posts", { friends: data, username });
						});
            const promises = [];
						const friend_list = [];
            data.forEach(friend => {
              if (friend.status.N == 1) {
                postPromises.push(
                  $.post(
                    "http://localhost:3000/getPosts", 
                    {username: friend.receiver.S}, 
                  function(err, dataR) {
                    if (dataR != "no posts") {
                      const newList = [...dataR]
                      postList = postList.concat(newList)
                    }
                  })
                )
              }
            })
            postPromises.push(
              $.post(
              "http://localhost:3000/getPosts",
              {username},
              function(err, dataR) {
                if (dataR != "no posts") {
                  const newList = [...dataR]
                  postList = postList.concat(newList)
                }
              })
            )
            Promise.all(postPromises).then((values) => {
              const filteredPosts = postList.reduce((acc, current) => {
                const x = acc.find(post => 
                  (post.post_id.N === current.post_id.N) && (post.author.S === current.author.S)
                );
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
              }, []);
              filteredPosts.sort((a, b) => (a.post_id.N > b.post_id.N ? -1 : 1));
              setPosts([...filteredPosts]);
            })
					}
				}
			);
			socket.emit("get_online_friends", data);
		});
	}, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
      // if (friends && user) {
      //   socket.emit("get_all_posts", { friends, username: user })
      // }
      // // const data = user
      // socket.emit("get_online_friends", user);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

	return (
		<>
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
					<div className="col-7 text-center">
              {posts.map((post) => (
								<Post
									user={post.author.S}
									wall={post.wall.S}
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
