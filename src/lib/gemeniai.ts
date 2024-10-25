const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
export const GeminiAIModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
