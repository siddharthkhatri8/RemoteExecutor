import { createError, errorHandler } from "../utils/errorHandler.js";
import { verifyToken } from "../utils/JWTUtilities.js";

export const tokenVerification = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw createError(
                "Please Logged in before using this service",
                403
            );
        }
        // Bearer <token>
        const token = authHeader.split(" ")[1];
        if (token.length === 0) {
            throw createError(
                "Please Logged in before using this service",
                403
            );
        }
        // Token verification
        const verificationStatus = await verifyToken(token);
        if (!verificationStatus.success) {
            throw createError("Invalid Token", 403);
        }
        req.user = verificationStatus.data;
        next();
    } catch (error) {
        errorHandler(res, error);
    }
};