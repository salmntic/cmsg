// src/claude.js
import fetch from "node-fetch";

const CLAUDE_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

export async function generateSchema(description) {
  const prompt = `
You are an AI that generates Firestore schemas.
Create a JSON schema for the following collection: "${description}".
Include field names, types, enums if necessary, and SEO fields if relevant.
Return JSON only.
`;

  const res = await fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": CLAUDE_KEY,
    },
    body: JSON.stringify({
      model: "claude-2",
      prompt: `\u0000\nHuman: ${prompt}\nAssistant:`,
      max_tokens_to_sample: 800,
    }),
  });

  const data = await res.json();
  try {
    return JSON.parse(data?.completion ?? "{}");
  } catch {
    return null;
  }
}