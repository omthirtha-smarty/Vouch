import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { BRANDS } from "./src/data/brands.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let genAI: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set. Please add it via the Settings > Secrets panel.");
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// REST API for brand list and direct lookups
app.get("/api/brands", (req, res) => {
  res.json({ brands: BRANDS });
});

// AI chat endpoint using gemini-3.5-flash with custom Vouch intelligence
app.post("/api/ask", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message input is required." });
      return;
    }

    let client;
    try {
      client = getGeminiClient();
    } catch (err: any) {
      // Graceful error fallback if key is missing or invalid
      res.json({
        text: `**Vouch Key Required**: ${err.message || "Please provide your Gemini API key inside Settings > Secrets."}\n\n**Simulated Response (Offline Mode):**\n\nI can still answer some core brand questions! If you are asking about **Dyson**, they hold premium scoring (89/100) with a "Low" scam risk based on their active warranty structures. If comparing **Minimalist** and **Mamaearth**, Minimalist has a higher score (90) due to exceptional percentage transparency (98) compared to Mamaearth (82) which has moderate scam risk due to heavy promotional review dilution. Or try asking about **Moxie Beauty** (92) and **HerbAura** (87) !`
      });
      return;
    }

    // Build brand-informed system prompt to ground the LLM
    const systemInstruction = `You are VOUCH AI, the official Brand Trust Intelligence Assistant for VOUCH – The Credit Score for Brands.
Our tagline is "Trust Before Transaction."
We help consumers determine whether a brand deserves trust before making a purchase. VOUCH is NOT a shopping app or review summarizer. It is a dual consumer protection and small brand discovery intelligence platform.

Here is the exact Vouch Brand Directory database you MUST adhere to:
${JSON.stringify(BRANDS, null, 2)}

Your Guidelines:
1. Ground your text and scores 100% in this database. Never hallucinate other brand scores.
2. If the user asks about an unknown brand, state that Vouch has not evaluated it yet. Advise on standard Vouch pillars (Transparency, Consistency, Review Authenticity, Scam Risk) and invite them to submit it.
3. When asked about product categories (e.g. "Hair cream" or "Skincare"), list the highest-rated Vouch brands in those categories instead of products! That is our core difference. Vouch rates brands, not products.
4. Keep explanations conversational, sleek, and formatted nicely in clean Markdown with clear headings and bullet points. Use of bold terms is highly recommended.
5. If the user asks general questions about Scam Risk or how Trust is computed, explain the 8 pillars: Transparency, Customer Satisfaction, Review Authenticity, Consistency, Community Trust, Trusted Circle, Brand Maturity, and Scam Risk.
`;

    // Package contents with current prompt & recent history highlights
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});

// Configure Vite integration or build asset serving
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vouch server online at http://localhost:${PORT}`);
  });
};

startServer();
