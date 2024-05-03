const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const admin = require("../config/firebaseAdmin");

const router = express.Router();

async function uploadImageToStorage(imageBase64) {
  if (imageBase64) {
    try {
      const imageBuffer = Buffer.from(imageBase64, "base64");
      const fileName = `images/${Date.now()}.jpg`; // or any desired file extension
      const file = admin.storage().bucket().file(fileName);
      await file.save(imageBuffer, { contentType: "image/jpeg" });

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "01-01-2500",
      });
      return url;
    } catch (error) {
      console.error("Error uploading image to storage:", error);
      throw error;
    }
  }
  return "No image base64 provided.";
}

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
    body("email").optional().isEmail().withMessage("Invalid email"),
    body("phone")
      .optional()
      .isMobilePhone()
      .withMessage("Invalid phone number"),
    body("password").isLength({ min: 6 }),
    body("name").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, phone, password, name } = req.body;

      // Check if both email and phone are provided
      if (email && phone) {
        return res
          .status(400)
          .json({ msg: "Provide either email or phone, not both" });
      }

      // Check if the user already exists for either email or phone
      let user;
      if (email) {
        user = await User.findOne({ email });
      } else if (phone) {
        user = await User.findOne({ phone });
      }

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      let userRecord;

      // Create user with either email or phone based on provided data
      if (email) {
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: name,
        });
      } else if (phone) {
        userRecord = await admin.auth().createUser({
          phoneNumber: phone,
          password,
          displayName: name,
        });
      }

      if (!userRecord) {
        return res.status(500).json({ msg: "Failed to create user" });
      }

      const userId = userRecord.uid;

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        email,
        phone,
        fuid: userId,
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
            phone: savedUser.phone,
          });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error", error.message);
    }
  }
);

router.post("/signin", [body("email").isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ msg: "Invalid Credentials" });
    // }

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
          msg: "Token generated successfully",
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
});

router.post("/generate-token", [body("email").isEmail()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ msg: "Invalid Credentials" });
    // }

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
          msg: "Token generated successfully",
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
});

router.post("/reset-password", async (req, res) => {
  const { newPassword, fuid, email } = req.body;

  try {
    // Reset password in Firebase Authentication
    await admin.auth().updateUser(fuid, { password: newPassword });

    // Update password in MongoDB
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ msg: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ msg: "Failed to reset password" });
  }
});

router.put(
  "/update-profile/:userId",
  [
    auth,
    [
      body("name").optional().not().isEmpty(),
      body("phone").optional().isMobilePhone(),
      body("profilePicture").optional(),
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
      const {
        fastFoodFrequency,
        lifestyle,
        isDiabetic,
        name,
        phone,
        profilePicture,
      } = req.body;
      const updates = {};

      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (fastFoodFrequency) updates.fastFoodFrequency = fastFoodFrequency;
      if (lifestyle) updates.lifestyle = lifestyle;
      if (isDiabetic !== undefined) updates.isDiabetic = isDiabetic;

      if (profilePicture) {
        let imageUrl;
        if (profilePicture.startsWith("https")) {
          imageUrl = profilePicture;
        } else {
          imageUrl = await uploadImageToStorage(profilePicture);
        }
        updates.profilePicture = imageUrl;
      }

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

router.put(
  "/change-password",
  [
    auth,
    body("currentPassword").not().isEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Find the user by ID
      const user = await User.findById(userId);

      // Check if current password matches
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      user.password = hashedPassword;
      await user.save();

      res.json({ msg: "Password updated successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
