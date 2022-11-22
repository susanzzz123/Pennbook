import react, { useEffect, useState } from "react"
import { Link, useNavigate, useNavigationType } from "react-router-dom"
import $ from "jquery"

const Landing = () => {
  const [message, setMessage] = useState("")
  const [errMessage, setErrMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    $.get("http://localhost:3000/test", function (data, status) {
      setMessage(data)
    })
    $("#login").on("click", () => {
      const username = $("#username").val()
      const password = $("#password").val()

      if (username.length === 0) {
        setErrMessage("Username must be filled")
      } else if (password.length === 0) {
        setErrMessage("Password must be filled")
      } else {
        $.post("http://localhost:3000/login", { username, password }, function (data, status) {
          if (data === "err1") {
            setErrMessage("User not found")
          } else if (data === "err2") {
            setErrMessage("Password incorrect")
          } else {
            navigate("/home")
          }
        })
      }
    })
  }, [])

  return (
    <>
      <div className="container">
        <h1>Welcome to PennBook!</h1>
        <form>
          <div className="form-floating mb-3">
            <input id="username" className="form-control" placeholder="Username" />
            <label className="text-secondary" htmlFor="floatingInput">
              Username
            </label>
          </div>
          <div className="form-floating mb-3">
            <input id="password" className="form-control" placeholder="Password" />
            <label className="text-secondary" htmlFor="floatingInput">
              Password
            </label>
          </div>
          <p className="text-danger">{errMessage}</p>
          <button type="button" id="login" className="btn btn-primary">
            Log in
          </button>
          <Link className="mx-3" to="/signup">
            Sign up
          </Link>
        </form>
      </div>
    </>
  )
}

export default Landing
