import { useState } from "react";
import Editor from "@monaco-editor/react";
import api from "../services/api";

const EditorPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(
    'console.log("Hello, RemoteExecutor!");'
  );
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    try {
      setLoading(true);
      setOutput("");

      const response = await api.post("/api/executor/run", {
        language,
        code,
      });

      setOutput(response.data.output || "");
    } catch (error) {
      setOutput(
        error.response?.data?.message || "Failed to execute code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>RemoteExecutor</h1>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>

      <Editor
        height="500px"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
        theme="vs-dark"
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />

      <button onClick={runCode} disabled={loading}>
        {loading ? "Running..." : "Run Code"}
      </button>

      <h2>Output</h2>

      <pre>{output}</pre>
    </div>
  );
};

export default EditorPage;