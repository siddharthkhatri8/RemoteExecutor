const express = require("express");

const {
  submitCode,
  getMySubmissions,
} = require("../controllers/submissionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, submitCode);

router.get("/my", authMiddleware, getMySubmissions);

module.exports = router;