import react, { useEffect } from 'react'
import $ from 'jquery'

const Home = () => {
  useEffect(() => {
    $.get('http://localhost:3000/', function(data, status) {
      console.log(data)
      console.log(status)
    })
  }) 

  return (
    <>
      <div>This is the home page!</div>
    </>
  )
}

export default Home
