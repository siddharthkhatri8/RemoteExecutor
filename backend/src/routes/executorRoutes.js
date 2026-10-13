import { Router } from "express";
import { codeReciver } from "../controllers/executorController.js";
import { tokenVerification } from "../middlewares/tokenVerification.js";

const router = Router();

router.route("/").post(tokenVerification, codeReciver);

export default router;