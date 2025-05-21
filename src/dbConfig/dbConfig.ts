// src/dbConfig/dbConfig.ts
import mongoose from "mongoose";

let isConnected = false;

export async function connect() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not defined");
        }

        if (isConnected) {
            return; // already connected
        }

        const connection = await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;

        console.log("Connected to database");

        mongoose.connection.on("error", (error) => {
            console.log("Error connecting to database");
            console.error(error);
            process.exit();
        });

    } catch (error) {
        console.log("Error connecting to database");
        console.error(error);
        throw error;
    }
}
