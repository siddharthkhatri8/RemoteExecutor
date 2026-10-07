import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditorComponent from "@monaco-editor/react";
import api from "../services/api";

const languageConfig = {
  javascript: {
    monacoLanguage: "javascript",
    starterCode: `console.log("Hello, RemoteExecutor!");`,
  },

  python: {
    monacoLanguage: "python",
    starterCode: `print("Hello, RemoteExecutor!")`,
  },

  cpp: {
    monacoLanguage: "cpp",
    starterCode: `#include <iostream>

int main() {
    std::cout << "Hello, RemoteExecutor!" << std::endl;
    return 0;
}`,
  },

  java: {
    monacoLanguage: "java",
    starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, RemoteExecutor!");
    }
}`,
  },
};

const Editor = () => {
  const { problemId } = useParams();

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(
    languageConfig.python.starterCode
  );

  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(false);

  useEffect(() => {
    if (!problemId) {
      return;
    }

    const fetchProblem = async () => {
      try {
        setLoadingProblem(true);

        const response = await api.get(
          `/api/problems/${problemId}`
        );

        setProblem(response.data);

        setCode(languageConfig.python.starterCode);
      } catch (error) {
        console.error(error);
        setOutput("Failed to load problem.");
      } finally {
        setLoadingProblem(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);
    setCode(languageConfig[selectedLanguage].starterCode);
    setOutput("");
  };

  const runCode = async () => {
    try {
      setRunning(true);
      setOutput("Running...");

      const response = await api.post("/api/executor/run", {
        language,
        code,
      });

      setOutput(response.data.output || "Program finished with no output.");
    } catch (error) {
      console.error(error);

      setOutput(
        error.response?.data?.message ||
          "Code execution failed."
      );
    } finally {
      setRunning(false);
    }
  };
const runTestCases = async () => {
  if (!problem || !problem.testCases?.length) {
    setOutput("No test cases available.");
    return;
  }

  try {
    setRunning(true);
    setOutput("Running test cases...\n");

    let results = [];

    for (let i = 0; i < problem.testCases.length; i++) {
      const testCase = problem.testCases[i];

      const response = await api.post("/api/executor/run", {
        language,
        code,
        input: testCase.input,
      });

      const actualOutput = response.data.output
        .trim()
        .replace(/\r\n/g, "\n");

      const expectedOutput = testCase.expectedOutput
        .trim()
        .replace(/\r\n/g, "\n");

      const passed = actualOutput === expectedOutput;

      results.push(
        `Test Case ${i + 1}: ${
          passed ? "PASSED" : "FAILED"
        }`
      );

      if (!passed) {
        results.push(`Expected: ${expectedOutput}`);
        results.push(`Received: ${actualOutput}`);
      }
    }

    setOutput(results.join("\n"));
  } catch (error) {
    console.error(error);

    setOutput(
      error.response?.data?.message ||
        "Test execution failed."
    );
  } finally {
    setRunning(false);
  }
};
  if (loadingProblem) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading problem...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">
            {problem ? problem.title : "Code Editor"}
          </h1>

          {problem && (
            <span className="text-sm text-gray-500">
              {problem.difficulty}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={handleLanguageChange}
            className="rounded border px-4 py-2"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={runCode}
            disabled={running}
            className="rounded bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? "Running..." : "Run"}
          </button>

          <button
            onClick={runTestCases}
            disabled={running || !problem}
            className="rounded bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running ? "Testing..." : "Test Cases"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        {problem && (
          <div className="w-full overflow-y-auto border-r bg-white p-6 lg:w-2/5">
            <h2 className="mb-4 text-2xl font-bold">
              {problem.title}
            </h2>

            <p className="mb-6 whitespace-pre-wrap text-gray-700">
              {problem.description}
            </p>

            <h3 className="mb-2 font-semibold">
              Input Format
            </h3>

            <p className="mb-6 whitespace-pre-wrap text-gray-700">
              {problem.inputFormat}
            </p>

            <h3 className="mb-2 font-semibold">
              Output Format
            </h3>

            <p className="mb-6 whitespace-pre-wrap text-gray-700">
              {problem.outputFormat}
            </p>

            <h3 className="mb-2 font-semibold">
              Constraints
            </h3>

            <p className="mb-6 whitespace-pre-wrap text-gray-700">
              {problem.constraints}
            </p>

            <h3 className="mb-2 font-semibold">
              Sample Input
            </h3>

            <pre className="mb-6 rounded bg-gray-900 p-4 text-white">
              {problem.sampleInput}
            </pre>

            <h3 className="mb-2 font-semibold">
              Sample Output
            </h3>

            <pre className="rounded bg-gray-900 p-4 text-white">
              {problem.sampleOutput}
            </pre>
          </div>
        )}

        <div className="flex flex-1 flex-col">
          <div className="flex-1">
            <EditorComponent
              height="100%"
              language={languageConfig[language].monacoLanguage}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: {
                  enabled: false,
                },
                fontSize: 15,
              }}
            />
          </div>

          <div className="h-48 border-t bg-black p-4 text-green-400">
            <div className="mb-2 text-sm font-semibold text-gray-400">
              OUTPUT
            </div>

            <pre className="whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;