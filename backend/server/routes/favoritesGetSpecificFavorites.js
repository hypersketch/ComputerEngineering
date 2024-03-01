const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")
const newUserModel = require('../models/userModel')

router.get('/:username/:favorite', async (req, res) => {
    const username = req.params.username
    const favorite = req.params.favorite
    // must add inbound/outbound filter later
    const user = await newUserModel.findOne({username: username})
    if (!user){
        res.status(408).send("UserID not found")
        
    }else{
        const fav = await favoritesModel.find({username: username,
            favoriteName: favorite})
        /* if(!fav) : findOne() returns object or null. find() returns array of objects or empty array. 
        If inbound/outbound filter is implemented then findOne will be used with this "NOT NULL if statement"
        */
        if (fav.length==0){
            res.status(409).send("Favorite not found")
        } else{
            return res.json(fav)
        }

    }
    
    
    })
    

  module.exports = router;