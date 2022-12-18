import React from 'react'

const Comment = ({ author, comment_id, date, content }) => {
  const currDate = new Date(date).toString()
  return (
    <div className="card mb-4 shadow-sm" style={{ width: "20rem" }}>
      <div className="card-body">
        <h5 className="card-title">{author}</h5>
        <h6>{currDate}</h6>
        <p className="card-text">{content}</p>
      </div>
    </div>
  )
}

export default Comment
