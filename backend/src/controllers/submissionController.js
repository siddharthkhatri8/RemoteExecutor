const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const { executeCode } = require("../services/dockerService");

const submitCode = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        message: "Problem, language and code are required",
      });
    }

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(404).json({
        message: "Problem not found",
      });
    }

    const testCases = problem.testCases || [];

    let passedTests = 0;
    let status = "Accepted";

    for (const testCase of testCases) {
      try {
        const result = await executeCode(
          language,
          code,
          testCase.input
        );

        const actualOutput = (result.output || "")
          .trim()
          .replace(/\r\n/g, "\n");

        const expectedOutput = (testCase.expectedOutput || "")
          .trim()
          .replace(/\r\n/g, "\n");

        if (result.exitCode === 124) {
          status = "Time Limit";
          break;
        }

        if (result.exitCode !== 0) {
          status = "Runtime Error";
          break;
        }

        if (actualOutput !== expectedOutput) {
          status = "Wrong Answer";
          break;
        }

        passedTests++;
      } catch (error) {
        status = "Runtime Error";
        break;
      }
    }

    const submission = await Submission.create({
      user: req.user.userId,
      problem: problemId,
      language,
      code,
      status,
      passedTests,
      totalTests: testCases.length,
    });

    res.status(201).json({
      message: "Submission evaluated",
      submission,
    });
  } catch (error) {
    console.error("Submission error:", error);

    res.status(500).json({
      message: "Submission failed",
    });
  }
};

const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.userId,
    })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error("Submission history error:", error);

    res.status(500).json({
      message: "Failed to fetch submissions",
    });
  }
};

module.exports = {
  submitCode,
  getMySubmissions,
};