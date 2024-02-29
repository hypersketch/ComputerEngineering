const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")

router.post('/create', async (req, res) => {
    const username= req.body.username
    const favoriteName= req.body.favoriteName
    const direction= req.body.direction

    const fav = await favoritesModel.findOne({ username: username , 
        favoriteName: favoriteName, 
        direction: direction})
    if (fav)
        return res.status(407).send({ message: "This specific favorite already exists", status: res.statusCode })


    const newFav = new favoritesModel({
        username: username,
        favoriteName: favoriteName,
        direction: direction
    })

    try {
        const saveNewFav = await newFav.save()
        
        res.send(saveNewFav)
    } catch (error) {
        res.status(408).send({message: "Failed to create new favorite",
    })
    }
    })
  module.exports = router;