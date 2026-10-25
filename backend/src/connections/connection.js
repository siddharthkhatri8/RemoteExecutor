import mongoose from "mongoose";
import { URI } from "../index.js";

export async function run() {
    try {
        console.log("Trying to establish connection to MongoDB...");
        await mongoose.connect(URI);
        console.log("You successfully connected to MongoDB");
        mongoose.connection.once("open", () => {
            console.log("You successfully connected to MongoDB");
        });
    } catch (error) {
        console.log("DB Connnection Error: ", error);
    }
}