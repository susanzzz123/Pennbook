import React from "react"

export const Post = ({ img, user, content, type, date }) => {
  const display_date = new Date(date).toString()
  return (
    <div class="card" style={{ width: "18rem" }}>
      <img class="card-img-top" src={img} alt="Card image cap" />
      <div class="card-body">
        <h5 class="card-title">{user}</h5>
        <h6>{display_date}</h6>
        <p class="card-text">{content}</p>
        {type === "post" && <button class="btn btn-primary">Comment</button>}
      </div>
    </div>
  )
}
