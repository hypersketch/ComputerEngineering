const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")
const newUserModel = require('../models/userModel')

router.delete('/deleteFavorite', async (req, res) => {
    
    const username= req.body.username
    const favoriteName= req.body.favoriteName
    const user = await newUserModel.findOne({username: username})
    if (!user){
        res.status(408).send("UserID not found")
        
    }else{
        const fav = await favoritesModel.findOne({username: username,
            favoriteName: favoriteName})
        if (!fav){
            res.status(409).send("Favorite not found")
        } else{
            // delete favorite
            await favoritesModel.findByIdAndDelete(fav)
            return res.json({success: "True"})
        }

    }

})
module.exports = router;