const express = require('express')

const requestFriend = async (req, res) => {

}

const addFriend = async (req, res) => {
  const { username, friendUsername } = req.body
}

const removeFriend = async (req, res) => {
  const { username, friendUsername } = req.body

  //users db calls to get ids
  //friends db calls to remove from each's friends list
}