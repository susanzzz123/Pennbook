import { useEffect, useState } from "react"
import AddedFriend from "./icons/AddedFriend"
import PendingFriend from "./icons/PendingFriend"
import Header from "./Header"
import Post from "./Post"
import $ from "jquery"

const Home = () => {
  const [user, setUser] = useState()
  const [friends, setFriends] = useState([])
  //posts are sorted in ascending order
  const [posts, setPosts] = useState([])

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      setUser(data)
      $.post("http://localhost:3000/getFriends", { username: data }, (data, status) => {
        if (data === "user has no friends") {
          setFriends([])
        } else {
          setFriends(data)
          data.forEach(friend => {
            if (friend.status.N == 1) {
              $.post("http://localhost:3000/getPosts", { username: friend.receiver.S }, (data, status) => {
                if (data !== "no posts") {
                  setPosts(posts.concat(data))
                } else {
                  //error message for display
                  console.log("error while retrieving posts")
                }
              })
            }
          })
        }
      })
    })
  }, [])

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
                <Post user={post.author.S} wall={post.username.S} content={post.content.S} type={post.type.S} date={parseInt(post.post_id.N)}></Post>
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
                  <a href={`/wall?user=${elem.receiver.S}`} className="text-decoration-none d-inline pe-auto mx-2">
                    {elem.receiver.S}
                  </a>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
