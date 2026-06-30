import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genai.getGenerativeModel({
    model: "gemini-embedding-001",
});

export async function createEmbedding(text) {
    const result = await model.embedContent(text);
    return result.embedding.values;
}