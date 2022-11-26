import { useState, useEffect } from "react"
import $ from "jquery"
const img = require("./penguin.png")

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [user, setUser] = useState("")

  useEffect(() => {
    $.get("http://localhost:3000/getUser", (data, status) => {
      setUser(data)
    })
  }, [])

  const handleClick = () => {
    setShowDropdown(!showDropdown)
  }
  return (
    <>
      <header className="p-3 mb-3 border-bottom">
        <div className="px-3 d-flex flex-wrap align-items-center row">
          <a href="/home" className="text-decoration-none d-flex flex-wrap align-items-center justify-content-left col">
            <img className="d-flex justify-content-left" src={img} width="25"></img>
            <h3 className="text-center mb-0 mx-2">Pennbook</h3>
          </a>

          <div className="d-flex mx-auto col">
            <form className="col-12">
              <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
            </form>
          </div>

          <div onClick={handleClick} className="dropdown text-end ms-auto col">
            {user}
            <a href={`/wall?user=${user}`} className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" />
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
