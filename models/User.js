const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: false, unique: true },
  phone: { type: String, required: false, unique: true },
  profilePicture: { type: String, required: false },
  password: { type: String, required: true },
  fuid: { type: String, required: true },
  name: { type: String, required: true },
  fastFoodFrequency: {
    type: String,
  },
  lifestyle: { type: String },
  isDiabetic: { type: Boolean },
});

module.exports = mongoose.model("User", userSchema);
