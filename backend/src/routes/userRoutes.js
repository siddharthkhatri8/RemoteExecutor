const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    userId: req.user.userId,
  });
});

module.exports = router;