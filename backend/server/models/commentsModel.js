const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      label: "username",
    },
    userID: {
      type: String,
      required: true,
      label: "userID"
    },
    comment: {
        type: String,
        label: "comment"
      },
    image: {
        type: String,
        label: "image"
    }
  }
);


module.exports = mongoose.model('comments',commentsSchema)
