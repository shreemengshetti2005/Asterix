import { Router, Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../helpers/dotenv";
import { authcheck } from "../middlewares/auth.middleware";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const aiRouter = Router();

// Shared Gemini call
async function main(prompt: string, userInput: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: `${prompt}\n\nINPUT:\n${userInput}` }],
      },
    ],
    config: {
      temperature: 0.1,
    },
  });

  return response.text ?? "";
}

// Markdown Endpoint
aiRouter.post("/markdown", authcheck, async (req: Request, res: Response) => {
  const query = req.body.text;
  if (!query) return res.status(400).json({ error: "Missing input text." });

const prompt = `You are a Markdown formatter for a technical Q&A platform.

Your task is to take a user's plain-text question or post and format it using clean, structured GitHub-Flavored Markdown.

Format Rules:
- Use a title heading (#) if the post includes a clear title
- Use subheadings (##) for sections like "Problem", "What I tried", "Expected behavior", "Code", etc.
- Use **bold** and _italic_ to emphasize important phrases
- Use \`\`\` blocks for code snippets (with language identifier if possible, like \`\`\`js)
- Use bullet points or numbered lists where needed
- Do not explain your formatting — return only the final markdown output

Respond with only the formatted Markdown.`;

  const markdown = await main(prompt, query);
  res.json({ status: 200, data: markdown });
});

// Tags Endpoint with ad-hoc parsing
aiRouter.post("/tags", authcheck, async (req: Request, res: Response) => {
  const text = req.body.text;
  if (!text) return res.status(400).json({ error: "Missing input text." });

  const prompt = `Extract relevant tags from the input text.

Rules:
- Output a JSON array of lowercase string tags like ["react", "api", "typescript"]
- Return only the array, nothing else.`;

  const raw = await main(prompt, text);

  let tags: string[] = [];

  try {
    // Remove smart quotes and whitespace
    const cleaned = raw
      .replace(/“|”/g, '"')
      .replace(/‘|’/g, "'")
      .trim();

    // Remove everything before the first `[` and after the last `]` without regex
    const startIdx = cleaned.indexOf("[");
    const endIdx = cleaned.lastIndexOf("]");

    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const arrayContent = cleaned.slice(startIdx + 1, endIdx);
      const items = arrayContent.split(",");

      tags = items
        .map((item) => item.replace(/"/g, "").trim().toLowerCase())
        .filter((item) => item.length > 0);
    }
  } catch {
    tags = [];
  }

  res.json({ status: 200, data: tags });
});

export default aiRouter;
