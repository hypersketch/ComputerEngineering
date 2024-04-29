const express = require("express");
const router = express.Router();
const userModel = require('../models/userModel');
const commentsModel = require("../models/commentsModel");

router.get('/:username', async (req, res) => {
   const username = req.params.username;
   const comments = await commentsModel.find({username: username});
   return res.json(comments);
});

module.exports = router;