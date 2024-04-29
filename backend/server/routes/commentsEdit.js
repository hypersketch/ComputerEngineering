const express = require("express");
const router = express.Router();
const commentsModel = require("../models/commentsModel");
const newUserModel = require('../models/userModel');

router.patch('/edit', async (req, res) => {
    const userID = req.body.userID;
    const newComment = req.body.comment;
    const newImage = req.body.image;

    try {
        const user = await commentsModel.findOne({ userID: userID });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.comment = newComment;
        user.image = newImage;
        await user.save();

        res.status(200).json({ message: "User comment and image updated successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;