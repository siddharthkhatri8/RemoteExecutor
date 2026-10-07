const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    language: {
      type: String,
      enum: ["javascript", "python", "cpp", "java"],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit"],
      required: true,
    },

    passedTests: {
      type: Number,
      required: true,
    },

    totalTests: {
      type: Number,
      required: true,
    },

    executionTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Submission", submissionSchema);