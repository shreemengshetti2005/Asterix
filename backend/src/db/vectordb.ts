import axios from "axios"

export const COLLECTION_NAME = 'my-knowledge-db'
export const chroma = axios.create({
  baseURL: process.env.CHROMA_DB_URL || 'http://chromadb:8000',
  timeout: 5000
})
 export const ensureCollectionExists = async () => {
  const res = await chroma.get('/api/v1/collections')
  const exists = res.data.some((c: any) => c.name === COLLECTION_NAME)

  if (!exists) {
    await chroma.post('/api/v1/collections', { name: COLLECTION_NAME })
  }
}