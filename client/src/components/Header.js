import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import Profile from "./icons/Profile";
const img = require("./penguin.png");

const Header = () => {
  const [user, setUser] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [foundUsers, setFoundUsers] = useState([])
  const [affiliation, setAffiliation] = useState()
  const [profileURL, setProfileURL] = useState("")
  const navigate = useNavigate()

	useEffect(() => {
    console.log("found the errror")
		if (searchTerm.length === 0) {
			setFoundUsers([]);
		} else {
			const delayDebounceFn = setTimeout(() => {
				if (searchTerm.length !== 0) {
					// Uncomment this when you want to test out the actual search
					$.post("http://localhost:80/searchUser", { username: searchTerm }, (data, status) => {
					  if (data !== "No users found") {
					    setFoundUsers(data)
					  }
					})

					// Dummy values to save AWS cost
					// setFoundUsers(["jren2", "test1", "test2"]);
				}
			}, 1000);

			return () => clearTimeout(delayDebounceFn);
		}
	}, [searchTerm]);

  useEffect(() => {
    console.log("FRIENDS HELLO")
    $.get("http://localhost:80/getUser", (data, status) => {
      setUser(data)
      $.post("http://localhost:80/getWallInformation", {user : data}, (information, status) => {
        setAffiliation(information.affiliation)
        setProfileURL(information.profile_url)
      })
    })
  }, [])

	const handleLogout = () => {
		$.post("http://localhost:80/logout", (data, status) => {});
	};

	const handleBlur = () => {
		// $("#found-field").css("visibility", "hidden")
	};

	const handleFocus = () => {
		$("#found-field").css("visibility", "visible");
	};

	const viewProfile = (profile) => {
		$("#found-field").css("visibility", "hidden");
		$("#search-input").val("");
		setSearchTerm("");
		setFoundUsers([]);
		navigate(`/wall?user=${profile}`);
	};

	return (
		<>
			<header className="p-3 mb-3 border-bottom">
				<div className="px-3 d-flex flex-wrap align-items-center row">
					<div className="col-2">
						<a
							href="/home"
							className="text-decoration-none d-inline align-baseline"
						>
							<img className="d-inline align-top" src={img} width="25"></img>
							<h3 className="text-dark d-inline mx-2">Pennbook</h3>
						</a>
					</div>
					<div className="col-2"></div>
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
              <div id="found-field" style={{ width: "29rem", zIndex: "50" }} className="mt-1 position-absolute top-100 bg-light p-3">
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
          <div className="col-3"></div>
          <div style={{ width: "auto" }} className="dropdown d-inline text-end ms-auto col-1">
            <div
              style={{ userSelect: "none", cursor: "pointer" }}
              className="d-block link-dark text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
                <img className="d-inline align-top rounded-circle mx-2" src={profileURL} width="35"></img>
            </div>
            <ul className="dropdown-menu">
              <li>
                <h5 className="mx-3 fw-bolder">{user}</h5>
              </li>
              <li>
                <a href={`/wall?user=${user}`} className="dropdown-item">
                  Wall
                </a>
              </li>
              <li>
                <a className="dropdown-item" href={`/visualizer?user=${user}&affiliation=${affiliation}`}>
                  Visualizer
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a onClick={() => handleLogout()} className="dropdown-item" href="/">
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header;
