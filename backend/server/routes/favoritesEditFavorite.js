const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")
const newUserModel = require('../models/userModel')

router.patch('/editFavorite', async (req, res) => {
    
    const username= req.body.username
    const favoriteName= req.body.favoriteName
    const direction = req.body.direction
    const user = await newUserModel.findOne({username: username})
    if (!user){
        res.status(408).send("UserID not found")
        
    }else{
        const fav = await favoritesModel.findOne({username: username,
            favoriteName: favoriteName})
        if (!fav){
            res.status(409).send("Favorite not found")
        } else{
            // edit favorite
            await favoritesModel.findByIdAndUpdate(fav, {direction: direction})
            // return updated resource
            const newFav = await favoritesModel.find({username: username})
            return res.json(newFav)
        }

    }

})
module.exports = router;