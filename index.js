import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import studentRouter from './routes/studentRouter.js';
import productsRouter from './routes/productsRouter.js';
import userRouter from './routes/userRouter.js';
import jwt from "jsonwebtoken"

const app = express();

const mongoUrl = "mongodb+srv://primary:revenge@cluster0.h7bn1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl,{})

const connection = mongoose.connection;
 
connection.once("open",()=>{
  console.log("Database connected");
})


app.use(bodyParser.json())

app.use(
  (req,res,next)=>{
    const token = req.header("Authorization")?.replace("Bearer ","")
    console.log(token)

    if(token != null){
      jwt.verify(token, "revenge-is-mine-2025", (error, decoded)=>{
        if(!error){
          req.user = decoded
        }
      })
    }
    next()
  }
)

app.use("/api/students",studentRouter)
app.use("/api/products",productsRouter)
app.use("/api/users",userRouter)

app.listen(
  5000,
  ()=>{
    console.log('Server is running on port 5000');
  }
)
