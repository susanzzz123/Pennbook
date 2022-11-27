import { useEffect, useState } from "react"
import Header from "./Header"
import $ from "jquery"
import { Post } from "./Post"

const Home = () => {
  const [user, setUser] = useState('')
  //posts are sorted in ascending order
  const [allPosts, setAllPosts] = useState([])

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      setUser(data)
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
            {
              allPosts.map(post => {
                <Post 
                img={post.img.S}
                user={post.username.S}
                content={post.content.S}
                type={post.type.S}
                date={post.post_id.N}
                ></Post>
              })
            }
          </div>
          <div className="col">List of friends/friends online and chat groups</div>
        </div>
      </div>
    </>
  )
}

export default Home
