const Docker = require("dockerode");

const docker = new Docker();

const executeCode = async (language, code, input = "") => {
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

  if (Buffer.byteLength(code, "utf8") > 100 * 1024) {
    throw new Error("Code exceeds the 100 KB limit");
  }

  if (Buffer.byteLength(input, "utf8") > 50 * 1024) {
    throw new Error("Input exceeds the 50 KB limit");
  }

  const encodedCode = Buffer.from(code, "utf8").toString("base64");
  const encodedInput = Buffer.from(input, "utf8").toString("base64");

  const container = await docker.createContainer({
    Image: "remote-executor-image",

    Cmd: [
      "sh",
      "-c",
      `
      mkdir -p /workspace &&
      echo '${encodedCode}' | base64 -d > /workspace/${config.file} &&
      echo '${encodedInput}' | base64 -d > /workspace/input.txt &&
      ${config.command} < /workspace/input.txt
      `,
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
  let timeout;

  try {
    await container.start();

    timeout = setTimeout(async () => {
      timedOut = true;

      try {
        await container.kill();
      } catch (error) {
        // Container may already have exited.
      }
    }, 5000);

    const result = await container.wait();

    clearTimeout(timeout);

    const logs = await container.logs({
      stdout: true,
      stderr: true,
    });

    const output = logs.toString();

    if (timedOut) {
      return {
        output: "Execution timed out after 5 seconds.",
        exitCode: 124,
      };
    }

    return {
      output,
      exitCode: result.StatusCode,
    };
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }

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