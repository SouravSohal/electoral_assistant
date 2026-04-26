import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
  try {
    const apiKey = process.env.GEMINI_API_KEY!;
    console.log("Listing available models...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const result = await genAI.listModels();
    console.log("Models found:");
    result.models.forEach(m => console.log(`- ${m.name}`));
  } catch (error) {
    console.error("FAILED! Error:", error);
  }
}

test();
