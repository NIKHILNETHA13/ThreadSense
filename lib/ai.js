// Helper to normalize input to array
const ensureArray = (input) => Array.isArray(input) ? input : [input];

export async function analyzeReviews(text, query, apiKeysInput) {
  const apiKeys = ensureArray(apiKeysInput);

  if (!apiKeys || apiKeys.length === 0 || !apiKeys[0]) {
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

  let lastError = null;
  let allErrors = [];

  // OUTER LOOP: Iterate through API Keys
  for (const apiKey of apiKeys) {
    if (!apiKey || apiKey === "REPLACE_WITH_YOUR_GEMINI_API_KEY") continue;

    console.log(`Starting analysis with Key ending in ...${apiKey.slice(-4)}`);

    // INNER LOOP: Iterate through Models
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
        return JSON.parse(cleanText); // SUCCESS! Return result immediately.

      } catch (error) {
        const errorMsg = `${name} (${version}) with Key ...${apiKey.slice(-4)}: ${error.message}`;
        allErrors.push(errorMsg);
        console.warn(`Model failed:`, errorMsg);
        lastError = error;

        // CRITICAL: If it's a 401/403 (Auth) or 429 (Quota), fail the Inner Loop (Models) 
        // to try the next Key in the Outer Loop.
        if (error.message.includes("401") || error.message.includes("key") || error.message.includes("403") || error.message.includes("429")) {
          console.warn(`Auth/Quota error with Key ...${apiKey.slice(-4)}. Switching to next key...`);
          break; // Break inner loop -> Go to next Key
        }
        // If it's a 404/500/Format error, continue to next model with SAME key
        continue;
      }
    }
  }

  // If we reach here, ALL keys and models failed
  console.error("All keys and models failed:", allErrors);

  const msg = lastError ? (lastError.message || lastError.toString()) : "Unknown error";

  if (msg.includes("401") || msg.includes("API key") || msg.includes("403")) {
    throw new Error("All provided API Keys were invalid or denied access. Please check your keys.");
  } else if (msg.includes("429")) {
    throw new Error("Gemini Rate limit exceeded on all keys. Please try again later.");
  } else {
    throw new Error(`AI Analysis Failed. Details: ${allErrors.join(" | ")}`);
  }
}
