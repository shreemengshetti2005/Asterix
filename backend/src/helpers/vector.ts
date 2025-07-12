import axios from "axios"
const COLLECTION_NAME = 'my-knowledge-db'
const chroma = axios.create({
  baseURL: process.env.CHROMA_DB_URL || 'http://chromadb:8000',
  timeout: 5000
})
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./dotenv";



export const generateEmbeddingFromGemini=async(text:string)=>{
   const ai = new GoogleGenAI({apiKey:GEMINI_API_KEY});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-exp-03-07',
        contents: text,
        config: {
            taskType: "SEMANTIC_SIMILARITY",
        }
    });
    return response.embeddings;
}
export const uploadToChroma = async (id:string, text: string) => {
  const embedding = await generateEmbeddingFromGemini(text)

  const res = await chroma.post(`/api/v1/collections/${COLLECTION_NAME}/add`, {
    ids: [id],
    embeddings: [embedding],
    documents: [text]
  })

  return res.data
}