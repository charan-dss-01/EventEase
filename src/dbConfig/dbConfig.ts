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

        // Set strictQuery to false to prepare for Mongoose 7
        mongoose.set('strictQuery', false);

        const connection = await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;

        console.log("Connected to database");

        mongoose.connection.on("error", (error) => {
            console.log("Error connecting to database");
            console.error(error);
            process.exit();
        });

        // Handle connection errors
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            process.exit(0);
        });

    } catch (error) {
        console.log("Error connecting to database");
        console.error(error);
        throw error;
    }
}
