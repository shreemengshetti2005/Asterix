import axios from "axios"
const COLLECTION_NAME = 'my-knowledge-db'
const chroma = axios.create({
  baseURL: process.env.CHROMA_DB_URL || 'http://chromadb:8000',
  timeout: 5000
})
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./dotenv";
import { createCollection } from "../db/vectordb";
import { collection } from "../db/vectordb";


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
export async function uploadToChroma(id: string, text: string) {
  if (!collection) await createCollection();

  await collection.add({
    ids: [id],
    documents: [text],
  });

  console.log(`✅ Uploaded doc "${id}"`);
}