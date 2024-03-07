const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")
const newUserModel = require("../models/userModel")

router.get('/:username', async (req, res) => {
    const username = req.params.username
    const fav = await favoritesModel.find({username: username})
    const user = await newUserModel.findOne({username: username})
    if (!user){
        res.status(408).send("UserID not found")
        
    }else{
    return res.json(fav)
    }
    })
  module.exports = router;