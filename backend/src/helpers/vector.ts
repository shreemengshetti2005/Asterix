import axios from "axios"
const COLLECTION_NAME = 'my-knowledge-db'
const chroma = axios.create({
  baseURL: process.env.CHROMA_DB_URL || 'http://chromadb:8000',
  timeout: 5000
})
export const uploadToChroma = async (id: string, text: string) => {
  const embedding = await generateEmbeddingFromGemini(text)

  const res = await chroma.post(`/api/v1/collections/${COLLECTION_NAME}/add`, {
    ids: [id],
    embeddings: [embedding],
    documents: [text]
  })

  return res.data
}