
import dotenv from 'dotenv'
dotenv.config()
const PORT=process.env.PORT
const START_URL=process.env.START_URL
const JWT_SECRET=process.env.JWT_SECRET
const GEMINI_API_KEY=process.env.GEMINI_API_KEY
export{PORT, START_URL,JWT_SECRET,GEMINI_API_KEY}