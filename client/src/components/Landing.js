import react, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import $ from "jquery"

const Landing = () => {
  const [errMessage, setErrMessage] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      if (data !== "") {
        navigate("/home")
      }
    })
    $("#password").on("keypress", (e) => {
      if (e.which === 13) {
        handleLogin()
      }
    })
    $("#login").on("click", () => {
      handleLogin()
    })
  }, [])

  handleLogin = () => {
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
  }

  handleSignup = () => {
    navigate("/signup")
  }

  return (
    <>
      <div style={{ background: "linear-gradient(119deg, rgba(173,162,231,1) 24%, rgba(138,187,227,1) 96%)", height: "100vh", padding: "10vh" }} className="w-100">
        <h2 className="text-center text-light mb-5 ">Pennbook</h2>
        <form className="m-auto bg-light w-25 p-4 rounded">
          <div style={{ width: "15vw" }} className="form-floating mb-3 m-auto">
            <input id="username" className="form-control" placeholder="Username" />
            <label className="text-secondary" htmlFor="floatingInput">
              Username
            </label>
          </div>
          <div style={{ width: "15vw" }} className="form-floating mb-2 m-auto">
            <input id="password" className="form-control" placeholder="Password" />
            <label className="text-secondary" htmlFor="floatingInput">
              Password
            </label>
          </div>
          <p className="text-danger text-center">{errMessage}</p>
          <div className="m-auto text-center mb-3">
            <button style={{ width: "15vw" }} type="button" id="login" className="btn btn-primary">
              Log in
            </button>
          </div>
          <div className="m-auto text-center">
            <button style={{ width: "12vw" }} onClick={() => handleSignup()} type="button" id="login" className=" btn btn-success">
              Create account
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Landing
