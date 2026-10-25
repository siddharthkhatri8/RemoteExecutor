import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { createError } from "./errorHandler.js";
import { findUser } from "../models/userModel.js";
config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const createToken = (userObject) => {
    return jwt.sign(
        {
            email: userObject.email,
            password: userObject.password,
        },
        PRIVATE_KEY,
        { expiresIn: "1h" }
    );
};

export const verifyToken = async (token) => {
    try {
        let decoded = jwt.verify(token, PRIVATE_KEY);
        console.log("Decoded Token: ", decoded);
        const DBdata = await findUser(decoded);
        if (DBdata.password !== decoded.password) {
            throw createError("invalid token", 403);
        }
        return { success: true, data: decoded };
    } catch (error) {
        console.log("Token Verification Error: ", error);
        throw createError("Invalid Token", 403);
    }
};