import React, { useEffect, useState } from "react"
import $ from "jquery"
import Comment from "./Comment"
import { v4 as uuidv4 } from 'uuid';

const Post = ({ user, wall, content, type, date, visitingUser }) => {
  const [commentContent, setCommentContent] = useState('')
  const [comments, setComments] = useState([])

  const currDate = new Date(date).toString()
  const post_identifier = `${user}#${wall}#${date}`

  useEffect(() => {
    $.post("http://localhost:3000/getComments", { post_identifier }, (data, status) => {
      if (data !== "no comments") {
        setComments(data)
      }
    })
  }, [comments])

  const addComment = () => {
    const now = `${Date.now()}`
    const comment_id = uuidv4()
    const comment = commentContent
    setCommentContent('')
    $.post("http://localhost:3000/addComment", { author: visitingUser, comment_id, post_identifier, date: now, content: comment }, (data, status) => {
      if (data === "Comment cannot have empty content!") {
        alert(data)
      } if (data !== "Success") {
        alert(`Error while commenting`)
      } else {
        const commentObj = {
          author: {S: visitingUser},
          comment_id: {S: comment_id},
          content: {S: commentContent},
          date: {N: now}
        }
        let newComments = [...comments]
        newComments.push(commentObj)
        // console.log(newComments)
        setComments([...newComments])
      }
    })
  }

  return (
    <div className="card mb-4 shadow" style={{ width: "24rem" }}>
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
                onChange={(e) => setCommentContent(e.target.value)}
                value={commentContent}>
              </textarea>
              <button className="btn btn-outline-primary input-group-text" onClick={() => addComment()}>
                Comment
              </button>
            </div>
          )
        }
      </div>
      {
        comments.length > 0 && type === 'Post' && (
          <h5 className="mb-2">Comments:</h5>
        )
      }
      <div>
        {
          comments.map(comment => (
            <div key={parseInt(comment.date.N)}>
              <Comment
                author={comment.author.S}
                date={parseInt(comment.date.N)}
                content={comment.content.S}>
              </Comment>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Post
