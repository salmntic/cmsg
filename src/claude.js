import fetch from "node-fetch";

const CLAUDE_KEY = process.env.REACT_APP_CLAUDE_API_KEY;

/**
 * Generates product content automatically from a short description
 * @param {string} productInput - Example: "Tanjiro Komdao 22cm firebreathing"
 * @returns JSON object with title, description, slug, SEO, specifications
 */
export async function generateProductContent(productInput) {
  const prompt = `
You are an expert e-commerce content writer.
I will give you a product description. You must generate a complete JSON object with the following fields:
- title
- slug (auto-generated, URL friendly)
- description (detailed, SEO-friendly)
- metaTitle (SEO title)
- metaDescription (SEO description)
- specifications (array of key-value, e.g., size, color, material)
- discount (default 0)
- status (in_stock, preorder, out_of_stock)

Input: "${productInput}"
Output JSON only.
`;

  const res = await fetch("https://api.anthropic.com/v1/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": CLAUDE_KEY
    },
    body: JSON.stringify({
      model: "claude-2",
      prompt: `\u0000\nHuman: ${prompt}\nAssistant:`,
      max_tokens_to_sample: 500
    })
  });

  const data = await res.json();
  const text = data?.completion ?? "{}";

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Error parsing JSON from Claude:", text);
    return null;
  }
}