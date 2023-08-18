const mongoose = require("mongoose");
const unique_validator = require("mongoose-unique-validator");
const subscribeSchema = mongoose.Schema(
  {
    names: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    audio: {
      type: String,
      trim: true,
    },
    video: {
      type: String,
      trim: true,
    },
    generateId: {
      type: String,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
subscribeSchema.plugin(unique_validator);

module.exports = mongoose.model("subscribe", subscribeSchema);
