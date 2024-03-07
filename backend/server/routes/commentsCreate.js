const express = require("express");
const router = express.Router();
const commentsModel = require("../models/commentsModel")
const newUserModel = require('../models/userModel');
const { default: mongoose } = require("mongoose");

router.post('/create', async (req, res) => {
    
  const username = req.body.username
  const userID = req.body.userID
  const comment = req.body.comment
  const image = req.body.image
  const createNewComment = commentsModel({
    username: username,
    userID: userID,
    comment: comment,
    image: image
  })

  const saveNewComment = await createNewComment.save()
  res.send(saveNewComment)

    })
  module.exports = router;