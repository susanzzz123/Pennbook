import { useEffect, useState } from "react"
import AddedFriend from "./icons/AddedFriend"
import PendingFriend from "./icons/PendingFriend"
import Header from "./Header"
import $ from "jquery"
import { Post } from "./Post"

const Home = () => {
  const [user, setUser] = useState('')
  const [friends, setFriends] = useState([])
  //posts are sorted in ascending order
  const [allPosts, setAllPosts] = useState([])

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
  
  useEffect(() => {
    $.get("http://localhost:3000/getPosts", { username: user }, (data, status) => {
      setAllPosts(data)
    })
  }, [])

  return (
    <>
      <Header></Header>
      <div className="container text-center">
        <div className="row">
          <div className="col">Menu</div>
          <div>{user}</div>
          <div className="col-8">
            <Post></Post>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
