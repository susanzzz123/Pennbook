import { useState } from "react"

const img = require("./penguin.png")
const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleClick = () => {
    console.log(showDropdown)
    setShowDropdown(!showDropdown)
  }

  return (
    <>
      <header class="p-3 mb-3 border-bottom">
        <div class="px-3 d-flex flex-wrap align-items-center row">
          <div class="d-flex flex-wrap align-items-center justify-content-left col">
            <img class="d-flex justify-content-left" src={img} width="25"></img>
            <h3 class="text-center mb-0 mx-2">Pennbook</h3>
          </div>

          <div class="d-flex mx-auto col">
            <form class="col-12">
              <input type="search" class="form-control" placeholder="Search..." aria-label="Search" />
            </form>
          </div>

          <div onClick={handleClick} class="dropdown text-end ms-auto col">
            <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
              <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle" />
            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" href="#">
                  Action
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">
                  Another action
                </a>
              </li>
              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item" href="#">
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

export default Home
