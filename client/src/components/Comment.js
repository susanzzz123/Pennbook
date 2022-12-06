import React from 'react'

const Comment = ({ author, date, content }) => {
  return (
    <div className="card mb-4 shadow" style={{ width: "20rem" }}>
      <div className="card-body">
        <h5 className="card-title">{author}</h5>
        <h6>{date}</h6>
        <p className="card-text">{content}</p>
      </div>
    </div>
  )
}

export default Comment
