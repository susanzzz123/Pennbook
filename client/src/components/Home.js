import { useEffect, useState } from "react"
import AddedFriend from "./icons/AddedFriend"
import PendingFriend from "./icons/PendingFriend"
import Header from "./Header"
import $ from "jquery"


const Home = () => {
  const [user, setUser] = useState('')
  const [friends, setFriends] = useState([])
  //posts are sorted in ascending order

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
          <div className="col">Menu</div>
          <div>{user}</div>
          
        </div>
      </div>
    </>
  )
}

export default Home
