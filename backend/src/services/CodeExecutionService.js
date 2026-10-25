import { createError } from "../utils/errorHandler.js";
import { javaClassName } from "../utils/javaClassNameExtractor.js";
import { exec } from "child_process";
import { Buffer } from "buffer";
import { v4 as uuidv4 } from "uuid";
class ExecutionService {
    codeFileName;
    codeExecution_CMD;
    #containerName;
    #imageName =
        process.env.CONTAINER_NAME;
    containerStartUp = async (user) => {
        return new Promise((resolve, reject) => {
            const dockerCommand = [
                'docker run',
                '--memory="256m"',
                '--cpus="1"',
                '--ulimit nproc=50',
                '--ulimit nofile=100',
                '--network none',
                '--read-only',
                '--tmpfs /tmp:size=50m,noexec',
                '--tmpfs /workspace:size=100m,exec,uid=65534,gid=65534',
                '--workdir=/workspace',
                '--user nobody',
                '--cap-drop=ALL',
                '--security-opt=no-new-privileges',
                '--security-opt=apparmor:unconfined',
                '--pids-limit=50',
                '--memory-swappiness=0',
                '-it -d',
                `--name ${this.#containerName}`,
                this.#imageName,
                'sh'
            ].join(' ');
            exec(
                dockerCommand,
                { timeout: 60000 }, (error, stdout, stderr) => {
                    if (error) {
                        console.log("new Commmand: ", error);
                        reject(createError("Container creation error", 500));
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    };
    fileCreation = async (user, fileCreation_CMD) => {
        return new Promise((resolve, reject) => {
            exec(
                `docker exec ${this.#containerName
                } sh -c "${fileCreation_CMD}"`,
                { timeout: 60000 }, (error, stdout, stderr) => {
                    if (error) {
                        console.log("New command error: ", error);
                        reject("Code file creation error");
                    } else {
                        resolve(true);
                    }
                }
            );
        });
    };
    codeExecution = async (user) => {
        return new Promise((resolve, reject) => {
            exec(
                `docker exec ${this.#containerName} sh -c "${this.codeExecution_CMD
                }"`,
                { timeout: 30000 }, (error, stdout, stderr) => {
                    if (error) {
                        resolve({ codeError: true, output: stderr });
                    } else {
                        resolve({ codeError: false, output: stdout });
                    }
                }
            );
        });
    };
    containerStop = async (user) => {
        return new Promise((resolve, reject) => {
            exec(
                `docker stop ${this.#containerName} && docker rm ${this.#containerName
                }`,
                { timeout: 60000 }, (error, stdout, stderr) => {
                    if (error) {
                        console.log(
                            "Container Not Stopped [FAILURE]: ",
                            stderr
                        );
                    } else {
                        console.log("Container Stopped [SUCCESS]: ", stdout);
                    }
                    resolve();
                }
            );
        });
    };
    exe = async (code, input, language, user) => {
        this.#containerName = `${user.containerName}${uuidv4()}`;
        const containerStartUpExecution = await this.containerStartUp(user);
        if (containerStartUpExecution) {
            try {
                const fileCreation_CMD = this.fileCreationCommand(
                    code,
                    input,
                    language
                );
                const fileCreationExecution = await this.fileCreation(
                    user,
                    fileCreation_CMD
                );
                if (fileCreationExecution) {
                    const codeExecutionStatus = await this.codeExecution(user);
                    await this.containerStop(user);
                    return codeExecutionStatus;
                }
            } catch (error) {
                await this.containerStop(user);
                throw createError(error, 500);
            }
        }
    };
    fileCreationCommand = (code, input, language) => {
        const base64Code = Buffer.from(code).toString("base64");
        const base64Input = Buffer.from(input).toString("base64");
        switch (language) {
            case "python":
                this.codeFileName = `code.py`;
                this.codeExecution_CMD = `python code.py <input.txt && rm -f *`;
                break;
            case "cpp":
                this.codeFileName = `code.cpp`;
                this.codeExecution_CMD = `g++ code.cpp -o useroutputfile && ./useroutputfile <input.txt && rm -f *`;
                break;
            case "java":
                this.codeFileName = `code.java`;
                this.codeExecution_CMD = `javac code.java && java ${javaClassName(code)} <input.txt && rm -f *`;
                break;
            default:
                this.codeFileName = `code.js`;
                this.codeExecution_CMD = `node code.js <input.txt && rm -f *`;
                break;
        }
        return `echo '${base64Code}' | base64 -d > ${this.codeFileName} && echo '${base64Input}' | base64 -d > input.txt`;
    };
}

export const Executor = new ExecutionService();