
import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import Practise from "./routes/practiseRoutes.js";
import { run } from "./connections/connection.js";
import Problem from "./routes/problemRoute.js";
import { RegisterRouter, LoginRouter } from "./routes/authenticationRoutes.js";
import Course from "./routes/courseRoutes.js";
import Executor from "./routes/executorRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
export const FRONTEND = process.env.FRONTEND;
export const ADMIN = process.env.ADMIN;

const corsConfig = {
    origin: (origin, callback) => {
        if (!origin || origin === FRONTEND || origin === ADMIN) {
            callback(null, true);
        } else {
            callback(new Error("CORS Error"), false);
        }
    }
};

app.use(express.json());
app.use(cors(corsConfig));

app.use("/practise", Practise);
app.use("/problem", Problem);
app.use("/course", Course);
app.use("/executor", Executor);
app.use("/signup", RegisterRouter);
app.use("/login", LoginRouter);

try {
    await run();

    app.listen(PORT, () => {
        console.log("Server started at port", PORT);
    });
} catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
}
