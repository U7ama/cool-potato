const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/signin",
  [body("email").isEmail(), body("password").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;

          res.json({
            msg: "User signed in successfully",
            token,
            userId: user.id,
            name: user.name,
            email: user.email,
          });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        email,
        password: hashedPassword,
        name,
      });

      const savedUser = await user.save();

      const payload = {
        user: {
          id: savedUser.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;

          res.json({
            msg: "User registered successfully",
            token,
            userId: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
          });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/update-profile/:userId",
  [
    auth,
    [
      body("fastFoodFrequency")
        .optional()
        .isIn(["Occasionally", "Frequently", "Rarely", "Never"]),
      body("lifestyle").optional(),
      body("isDiabetic").optional().isBoolean(),
    ],
  ],
  async (req, res) => {
    const { userId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { fastFoodFrequency, lifestyle, isDiabetic } = req.body;
      const updates = {};

      if (fastFoodFrequency) updates.fastFoodFrequency = fastFoodFrequency;
      if (lifestyle) updates.lifestyle = lifestyle;
      if (isDiabetic !== undefined) updates.isDiabetic = isDiabetic;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json({ msg: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
