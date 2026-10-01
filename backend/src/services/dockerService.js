const Docker = require("dockerode");

const docker = new Docker();

const executeCode = async (language, code) => {
  const commands = {
    javascript: {
      file: "main.js",
      command: "node /workspace/main.js",
    },

    python: {
      file: "main.py",
      command: "python3 /workspace/main.py",
    },

    cpp: {
      file: "main.cpp",
      command:
        "g++ /workspace/main.cpp -o /workspace/main && /workspace/main",
    },

    java: {
      file: "Main.java",
      command:
        "cd /workspace && javac Main.java && java Main",
    },
  };

  const config = commands[language];

  if (!config) {
    throw new Error("Unsupported language");
  }

  if (typeof code !== "string" || code.length === 0) {
    throw new Error("Code is required");
  }

  // Prevent excessively large submissions.
  if (Buffer.byteLength(code, "utf8") > 100 * 1024) {
    throw new Error("Code exceeds the 100 KB limit");
  }

  // Encode source safely before passing it to the shell.
  const encodedCode = Buffer.from(code, "utf8").toString("base64");

  const container = await docker.createContainer({
    Image: "remote-executor-image",

    Cmd: [
      "sh",
      "-c",
      `mkdir -p /workspace && echo '${encodedCode}' | base64 -d > /workspace/${config.file} && ${config.command}`,
    ],

    WorkingDir: "/workspace",

    HostConfig: {
      Memory: 128 * 1024 * 1024,
      NanoCpus: 500000000,
      NetworkMode: "none",
      AutoRemove: false,
    },
  });

  let timedOut = false;

  try {
    await container.start();

    const timeout = setTimeout(async () => {
      timedOut = true;

      try {
        await container.kill();
      } catch (error) {
        // Container may have already exited.
      }
    }, 5000);

    const result = await container.wait();

    clearTimeout(timeout);

    const logs = await container.logs({
      stdout: true,
      stderr: true,
    });

    if (timedOut) {
      return {
        output: "Execution timed out after 5 seconds.",
        exitCode: 124,
      };
    }

    return {
      output: logs.toString(),
      exitCode: result.StatusCode,
    };
  } finally {
    try {
      await container.remove({
        force: true,
      });
    } catch (error) {
      // Ignore cleanup errors.
    }
  }
};

module.exports = {
  executeCode,
};