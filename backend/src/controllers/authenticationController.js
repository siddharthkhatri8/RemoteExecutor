import { createUser, findUser } from "../models/userModel.js";
import { createError, errorHandler } from "../utils/errorHandler.js";
import { createToken } from "../utils/JWTUtilities.js";

export const registerController = async (req, res, next) => {
    try {
        // User created
        const { userObject } = req.body;
        const userCreated = await createUser(userObject);

        // JWT token
        const token = createToken(userCreated);
        res.status(200).json({
            message: "Account created Successfully",
            token: token,
            user: userCreated,
        });
    } catch (error) {
        errorHandler(res, error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        // Find the user
        const { userObject } = req.body;
        const userFound = await findUser(userObject);

        // Password Verification
        if (userFound.password !== userObject.password) {
            throw createError("Invalid Credentials", 403);
        }
        const token = createToken(userFound);
        res.status(200).json({
            message: "Logged in Successfully",
            token: token,
            user: userFound,
        });
    } catch (error) {
        errorHandler(res, error);
    }
};