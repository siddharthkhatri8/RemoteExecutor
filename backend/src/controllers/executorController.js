import { errorHandler } from "../utils/errorHandler.js";
import { Executor } from "../services/CodeExecutionService.js";

export const codeReciver = async (req, res, next) => {
    try {
        const { code, input, language, user } = req.body;
        const output = await Executor.exe(code, input, language, user);
        res.json(output);
    } catch (error) {
        errorHandler(res, error);
    }
};