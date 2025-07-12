import express from "express";

import dotenv from 'dotenv'
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser";
import axios from "axios";
import authRoute from "./routes/auth.route";
import Question_Router from "./routes/Question";

const chroma = axios.create({
  baseURL: process.env.CHROMA_DB_URL || 'http://chromadb:8000',
  timeout: 5000
})
const COLLECTION_NAME = 'my-knowledge-db'

 const ensureCollectionExists = async () => {
  const res = await chroma.get('/api/v1/collections')
  const exists = res.data.some((c: any) => c.name === COLLECTION_NAME)

  if (!exists) {
    await chroma.post('/api/v1/collections', { name: COLLECTION_NAME })
  }
}
const PORT=process.env.PORT ||3000;
const START_URL=process.env.START_URL || "/api/v1";
const app=express()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(express.json())
app.use(`${START_URL}/auth`,authRoute);
app.use(`${START_URL}/question`,Question_Router);
// app.use(`${START_URL}/scrapping`,ScrapeRouter)
app.listen(PORT,async()=>{
      await ensureCollectionExists()
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