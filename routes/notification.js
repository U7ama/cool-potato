const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

// Route to get all notifications
router.get("/notifications", auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Route to add a new notification
router.post("/notifications", auth, async (req, res) => {
  const { title, message } = req.body;

  try {
    const newNotification = new Notification({
      title,
      message,
    });

    await newNotification.save();

    res.json({
      msg: "Notification added successfully",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error adding notification:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
