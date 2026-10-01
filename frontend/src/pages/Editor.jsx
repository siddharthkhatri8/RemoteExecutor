import { useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../services/api";

const languageConfig = {
  javascript: {
    monacoLanguage: "javascript",
    starterCode: 'console.log("Hello, RemoteExecutor!");',
  },
  python: {
    monacoLanguage: "python",
    starterCode: 'print("Hello, RemoteExecutor!")',
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

const EditorPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    languageConfig.javascript.starterCode
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(languageConfig[newLanguage].starterCode);
    setOutput("");
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    try {
      const response = await api.post("/api/executor/run", {
        language,
        code,
      });

      setOutput(
        response.data.output || "Program finished with no output."
      );
    } catch (error) {
      setOutput(
        error.response?.data?.message ||
          "Unable to execute the program."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>RemoteExecutor</h1>

      <div style={{ marginBottom: "10px" }}>
        <select
          value={language}
          onChange={(event) =>
            changeLanguage(event.target.value)
          }
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <button
          onClick={runCode}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

      <Editor
        height="500px"
        theme="vs-dark"
        language={languageConfig[language].monacoLanguage}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          minimap: {
            enabled: false,
          },
          fontSize: 14,
          automaticLayout: true,
        }}
      />

      <h2>Output</h2>

      <pre
        style={{
          background: "#111",
          color: "#fff",
          padding: "15px",
          minHeight: "100px",
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </pre>
    </div>
  );
};

export default EditorPage;