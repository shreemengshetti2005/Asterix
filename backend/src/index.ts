import express from "express";

import dotenv from 'dotenv'
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser";
import axios from "axios";
import authRoute from "./routes/auth.route";
import Question_Router from "./routes/Question";
import Answer_Router from "./routes/Answer.route";
// import { ensureCollectionExists } from "./db/vectordb";
import { createCollection } from "./db/vectordb";
import aiRouter from "./routes/Ai.route";

const PORT=process.env.PORT ||3000;
const START_URL=process.env.START_URL || "/api/v1";
const app=express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(express.json())
app.use(`${START_URL}/auth`,authRoute);
app.use(`${START_URL}/question`,Question_Router);
app.use(`${START_URL}/answer`,Answer_Router)
app.use(`${START_URL}/ai`,aiRouter)
app.listen(PORT,async()=>{
    await createCollection()
    //   await ensureCollectionExists()
    console.log(`listening on port ${PORT}`)
})


// export const uploadToChroma = async (id: string, text: string) => {
//   const embedding = await generateEmbeddingFromGemini(text)

//   const res = await chroma.post(`/api/v1/collections/${COLLECTION_NAME}/add`, {
//     ids: [id],
//     embeddings: [embedding],
//     documents: [text]
//   })

//   return res.data
// }