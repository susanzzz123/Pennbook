import { useEffect, useState } from "react"
import AddedFriend from "./icons/AddedFriend"
import PendingFriend from "./icons/PendingFriend"
import Header from "./Header"
import $ from "jquery"
import { Post } from "./Post"

const Home = () => {
  const [user, setUser] = useState()
  const [friends, setFriends] = useState([])

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      setUser(data)
      $.post("http://localhost:3000/getFriends", { username: data }, (data, status) => {
        if (data === "Error occured when searching for friends") {
          setFriends([])
        } else {
          setFriends(data)
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
