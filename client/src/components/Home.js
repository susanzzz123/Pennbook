import react, { useEffect, useState } from 'react'
import $ from 'jquery'

const Home = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    $.get('http://localhost:3000/test', function(data, status) {
      setMessage(data)
    })
  }, []) 

  return (
    <>
      <div>This is the home page!</div>
      <div>{message}</div>
    </>
  )
}

export default Home
