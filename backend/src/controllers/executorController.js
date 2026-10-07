const { executeCode } = require("../services/dockerService");

const runCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        message: "Language and code are required",
      });
    }

    const result = await executeCode(
      language,
      code,
      input || ""
    );

    res.json(result);
  } catch (error) {
    console.error("Execution error:", error);

    res.status(500).json({
      message: error.message || "Code execution failed",
    });
  }
};

module.exports = {
  runCode,
};