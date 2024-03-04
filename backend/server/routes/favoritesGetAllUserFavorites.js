const express = require("express");
const router = express.Router();
const favoritesModel = require("../models/favoritesModel")

router.get('/:username', async (req, res) => {
    const username = req.params.username
    const fav = await favoritesModel.find({username: username})
    
    return res.json(fav)
    })
  module.exports = router;