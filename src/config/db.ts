import mongoose from "mongoose";

export async function connectDB() : Promise<void>{
    try {
        if(mongoose.connection.readyState === 1){
            console.log("Already Connected to MongoDB")
            return;
        }
        const conn = await mongoose.connect(process.env.DB_URI as string);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
}