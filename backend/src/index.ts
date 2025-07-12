import express from "express";

import dotenv from 'dotenv'
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
// import websocket from 'ws'
// const socket = new WebSocket("ws://localhost:9091");
const PORT=process.env.PORT ||3000;
const START_URL=process.env.START_URL || "/api/v1";
const app=express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(express.json())
app.use(`${START_URL}/auth`,authRoute);
// app.use(`${START_URL}/prompt`,promptRouter);
// app.use(`${START_URL}/scrapping`,ScrapeRouter)
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})