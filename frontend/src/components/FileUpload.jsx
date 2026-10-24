import { useState } from "react";

const FileUpload = ({ setCode, setLanguage }) => {
    const [fileUploadError, setFileUploadError] = useState({
        error: false,
    });
    const handleFileUpload = (e) => {
        try {
            e.preventDefault();
            const reader = new FileReader();
            if (e.target.files.length === 0) {
                throw new Error("No file found.");
            }
            const file = e.target.files[0];
            const fileLanguage =
                file.name.split(".")[file.name.split(".").length - 1];
            switch (fileLanguage) {
                case "py":
                    setLanguage("python");
                    break;
                case "java":
                    setLanguage("java");
                    break;
                case "cpp":
                    setLanguage("cpp");
                    break;
                default:
                    setLanguage("javascript");
                    break;
            }
            if (
                fileLanguage !== "cpp" &&
                fileLanguage !== "js" &&
                fileLanguage !== "py" &&
                fileLanguage !== "java"
            ) {
                throw new Error("Invalid file type.");
            }

            reader.onerror = (e) => {
                console.log("Failed to read file:", e);
                reader.abort();
                throw new Error("Error reading file.");
            };

            reader.onloadend = async (e) => {
                setCode(e.currentTarget.result ?? reader.result);
                setFileUploadError({ error: false });
            };

            reader.readAsText(file);
        } catch (error) {
            setFileUploadError({ error: true, errorMsg: error.message });
        }
    };
    return (
        <div className="my-5 flex w-3/4  text-black border-2 border-blue-500 py-3 px-4 rounded-md justify-between items-center bg-slate-100">
            <label htmlFor="codeFile" className="w-full cursor-pointer ">
                Upload code as a file (.js .py .cpp .java)
            </label>
            {fileUploadError.error && (
                <p className="text-red-400 font-bold">
                    {fileUploadError.errorMsg}
                </p>
            )}
            <input
                type="file"
                accept=".js,.py,.cpp,.java"
                id="codeFile"
                className="custom-file-input cursor-pointer "
                onChange={handleFileUpload}
            />
        </div>
    );
};
export default FileUpload;