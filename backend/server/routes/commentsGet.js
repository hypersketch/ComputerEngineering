const express = require("express");
const router = express.Router();
const userModel = require('../models/commentsModel');
const commentsModel = require("../models/commentsModel");

router.get('/:username', async (req, res) => {
    const userID = req.body.userID
    const username = await userModel.find();
    const comments = await commentsModel.find({userID: userID})
    return res.json(comments)
    
})
  module.exports = router;
