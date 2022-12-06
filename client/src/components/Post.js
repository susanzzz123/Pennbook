import React from "react"

const Post = ({ user, wall, content, type, date }) => {
  const currDate = new Date(date).toString()
  return (
    <div className="card mb-4 shadow" style={{ width: "24rem" }}>
      {/* <img class="card-img-top" src={img} alt="Card image cap"/> */}
      <div className="card-body">
        <h5 className="card-title">{user}</h5>
        <h6>{currDate}</h6>
        <p>Wall: {wall}</p>
        <p className="card-text">{content}</p>
        {type === "Post" && <button className="btn btn-primary" onClick={() => console.log(date)}>Comment</button>}
      </div>
    </div>
  )
}

export default Post
