import express from 'express'
import dotenv from 'dotenv'
import { DBConn } from  './config/db.js';
import authRouter from './routes/user.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRouter from './routes/userRoutes.js';
import geminiResponse from './gemini.js';


const app = express();
DBConn()
dotenv.config();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "https://virtual-assistant-yxh9.onrender.com",
    credentials: true
}))

app.use(cors({
    origin: "http://localhost:5173", // frontend vite
    credentials: true
}));



app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);





const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>{
    console.log('Connected', PORT)
})
