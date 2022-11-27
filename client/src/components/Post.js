import React, { useState } from 'react'

export const Post = () => {

  const [title, setTitle] = useState('hi')
  const [content, setContent] = useState('')
  return (
    <div class="card" style={{width: "18rem"}}>
      <img class="card-img-top" src="..." alt="Card image cap"/>
      <div class="card-body">
        <h5 class="card-title">{title}</h5>
        <p class="card-text">{content}</p>
        <button class="btn btn-primary">Comment</button>
      </div>
    </div>
  )
}
