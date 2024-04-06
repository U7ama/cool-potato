const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  fastFoodFrequency: {
    type: String,
  },
  lifestyle: { type: String },
  isDiabetic: { type: Boolean },
});

module.exports = mongoose.model("User", userSchema);
