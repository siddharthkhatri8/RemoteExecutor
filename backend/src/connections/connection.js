import mongoose from "mongoose";

export async function run() {
    const URI = process.env.MONGODB_URI;

    if (!URI) {
        throw new Error("MONGODB_URI is missing from .env");
    }

    console.log("Trying to establish connection to MongoDB...");
    await mongoose.connect(URI);
    console.log("You successfully connected to MongoDB");
}