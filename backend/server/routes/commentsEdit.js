const express = require("express");
const router = express.Router();
const commentsModel = require("../models/commentsModel")
const newUserModel = require('../models/userModel');

router.patch('/edit', async (req, res) => {

    const userID = req.params
    const updateComment = commentsModel.findByIdAndUpdate(req.params.userID, req.body)
    
})

module.exports = router;