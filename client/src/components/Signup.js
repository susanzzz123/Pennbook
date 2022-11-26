import react, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import $ from "jquery"

const Signup = () => {
  const [errMessage, setErrMessage] = useState("")
  const [interests, setInterests] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    $("#interests_input").on("keypress", (e) => {
      if (e.which === 13) handleAdd()
    })

    $("#submit").on("click", () => {
      const first_name = $("#first_name").val()
      const last_name = $("#last_name").val()
      const username = $("#username").val()
      const email = $("#email").val()
      const password = $("#password").val()
      const birth_day = $("#birth_day").val()
      const birth_month = $("#birth_month").val()
      const birth_year = $("#birth_year").val()
      const birthday = birth_day + "-" + birth_month + "-" + birth_year
      const affiliation = $("#affiliation").val()
      const interest_list = getInterests()

      if (first_name.length === 0) {
        setErrMessage("First name cannot be empty")
      } else if (last_name.length === 0) {
        setErrMessage("Last name cannot be empty")
      } else if (username.length === 0) {
        setErrMessage("Username cannot be empty")
      } else if (email.length < 5 || !email.includes("@")) {
        setErrMessage("Please enter a valid email")
      } else if (password.length < 6 || !/\d/.test(password)) {
        setErrMessage("Password must be greater than 6 characters and contain at least one digit")
      } else if (birth_day.length > 2 || birth_day.length === 0 || /\D/.test(birth_day)) {
        // TODO: check birthday is valid
        setErrMessage("Please enter a valid birth day")
      } else if (birth_month.length > 2 || birth_month.length === 0 || /\D/.test(birth_month)) {
        setErrMessage("Please enter a valid birth month")
      } else if (birth_year.length !== 4 || /\D/.test(birth_year)) {
        setErrMessage("Please enter a valid birth year")
      } else if (affiliation.length === 0) {
        setErrMessage("Affiliation cannot be empty")
      } else if (interest_list.length === 0) {
        setErrMessage("Add at least 2 interests")
      } else {
        $.post("http://localhost:3000/signup", { username, password, first_name, last_name, email, affiliation, birthday, interests: interest_list }, (data, status) => {
          if (data === "err1") {
            setErrMessage("User already exists")
          } else if (data === "err2") {
            setErrMessage("error occured")
          } else {
            navigate("/home")
          }
        })
      }
    })
  }, [])

  getInterests = () => {
    return interests
  }

  handleAdd = () => {
    const interest = $("#interests_input").val()
    if (!interests.includes(interest)) {
      // TODO: Add a way to remove the interest
      setInterests((old) => [...old, interest])
    }
    $("#interests_input").val("")
  }

  return (
    <>
      <div className="container">
        <h1>Signup here:</h1>
        <form>
          <div className="form-floating mb-3">
            <input id="first_name" className="form-control" placeholder="First name" />
            <label className="text-secondary" htmlFor="floatingInput">
              First name
            </label>
          </div>
          <div className="form-floating mb-3">
            <input id="last_name" className="form-control" placeholder="Last name" />
            <label className="text-secondary" htmlFor="floatingInput">
              Last name
            </label>
          </div>
          <div className="form-floating mb-3">
            <input id="username" className="form-control" placeholder="Username" />
            <label className="text-secondary" htmlFor="floatingInput">
              Username
            </label>
          </div>
          <div className="form-floating mb-3">
            <input id="email" className="form-control" placeholder="Email" />
            <label className="text-secondary" htmlFor="floatingInput">
              Email
            </label>
          </div>
          <div className="form-floating mb-3">
            <input id="password" className="form-control" placeholder="Password" />
            <label className="text-secondary" htmlFor="floatingInput">
              Password
            </label>
          </div>
          <p>Birthday</p>
          <div className="input-group mb-3">
            <div className="form-floating mb-3">
              <input id="birth_day" className="form-control" placeholder="DD" />
              <label className="text-secondary" htmlFor="floatingInput">
                DD
              </label>
            </div>
            <div className="form-floating mb-3">
              <input id="birth_month" className="form-control" placeholder="MM" />
              <label className="text-secondary" htmlFor="floatingInput">
                MM
              </label>
            </div>
            <div className="form-floating mb-3">
              <input id="birth_year" className="form-control" placeholder="YY" />
              <label className="text-secondary" htmlFor="floatingInput">
                YY
              </label>
            </div>
          </div>
          <div className="form-floating mb-3 h-50">
            <input id="affiliation" className="form-control" placeholder="Affiliation" />
            <label className="text-secondary" htmlFor="floatingInput">
              Affiliation
            </label>
          </div>
          <div className="input-group mb-3">
            <div className="form-floating">
              <input id="interests_input" className="form-control" placeholder="Interests" />
              <label className="text-secondary" htmlFor="floatingInput">
                Interests
              </label>
            </div>
            <button id="add_interest" onClick={() => handleAdd()} className="btn btn-outline-secondary" type="button">
              Add
            </button>
          </div>
          {interests &&
            interests.map((elem) => {
              return (
                <>
                  <span className="p-2 mx-2 badge rounded-pill text-bg-primary">{elem}</span>
                </>
              )
            })}
          <br></br>
          <br></br>
          <button type="button" id="submit" className="btn btn-primary">
            Sign up
          </button>
          <Link className="mx-3" to="/">
            Login
          </Link>
          <p className="text-danger">{errMessage}</p>
        </form>
      </div>
    </>
  )
}

export default Signup
