export async function analyzeReviews(text, query, apiKey) {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  // Configuration for retry logic
  // We explicitly try v1beta and v1 to find a working endpoint
  const modelsToTry = [
    { name: "gemini-2.0-flash", version: "v1beta" },
    { name: "gemini-2.0-flash-001", version: "v1beta" },
    { name: "gemini-flash-latest", version: "v1beta" },
    { name: "gemini-1.5-flash", version: "v1beta" },
    { name: "gemini-1.5-flash", version: "v1" },
  ];

  let errors = [];

  try {
    for (const config of modelsToTry) {
      const { name, version } = config;
      const url = `https://generativelanguage.googleapis.com/${version}/models/${name}:generateContent?key=${apiKey}`;

      try {
        console.log(`Attempting analysis via FETCH: ${name} (${version})`);

        const payload = {
          contents: [{
            parts: [{
              text: `You are an expert product reviewer and sentiment analyst. 
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
  "sentimentScore": 8, // Number from 1-10 (1=Terrible, 10=Perfect)
  "emoji": "🚀", // Single emoji that best represents the sentiment
  "verdict": "BUY", // One word verdict: BUY, AVOID, WAIT, or MIXED
  "pros": ["Pro 1", "Pro 2", "Pro 3"],
  "cons": ["Con 1", "Con 2", "Con 3"],
  "risks": ["Risk 1", "Risk 2"],
  "competitors": ["Competitor 1", "Competitor 2"],
  "summary": "A detailed 2-3 paragraph summary of the general consensus.",
  "quotes": ["Quote 1", "Quote 2"]
}

Here are the comments:
${text}

RETURN ONLY THE JSON. NO MARKDOWN FORMATTING.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
          }
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(`API Error ${response.status}: ${data.error?.message || response.statusText}`);
        }

        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
          throw new Error("No content generated");
        }

        const responseText = data.candidates[0].content.parts[0].text;

        // Clean up potential markdown code blocks
        const cleanText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanText);

      } catch (error) {
        errors.push(`${name} (${version}): ${error.message}`);
        console.warn(`Model ${name} (${version}) failed:`, error.message);

        // If it's a 401/403 (auth), fail immediately
        if (error.message.includes("401") || error.message.includes("key") || error.message.includes("403")) {
          throw new Error(`Invalid API Key or Access Denied. Details: ${error.message}`);
        }
        // Continue to next model for 404s or other errors
        continue;
      }
    }

    // If we get here, all models failed
    console.error("All models failed:", errors);

    // Diagnostic: Try to list available models to see what IS valid
    try {
      console.log("Running diagnostic: listing available models...");
      const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const listData = await listResponse.json();

      if (listData.models) {
        const availableNames = listData.models.map(m => m.name.replace("models/", ""));
        console.log("Available Models for this key:", availableNames);
        throw new Error(`All Gemini models failed. API Key has access to: ${availableNames.join(", ")}. Errors: ${errors.join(" | ")}`);
      } else {
        console.log("Diagnostic failed:", listData);
        throw new Error(`All Gemini models failed, and could not list models. Response: ${JSON.stringify(listData)}. Errors: ${errors.join(" | ")}`);
      }
    } catch (diagError) {
      // If the diagnostic itself throws (e.g. network error)
      if (!diagError.message.includes("API Key has access to")) {
        console.error("Diagnostic check failed:", diagError);
        throw new Error(`All Gemini models failed. Details: ${errors.join(" | ")}`);
      }
      // Re-throw the useful diagnostic error
      throw diagError;
    }

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    // Return a more descriptive error to the UI
    const msg = error.message || error.toString();

    if (msg.includes("401") || msg.includes("API key") || msg.includes("403")) {
      throw new Error("Invalid API Key or API Access Denied. Please check your Google Gemini API key and ensure the Generative AI API is enabled in Google Cloud Console.");
    } else if (msg.includes("429")) {
      throw new Error("Gemini Rate limit exceeded. The free tier has limits; please try again in a minute.");
    } else {
      throw new Error(`AI Error: ${msg}`);
    }
  }
}
