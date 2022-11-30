const db = require("../models/database")

const updateTimestamp = async (req, res) => {
  const { username } = req.body

  db.update_timestamp(username, function (err, data) {
    if (err || data === "user not found") {
      res.send("err1")
    } else {
      res.send("updated timestamp")
    }
  })
}

const getTimestamp = async (req, res) => {
  const { username } = req.body

  db.get_timestamp(username, function (err, data) {
    if (err || data === "user not found") {
      res.send("err1")
    } else {
      res.send(data)
    }
  })
}

const registration_routes = {
  update_timestamp: updateTimestamp,
}

module.exports = registration_routes
