import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import authRouter from './routes/authRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express()

app.use(cors())
app.use(express.json())

connectDB();

app.get('/', (req,res)=> res.send('Server is live!'))

app.use('/api/auth', authRouter)
app.use('/api/ai', aiRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log('Server is running on port', PORT);
})

export default app;