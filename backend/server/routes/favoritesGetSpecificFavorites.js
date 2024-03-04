const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")
const newUserModel = require('../models/userModel')

router.get('/:username/:favorite', async (req, res) => {
    const username = req.params.username
    const favoriteName = req.params.favorite
    
    const user = await newUserModel.findOne({username: username})
    if (!user){
        res.status(408).send("UserID not found")
        
    }else{
        const fav = await favoritesModel.findOne({username: username,
            favoriteName: favoriteName})
        if (!fav){
            res.status(409).send("Favorite not found")
        } else{
            return res.json(fav)
        }

    }
    
    
    })
    

  module.exports = router;