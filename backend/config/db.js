import mongoose from "mongoose";

const URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Ai_Virtual_Assistant"

export const DBConn = async () =>{
    try {
        const conn = await mongoose.connect(URL);
        console.log("DB Connected")
    } catch (error) {
        console.log(error)
    }
}