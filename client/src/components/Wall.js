import { useState, useEffect } from "react"
import Edit from "./icons/Edit"
import $ from "jquery"
import Header from "./Header"
import Post from "./Post"
import AddFriend from "./icons/AddFriend"
import AddedFriend from "./icons/AddedFriend"
import DeleteButton from "./icons/DeleteButton"

const Wall = () => {
  const [visitingUser, setVisitingUser] = useState("")
  const [data, setData] = useState({})
  const [isFriend, setIsFriend] = useState()
  const [toggles, setToggles] = useState([false, false, false, false])
  const [type, setType] = useState("Post type")
  const [content, setContent] = useState("")
  const [allPosts, setAllPosts] = useState([])
  const [postMsg, setPostMsg] = useState(false)

  const params = new URLSearchParams(window.location.search)
  const user = params.get("user")
  useEffect(() => {
    $.post("http://localhost:3000/getWallInformation", { user }, (data, status) => {
      setData(data)
    })

    $.get("http://localhost:3000/getUser", (data, status) => {
      setVisitingUser(data)
    })
  }, [])

  useEffect(() => {
    $.post("http://localhost:3000/getPosts", { username: user }, (data, status) => {
      if (data !== "no posts") {
        setAllPosts(data)
      } else {
        //error message for display
        console.log("error while retrieving posts")
      }
    })
    if (visitingUser.length !== 0) {
      $.post("http://localhost:3000/getFriends", { username: visitingUser }, (friends_data, status) => {
        let check_friend = false
        if (friends_data !== "user has no friends") {
          friends_data.forEach((elem) => {
            if (elem.receiver.S === data.username) {
              check_friend = true
            }
          })
        }
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

  useEffect(() => {
    $("#change-interests").on("click", () => {
      changeItem(3)
    })
  }, [toggles[3]])

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
      case 3:
        newItem = "interests"
        break
      default:
        newItem = ""
        break
    }
    const itemValue = $(`#${newItem}-input`).val()
    console.log(itemValue)
    newItem = newItem.charAt(0).toUpperCase() + newItem.slice(1)
    if (itemValue.length === 0) {
      alert(`${newItem} must be greater than length 0`)
    } else {
      if (newItem !== "Interests") {
        $.post(`http://localhost:3000/change${newItem}`, 
        {
          username: data.username,
          affiliation: itemValue,
          email: itemValue,
          password: itemValue 
        }, (dataResponse, status) => {
          newItem = newItem.toLowerCase()
          if (dataResponse === `${newItem} updated successfully`) {
            const newData = { ...data }
            switch (item) {
              case 0:
                newData.affiliation = itemValue
                changeToggles(0)
                const now = `${Date.now()}`
                const name = data.username
                $.post("http://localhost:3000/addPost",
                {
                  username: name,
                  wall: name,
                  post_id: now,
                  author: name,
                  type: "Status Update",
                  content: `${name} updated their affiliation to ${itemValue}`
                }, (data, status) => {
                  if (data !== "Success") {
                    console.log(data)
                  } else {
                    const postObj = {
                      author: {S: name},
                      content: {S: `${name} updated their affiliation to ${itemValue}`},
                      post_id: {N: now},
                      type: {S: "Status Update"},
                      username: {S: name},
                      wall: {S: name}
                    }
                    let newAllPosts = [postObj]
                    newAllPosts = newAllPosts.concat(allPosts)
                    setAllPosts([...newAllPosts])
                  }
                })
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
      } else {
        $.post("http://localhost:3000/addInterest", {username: data.username, newInterest: itemValue}, (dataResponse, status) => {
          if (dataResponse === "Success") {
            const newData = { ...data }
            let newInterest = data.interests
            newInterest.push(itemValue)
            newData.interests = [...newInterest]
            setData(newData)
            changeToggles(3)
            const now = `${Date.now()}`
            const name = data.username
            $.post("http://localhost:3000/addPost",
            {
              username: name,
              wall: name,
              post_id: now,
              author: name,
              type: "Status Update",
              content: `${name} is now interested in ${itemValue}`
            }, (data, status) => {
              if (data !== "Success") {
                console.log(data)
              } else {
                const postObj = {
                  author: {S: name},
                  content: {S: `${name} is now interested in ${itemValue}`},
                  post_id: {N: now},
                  type: {S: "Status Update"},
                  username: {S: name},
                  wall: {S: name}
                }
                let newAllPosts = [postObj]
                newAllPosts = newAllPosts.concat(allPosts)
                setAllPosts([...newAllPosts])
              }
            })
          } else {
            alert(`Update ${newItem} failed`)
          }
        })
      }
    }
  }

  const deleteInterest = async (elem) => {
    $.post("http://localhost:3000/deleteInterest", {username: data.username, interest: elem}, (dataResponse, status) => {
          if (dataResponse === "Success") {
            const newData = { ...data }
            const newInterest = data.interests
            const idx = newInterest.indexOf(elem)
            newInterest.splice(idx, 1)
            newData.interests = [...newInterest]
            setData(newData)
            const now = `${Date.now()}`
            const name = data.username
            $.post("http://localhost:3000/addPost",
            {
              username: name,
              wall: name,
              post_id: now,
              author: name,
              type: "Status Update",
              content: `${name} is no longer interested in ${elem}`
            }, (data, status) => {
              if (data !== "Success") {
                console.log(data)
              } else {
                const postObj = {
                  author: {S: name},
                  content: {S: `${name} is no longer interested in ${elem}`},
                  post_id: {N: now},
                  type: {S: "Status Update"},
                  username: {S: name},
                  wall: {S: name}
                }
                let newAllPosts = [postObj]
                newAllPosts = newAllPosts.concat(allPosts)
                setAllPosts([...newAllPosts])
              }
            })
          } else {
            alert(`Update interest failed`)
          }
        })
  }

  const handleSelectPost = () => {
    setType("Post")
  }

  const handleSelectStatus = () => {
    setType("Status Update")
  }

  const handlePost = async () => {
    const name = data.username
    const now = `${Date.now()}`
    $.post("http://localhost:3000/addPost",
    {
      username: name,
      author: visitingUser,
      post_id: now,
      type,
      content
    }, (data, status) => {
      if (data === "Post type is required") {
        setPostMsg(true)
      } else if (data !== "Success") {
        setPostMsg(false)
        alert(`Error while posting`)
      } else {
        setPostMsg(false)
        const postObj = {
          author: {S: visitingUser},
          content: {S: content},
          post_id: {N: now},
          type: {S: type},
          username: {S: name},
          wall: {S: name}
        }
        let newAllPosts = [postObj]
        newAllPosts = newAllPosts.concat(allPosts)
        setAllPosts([... newAllPosts])
      }
    })
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
                <textarea className="form-control w-75 m-auto" onChange={(e) => setContent(e.target.value)}></textarea>
                <div className="dropdown mt-2">
                  <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {type}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" onClick={() => handleSelectPost()}>
                        Post
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" onClick={() => handleSelectStatus()}>
                        Status Update
                      </a>
                    </li>
                  </ul>
                </div>
                {
                  postMsg && <div className="text-danger">Post type is required</div>
                }
                <button type="button" className="btn btn-primary mt-2" onClick={() => handlePost()}>
                  Post
                </button>
              </div>
              <div className="col-8">
                {allPosts.map((post) => (
                  <Post
                    user={post.author.S}
                    wall={post.wall.S}
                    content={post.content.S}
                    type={post.type.S}
                    date={parseInt(post.post_id.N)}
                    visitingUser={visitingUser}>
                  </Post>
                ))}
              </div>
            </div>
          </div>
          <div className="col">
            <h3 className="text-center">
              {data.first_name} {data.last_name}
              {visitingUser != data.username && (
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
                <span style={{ cursor: "pointer" }} onClick={() => changeToggles(0)}>
                  <Edit></Edit>
                </span>
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
                <span style={{ cursor: "pointer" }} onClick={() => changeToggles(1)}>
                  <Edit></Edit>
                </span>
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
                <span style={{ cursor: "pointer" }} onClick={() => changeToggles(2)}>
                  <Edit></Edit>
                </span>
              )}
            </div>
            {toggles[2] && (
              <>
                <div class="input-group mb-3">
                  <input id="password-input" type="text" class="form-control" placeholder="Change Password:" />
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
                    <span className="p-2 me-2 badge rounded-pill text-bg-secondary">
                      {elem}&nbsp;
                      <span style={{ cursor: "pointer" }} onClick={() => deleteInterest(elem)}>
                        <DeleteButton></DeleteButton>
                      </span>
                    </span>
                  </>
                )
              })}
              {visitingUser === data.username && (
                <span style={{ cursor: "pointer" }} onClick={() => changeToggles(3)}>
                  <Edit></Edit>
                </span>
              )}
              {toggles[3] && (
              <>
                <div class="input-group mb-3">
                  <input id="interests-input" type="text" class="form-control" placeholder="Add Interest:" />
                  <button type="button" id="change-interests" class="input-group-text">
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Wall
