import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeReviews(text, query, apiKey) {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Fallback to gemini-pro which is the most stable for free tier v1beta
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert product reviewer and sentiment analyst. 
      I will provide you with a list of Reddit comments discussing: "${query}".
      
      Your goal is to extract the truth about this product/topic from real user experiences.
      Ignore trolls, memes, or irrelevant chatter. Focus on:
      1. Overall Sentiment (Is it generally loved, hated, or mixed?)
      2. Major Pros (What do users consistently praise?)
      3. Major Cons/Problems (What are the dealbreakers or recurring issues?)
      4. Specific User Experiences (Quote 2-3 specific, detailed experiences that represent the consensus).
      
      Format your response as a valid JSON object with the following schema:
      {
        "sentiment": "One sentence summary of sentiment",
        "pros": ["Pro 1", "Pro 2", "Pro 3"],
        "cons": ["Con 1", "Con 2", "Con 3"],
        "summary": "A detailed 2-3 paragraph summary of the general consensus.",
        "quotes": ["Quote 1", "Quote 2"]
      }
      
      Here are the comments:
      ${text}
      
      RETURN ONLY THE JSON. NO MARKDOWN FORMATTING.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean up potential markdown code blocks
    const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Return a more descriptive error to the UI
    const msg = error.message || error.toString();
    if (msg.includes("403") || msg.includes("API key")) {
      throw new Error("Invalid API Key or API not enabled. Please check your key.");
    } else if (msg.includes("429")) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    } else {
      throw new Error(`AI Error: ${msg}`);
    }
  }
}
