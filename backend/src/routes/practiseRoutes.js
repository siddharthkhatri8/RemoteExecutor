import express from "express";
const router = express.Router();
import { QuestionsList } from "../controllers/practiseController.js";

router.route("/").get(QuestionsList);

export default router;