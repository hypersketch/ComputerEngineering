const express = require("express");
const router = express.Router();
const commentsModel = require("../models/commentsModel")
const newPostModel = require('../models/userModel');
const userModel = require("../models/userModel");

router.delete("/delete", async (req, res) => {  

    const { username, userID } = req.body;

    const comExist = await commentsModel.findOne({ username, userID });

    if (!comExist) {
        return res.status(404).json({ error: 'Comment not found' });
    }

    await commentsModel.findByIdAndDelete(comExist._id);


})

module.exports = router;