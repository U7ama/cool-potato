const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: false, unique: true, sparse: true },
  phone: { type: String, required: false, unique: true, sparse: true },
  profilePicture: { type: String, required: false },
  password: { type: String, required: true },
  fuid: { type: String, required: true },
  name: { type: String, required: true },
  fastFoodFrequency: {
    type: String,
  },
  lifestyle: { type: String },
  isDiabetic: { type: mongoose.Schema.Types.Mixed },
});

module.exports = mongoose.model("User", userSchema);
