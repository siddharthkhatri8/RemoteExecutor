import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import Editor from "@monaco-editor/react";
import FileUpload from "../components/FileUpload.jsx";
import { useAuth } from "../contexts/authContext.jsx";
import { BASE_URL } from "../constants.js";

const Terminal = () => {
    let { token, logOut, user } = useAuth();
    if (!token) {
        token = localStorage.getItem("token");
    }
    const navigate = useNavigate();
    const [code, setCode] = useState(
        "// Your code here\nconsole.log('Hello World!')"
    );
    const [outputPending, setOutputPending] = useState(false);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [language, setLanguage] = useState("javascript");
    /**
     * SERVER ERROR: 2
     * CODE ERROR: 1
     * NO ERROR: 0
     */
    const [outputError, setOutputError] = useState(null);

    const handleSubmit = () => {
        setOutputPending(true);
        Axios({
            url: `${BASE_URL}/executor/`,
            method: "post",
            data: {
                code: code,
                input: input,
                language: language,
                user: { containerName: JSON.parse(user).username },
            },
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
            .then((data) => {
                setOutputPending(false);
                setOutput(data.data.output);
                if (data.data.codeError) {
                    setOutputError(
                        "bg-orange-200 border-orange-700 text-red-600"
                    );
                } else {
                    setOutputError("bg-green-200 border-green-700 text-black");
                }
            })
            .catch((err) => {
                // update here if the token auth fails then logout and redirect to login
                if (err.response && err.response.status === 403) {
                    logOut();
                    navigate("/login");
                } else {
                    setOutputPending(false);
                    setOutput("SERVER ERROR: " + err.response?.data?.error);
                    setOutputError("bg-red-200 border-red-500 text-red-600");
                    console.log("Error occured: ", err);
                }
            });
    };
    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };
    const handleInputChange = (newInput) => {
        setInput(newInput.target.value);
    };
    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
    };
    const handleEditorMount = (editor) => {
        console.log("Editor mounted");
        editor.focus();
    };

    return (
        <div>
            <div className="flex justify-between items-center">

                <select
                    name="language"
                    id="selectLanguage"
                    onChange={handleLanguageChange}
                    className="p-3 m-2 my-5 w-40 rounded-full bg-slate-100 "
                >
                    <option
                        value="javascript"
                        selected={language === "javascript"}
                    >
                        JavaScript
                    </option>
                    <option value="java" selected={language === "java"}>
                        Java
                    </option>
                    <option value="cpp" selected={language === "cpp"}>
                        C++
                    </option>
                    <option value="python" selected={language === "python"}>
                        Python
                    </option>
                </select>
                <FileUpload
                    setCode={setCode}
                    setLanguage={setLanguage}
                ></FileUpload>
            </div>
            <div className="rounded-md px-2 py-4 bg-[#1e1e1e]">

                <Editor
                    height="70vh"
                    width="100%"
                    language={language}
                    className="rounded-md "
                    defaultValue={code}
                    theme="vs-dark"
                    value={code}
                    onChange={handleCodeChange}
                    onMount={handleEditorMount}
                />
            </div>
            {!token && (<div className="text-red-400 mt-5">
                WARNING: Please ensure you are logged in before writing code.
                Any changes may be lost during the redirection to the login
                page, if you are not logged in.
            </div>)}
            <div className="flex my-10 justify-between items-end">
                <div className="flex-col flex mr-5">
                    <label htmlFor="input">Input:</label>
                    <textarea
                        className="bg-gray-100 border rounded-sm resize-none mt-2 p-4"
                        name="input"
                        id="input"
                        cols="30"
                        rows="10"
                        placeholder="Enter your input here..."
                        value={input}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="flex-col flex">
                    <label htmlFor="output">Output:</label>
                    <textarea
                        className={`${outputError ?? "bg-gray-100"
                            } border rounded-sm resize-none mt-2 p-4`}
                        name="output"
                        id="output"
                        cols="80"
                        rows="10"
                        readOnly={false}
                        value={output}
                        placeholder="Submit your code..."
                    ></textarea>
                </div>
            </div>
            {outputPending ? (
                <button className="w-full mt-2 text-white bg-gradient-to-bl from-yellow-300 to-red-500 py-3 px-4 rounded-md animate-pulse">
                    Pending...
                </button>
            ) : (
                <button
                    onClick={code ? handleSubmit : null}
                    className="w-full mt-2 text-white bg-gradient-to-bl from-slate-500 to-slate-800 py-3 px-4 rounded-md"
                >
                    Submit
                </button>
            )}

        </div>
    );
};
export default Terminal;