import { useEffect, useState } from "react"
import Header from "./Header"
import $ from "jquery"
import { Post } from "./Post"

const Home = () => {
  const [user, setUser] = useState()

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      setUser(data)
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
          <div className="col">List of friends/friends online and chat groups</div>
        </div>
      </div>
    </>
  )
}

export default Home
