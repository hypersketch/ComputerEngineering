const express = require("express");
const router = express.Router();
const commentsModel = require("../models/commentsModel")
const newPostModel = require('../models/userModel')

router.delete("/delete", async (req, res) => {  

    const userID = req.body.userID
    const username = req.body.username

    const com = await commentsModel.findOne({userID: userID,
        username: username})

    await commentsModel.findByIdAndDelete(com)

})

module.exports = router;