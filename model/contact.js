const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  names: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    // validate: [
    //   {
    //     validator: function (value) {
    //       const wordCount = value
    //         .split(" ")
    //         .filter((word) => word !== "").length;
    //       return wordCount >= 5 && wordCount <= 600;
    //     },
    //     message: "Le contenu doit contenir entre 5 et 126 mots.",
    //   },
    // ],
  },
});

module.exports = mongoose.model("message", messageSchema);
