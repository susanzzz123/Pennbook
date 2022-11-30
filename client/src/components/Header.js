import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import $ from "jquery"
import Profile from "./icons/Profile"
const img = require("./penguin.png")

const Header = () => {
  const [user, setUser] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [foundUsers, setFoundUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (searchTerm.length === 0) {
      setFoundUsers([])
    } else {
      const delayDebounceFn = setTimeout(() => {
        if (searchTerm.length !== 0) {
          // Uncomment this when you want to test out the actual search
          // $.post("http://localhost:3000/searchUser", { username: searchTerm }, (data, status) => {
          //   if (data !== "No users found") {
          //     setFoundUsers(data)
          //   }
          // })

          // Dummy values to save AWS cost
          setFoundUsers(["jren2", "test1", "test2"])
        }
      }, 2000)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [searchTerm])

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      setUser(data)
    })
  }, [])

  const handleBlur = () => {
    // $("#found-field").css("visibility", "hidden")
  }

  const handleFocus = () => {
    $("#found-field").css("visibility", "visible")
  }

  const viewProfile = (profile) => {
    $("#found-field").css("visibility", "hidden")
    $("#search-input").val("")
    setSearchTerm("")
    setFoundUsers([])
    navigate(`/wall?user=${profile}`)
  }

  return (
    <>
      <header className="p-3 mb-3 border-bottom">
        <div className="px-3 d-flex flex-wrap align-items-center row">
          <a href="/home" className="text-decoration-none d-inline flex-wrap align-items-center justify-content-left col">
            <img className="d-flex justify-content-left" src={img} width="25"></img>
            <h3 className="text-center mb-0 mx-2">Pennbook</h3>
          </a>

          <div className="position-relative d-inline mx-auto col">
            <input
              id="search-input"
              onBlur={() => handleBlur()}
              onFocus={() => handleFocus()}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="search"
              className="form-control"
              placeholder="Search for users..."
              aria-label="Search"
            />
            {foundUsers.length > 0 && (
              <div id="found-field" style={{ width: "29rem" }} className="z-10 mt-1 position-absolute top-100 bg-light p-3">
                {foundUsers.map((elem) => (
                  <a href={`/wall?user=${elem}`} className="text-decoration-none  pe-auto row my-1">
                    <div className="z-50 d-flex col-1 align-items-center">
                      <Profile></Profile>
                    </div>
                    <div style={{ marginLeft: "-1rem" }} className=" col-11">
                      {elem}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div style={{ width: "auto" }} className="dropdown d-inline text-end ms-auto col">
            <a href={`/wall?user=${user}`} className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              {user}
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Something else here
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
