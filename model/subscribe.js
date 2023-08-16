const mongoose = require("mongoose");
const unique_validator = require("mongoose-unique-validator");
const subscribeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
subscribeSchema.plugin(unique_validator);

module.exports = mongoose.model("subscribe", subscribeSchema);
