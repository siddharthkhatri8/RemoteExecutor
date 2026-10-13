const Submission = require("../models/Submission");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const submissions = await Submission.find({
      user: userId,
    })
      .populate("problem", "title difficulty")
      .sort({ createdAt: -1 });

    const totalSubmissions = submissions.length;

    const acceptedSubmissions = submissions.filter(
      (submission) => submission.status === "Accepted"
    ).length;

    const solvedProblems = new Set(
      submissions
        .filter((submission) => submission.status === "Accepted")
        .map((submission) => submission.problem?._id.toString())
    );

    const successRate =
      totalSubmissions === 0
        ? 0
        : Math.round(
            (acceptedSubmissions / totalSubmissions) * 100
          );

    res.json({
      totalSubmissions,
      acceptedSubmissions,
      solvedProblems: solvedProblems.size,
      successRate,
      recentSubmissions: submissions.slice(0, 10),
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
};

module.exports = {
  getDashboard,
};