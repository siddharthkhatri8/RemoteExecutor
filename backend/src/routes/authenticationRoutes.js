import { Router } from "express";
import {
    registerController,
    loginController,
} from "./controllers/authenticationController.js";

export const LoginRouter = Router();
export const RegisterRouter = Router();
// const TokenVerificationRouter = Router()

LoginRouter.route("/").post(loginController);
RegisterRouter.route("/").post(registerController);