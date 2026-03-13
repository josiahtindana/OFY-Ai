import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "OFY AI Career Assistant API is running" });
  });

  // Endpoint for semantic search using Gemini with Google Search grounding
  app.post("/api/opportunities/search", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const { query } = req.body;
      
      const prompt = `
        Search for opportunities matching the user's query: "${query}"
        You MUST restrict your search to the website opportunitiesforyouth.org (e.g., by using site:opportunitiesforyouth.org in your search).
        Do not return opportunities from any other website.
        
        Return a JSON array of the top opportunities found. Each opportunity should have:
        - title: The title of the opportunity
        - url: The link to the opportunity on opportunitiesforyouth.org
        - category: The type of opportunity (e.g., Scholarship, Fellowship, Job, Internship)
        - country: The location or country (if applicable/found, otherwise "Various" or "Not specified")
        - funding_type: The funding type (e.g., Fully Funded, Partial, Paid, otherwise "Not specified")
        - deadline: The application deadline (if found, otherwise "Not specified")
        - description: A short 1-2 sentence summary
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      // Since we can't use responseSchema with googleSearch, we parse the JSON from the text
      let text = response.text || "[]";
      // Remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      let result = [];
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", text);
        // Fallback if it didn't return valid JSON
        result = [];
      }
      
      res.json({ results: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Search failed" });
    }
  });

  // CV Review Endpoint using Gemini Structured Outputs
  app.post("/api/ai/review-cv", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const { opportunity_text, cv_text } = req.body;
      
      if (!cv_text || !opportunity_text) {
        return res.status(400).json({ error: "Missing CV text or opportunity text" });
      }

      const prompt = `
        Analyze the provided CV against the target Opportunity Description.
        
        CRITICAL RULES:
        1. NEVER fabricate, invent, or hallucinate experiences, skills, or qualifications for the user.
        2. Provide constructive, actionable, and specific feedback.
        3. Maintain an encouraging, professional, and ethical tone.
        4. Generate a fully rewritten, recommended CV that is tailored to suit the opportunity based on the provided CV.

        CV Text:
        ${cv_text}

        Opportunity Description:
        ${opportunity_text}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              match_score: { type: Type.INTEGER, description: "Score from 1-100" },
              skills_alignment: {
                type: Type.OBJECT,
                properties: {
                  matched_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  missing_skills: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              experience_alignment: {
                type: Type.OBJECT,
                properties: {
                  strengths: { type: Type.STRING },
                  weaknesses: { type: Type.STRING }
                }
              },
              ats_compatibility_score: { type: Type.INTEGER },
              section_suggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    current_text: { type: Type.STRING },
                    suggested_rewrite: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  }
                }
              },
              recommended_cv: { type: Type.STRING, description: "A fully rewritten CV tailored to the opportunity based on the original CV." },
              ethical_guidance: { type: Type.STRING }
            },
            required: ["match_score", "skills_alignment", "experience_alignment", "ats_compatibility_score", "section_suggestions", "recommended_cv", "ethical_guidance"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "CV Review failed" });
    }
  });

  // Essay Assistant Endpoint
  app.post("/api/ai/improve-essay", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey: apiKey as string });
      const { draft_text, opportunity_text, instructions } = req.body;
      
      if (!draft_text || !opportunity_text) {
        return res.status(400).json({ error: "Missing draft text or opportunity text" });
      }

      const prompt = `
        Review the following essay draft for the specified opportunity.
        Identify areas for improvement in clarity, impact, tone, and alignment with the opportunity's goals.
        Do not change the underlying facts or experiences. Enhance the narrative flow and professional vocabulary.
        
        Additional User Instructions: ${instructions || "None"}

        Draft: 
        ${draft_text}
        
        Opportunity: 
        ${opportunity_text}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overall_feedback: { type: Type.STRING },
              improved_draft: { type: Type.STRING },
              key_changes: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              }
            },
            required: ["overall_feedback", "improved_draft", "key_changes"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Essay improvement failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
