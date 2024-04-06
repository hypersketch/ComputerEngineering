const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")
const newUserModel = require('../models/userModel')

router.post('/create', async (req, res) => {
    const username= req.body.username
    const favoriteName= req.body.favoriteName
    const direction= req.body.direction

    const fav = await favoritesModel.findOne({ username: username , 
        favoriteName: favoriteName})
    if (fav){
        return res.status(450).send({ message: "This specific favorite already exists", status: res.statusCode })
    } else {
        if (!await newUserModel.findOne({username: username})){
            return res.status(408).send({message: "UserID not found"})
        }
    }


    const newFav = new favoritesModel({
        username: username,
        favoriteName: favoriteName,
        direction: direction
    }) 
    
    try {
        const saveNewFav = await newFav.save()
        
        res.send(saveNewFav)
    } catch (error) {
        res.status(410).send({message: "Failed to create new favorite", error: error
    })
    }
    })
  module.exports = router;