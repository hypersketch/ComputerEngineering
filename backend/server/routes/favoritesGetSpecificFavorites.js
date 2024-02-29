const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")

router.get('/:username/:favorite', async (req, res) => {
    const username = req.params.username
    const favorite = req.params.favorite
    const fav = await favoritesModel.find({username: username,
        favoriteName: favorite}
        )
    
    return res.json(fav)
    })
  module.exports = router;