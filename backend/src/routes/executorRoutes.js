import { Router } from "express";
import { codeReciver } from "../controllers/executor.controller.js";
import { tokenVerification } from "../middlewares/tokenVerification.js";

const router = Router();

router.route("/").post(tokenVerification, codeReciver);

export default router;