import React, { useEffect, useState } from "react"
import Comment from "./Comment"

const Post = ({ user, wall, content, type, date, visitingUser }) => {
  const [clicked, setClicked] = useState(false)
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState([])

  const currDate = new Date(date).toString()
  let post_identifier = `${wall}#${date}`

  useEffect(() => {
    $.post("http://localhost:3000/getComments", { post_identifier }, (data, status) => {
      if (data !== "no comments") {
        setComments(data)
      } else {
        console.log("error while retrieving comments")
      }
    })
  }, [post_identifier])

  const addComment = async () => {
    const now = `${Date.now()}`
    $.post("http://localhost:3000/addComment", { author: visitingUser, post_identifier, date: now, content: commentContent }, (data, status) => {
      if (data !== "Success") {
        alert(`Error while posting`)
      } else {
        const commentObj = {
          author: {S: visitingUser},
          content: {S: commentContent},
          date: {N: now}
        }
        let newComments = [...comments]
        newComments.push(commentObj)
        setComments([... commentObj])
      }
    })
  }

  return (
    <div className="card mb-4 shadow" style={{ width: "24rem" }}>
      {/* <img class="card-img-top" src={img} alt="Card image cap"/> */}
      <div className="card-body">
        <h5 className="card-title">{user}</h5>
        <h6>{currDate}</h6>
        <p>Wall: {wall}</p>
        <p className="card-text">{content}</p>
        {
          type === "Post" && (
            <div className="input-group input-group-sm mt-2">
              <textarea
                className="form-control"
                onChange={(e) => setCommentContent(e.target.value)}>
              </textarea>
              <button className="btn btn-outline-primary input-group-text" onClick={() => addComment()}>
                Comment
              </button>
            </div>
          )
        }
      </div>
      {
        comments.map(comment => {
          <Comment
            author={comment.author}
            date={comment.date}
            content={comment.content}>
          </Comment>
        })
      }
    </div>
  )
}

export default Post
