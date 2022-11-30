import { useState, useEffect } from "react"
import Edit from "./icons/Edit"
import $ from "jquery"
import Header from "./Header"
import AddFriend from "./icons/AddFriend"
import AddedFriend from "./icons/AddedFriend"

const Wall = () => {
  const [visitingUser, setVisitingUser] = useState("")
  const [data, setData] = useState({})
  const [isFriend, setIsFriend] = useState()
  const [toggles, setToggles] = useState([false, false, false])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const user = params.get("user")

    $.post("http://localhost:3000/getWallInformation", { user }, (data, status) => {
      setData(data)
    })

    $.get("http://localhost:3000/getUser", (data, status) => {
      setVisitingUser(data)
    })
  }, [])

  useEffect(() => {
    $("#edit-affiliation").on("click", () => {
      changeToggles(0)
    })
    $("#edit-email").on("click", () => {
      changeToggles(1)
    })
    $("#edit-password").on("click", () => {
      changeToggles(2)
    })
    if (visitingUser.length !== 0) {
      $.post("http://localhost:3000/getFriends", { username: visitingUser }, (friends_data, status) => {
        let check_friend = false
        friends_data.forEach((elem) => {
          if (elem.receiver.S === data.username) {
            check_friend = true
          }
        })
        setIsFriend(check_friend)
      })
    }
  }, [visitingUser])

  useEffect(() => {
    $("#add-friend").on("click", () => {
      addFriend()
    })
    $("#remove-friend").on("click", () => {
      removeFriend()
    })
  }, [isFriend])

  useEffect(() => {
    $("#change-affiliation").on("click", () => {
      changeItem(0)
    })
  }, [toggles[0]])

  useEffect(() => {
    $("#change-email").on("click", () => {
      changeItem(1)
    })
  }, [toggles[1]])

  useEffect(() => {
    $("#change-password").on("click", () => {
      changeItem(2)
    })
  }, [toggles[2]])

  const changeToggles = (event) => {
    const curr = [...toggles]
    curr[event] = !curr[event]
    setToggles(curr)
  }

  const addFriend = () => {
    $.post("http://localhost:3000/addFriend", { sender: visitingUser, receiver: data.username }, (data, status) => {
      if (data === "error") {
        console.log("error")
      } else {
        setIsFriend(true)
        console.log("successfully added friend")
      }
    })
  }

  const removeFriend = () => {
    console.log("Removing friend")
    $.post("http://localhost:3000/removeFriend", { sender: visitingUser, receiver: data.username }, (data, status) => {
      if (data === "error") {
        console.log("error")
      } else {
        setIsFriend(false)
        console.log("successfully removed friend")
      }
    })
  }

  changeItem = (item) => {
    var newItem = ""
    switch (item) {
      case 0:
        newItem = "affiliation"
        break
      case 1:
        newItem = "email"
        break
      case 2:
        newItem = "password"
        break
      default:
        newItem = ""
        break
    }
    const itemValue = $(`#${newItem}-input`).val()
    newItem = newItem.charAt(0).toUpperCase() + newItem.slice(1)
    if (itemValue.length === 0) {
      alert(`${newItem} must be greater than length 0`)
    } else {
      $.post(`http://localhost:3000/change${newItem}`, { username: data.username, affiliation: itemValue, email: itemValue, password: itemValue }, (dataResponse, status) => {
        newItem = newItem.toLowerCase()
        if (dataResponse === `${newItem} updated successfully`) {
          const newData = { ...data }
          switch (item) {
            case 0:
              newData.affiliation = itemValue
              changeToggles(0)
              break
            case 1:
              newData.email = itemValue
              changeToggles(1)
              break
            case 2:
              newData.password = itemValue
              changeToggles(2)
              break
          }
          setData(newData)
        } else {
          alert(`Update ${newItem} failed`)
        }
      })
    }
  }

  return (
    <>
      <Header></Header>
      <div className="container">
        <div className="row">
          <div className="col text-center">News Articles</div>
          <div className="col-6  text-center">
            <div className="container py-3">
              <div className="mb-3">
                <label htmlFor="exampleFormControlTextarea1" className="form-label">
                  Make a post!
                </label>
                <textarea className="form-control w-75 m-auto"></textarea>
              </div>
            </div>
          </div>
          <div className="col">
            <h3 className="text-center">
              {data.first_name} {data.last_name}
              {visitingUser !== data.username && (
                <>
                  {isFriend && (
                    <>
                      <a href="#" id="remove-friend">
                        <AddedFriend></AddedFriend>
                      </a>
                    </>
                  )}
                  {!isFriend && (
                    <>
                      <a href="#" id="add-friend">
                        <AddFriend></AddFriend>
                      </a>
                    </>
                  )}
                </>
              )}
            </h3>
            <div className="text-secondary fw-light fs-7">Affiliation:</div>
            <div className="fs-6 mb-2 fw-semibold">
              {data.affiliation}
              &nbsp;
              {visitingUser === data.username && (
                <a href="#" id="edit-affiliation">
                  <Edit></Edit>
                </a>
              )}
            </div>
            {toggles[0] && (
              <>
                <div class="input-group mb-3">
                  <input id="affiliation-input" type="text" class="form-control" placeholder="Change Affiliation" />
                  <button type="button" id="change-affiliation" class="input-group-text">
                    Confirm
                  </button>
                </div>
              </>
            )}
            <div className="text-secondary fw-light fs-7">Birthday:</div>
            <div className="fs-6 mb-2 fw-semibold">{data.birthday}</div>
            <div className="text-secondary fw-light fs-7">Email:</div>
            <div className="fs-6 mb-2 fw-semibold">
              {data.email} &nbsp;
              {visitingUser === data.username && (
                <a href="#" id="edit-email">
                  <Edit></Edit>
                </a>
              )}
            </div>
            {toggles[1] && (
              <>
                <div class="input-group mb-3">
                  <input id="email-input" type="text" class="form-control" placeholder="Change Email" />
                  <button type="button" id="change-email" class="input-group-text">
                    Confirm
                  </button>
                </div>
              </>
            )}
            <div className="text-secondary fw-light fs-7">Username:</div>
            <div className="fs-6 mb-2 fw-semibold">{data.username}</div>
            <div className="text-secondary fw-light fs-7">Password:</div>
            <div className="fs-6 mb-2 fw-semibold">
              ****** &nbsp;
              {visitingUser === data.username && (
                <a href="#" id="edit-password">
                  <Edit></Edit>
                </a>
              )}
            </div>
            {toggles[2] && (
              <>
                <div class="input-group mb-3">
                  <input id="password-input" type="text" class="form-control" placeholder="Change Password" />
                  <button type="button" id="change-password" class="input-group-text">
                    Confirm
                  </button>
                </div>
              </>
            )}
            <div className="text-secondary fw-light mb-2 fs-7">Interests:</div>
            {data.interests &&
              data.interests.map((elem) => {
                return (
                  <>
                    <span className="p-2 me-2 badge rounded-pill text-bg-secondary">{elem}</span>
                  </>
                )
              })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Wall
