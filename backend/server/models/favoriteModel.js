const mongoose = require("mongoose");

const newFavoritesSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    favoriteName: {
      type: String,
      required: true,
      label: "favoriteName",
    },
    direction: {
      type: String,
      required: true,
      label: "direction",
    }
  }
);
module.exports = mongoose.model('favorites', newFavoritesSchema)