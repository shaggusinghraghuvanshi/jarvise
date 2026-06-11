import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI chat handler (Secure server-side)
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatHistory, customApiKey } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Case 1: Custom Anthropic Claude Key
      if (customApiKey && customApiKey.startsWith("sk-")) {
        try {
          const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": customApiKey,
              "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
              model: "claude-3-5-sonnet-20241022",
              max_tokens: 1000,
              system: "You are JARVIS — an elite, advanced AI operating system for Tony Stark. Witty, British, sharp, precise, and direct. You specialize in coding, debugging, industrial design, HUD analytics, and systems.",
              messages: [{ role: "user", content: message }]
            })
          });

          const anthropicData = await anthropicResponse.json();
          if (anthropicData.error) {
            return res.status(400).json({ error: anthropicData.error.message });
          }

          const reply = anthropicData.content?.[0]?.text || "No response content from Claude.";
          return res.json({ reply, provider: "Claude 3.5 Sonnet" });
        } catch (err: any) {
          console.error("Anthropic processing error:", err);
          return res.status(500).json({ error: `Anthropic linkage failed: ${err.message}` });
        }
      }

      // Case 2: Native Gemini 3.5 Flash
      const geminiKey = process.env.GEMINI_API_KEY;
      if (!geminiKey) {
        return res.json({
          reply: "JARVIS Offline Simulation: Core AI key is not configured in safety environment system. Please add it via Settings > Secrets.",
          provider: "Simulation"
        });
      }

      const ai = new GoogleGenAI({
        apiKey: geminiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const contents = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const h of chatHistory) {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: "You are JARVIS — an elite, advanced AI operating system for Tony Stark. You are witty, brilliant, British, sharp, precise, and direct. You specialize in coding, debugging, industrial design, HUD aesthetics, and systems.",
        }
      });

      const reply = response.text || "I was unable to formulate a response, sir.";
      res.json({ reply, provider: "Gemini 3.5" });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Serve static assets or mount Vite dev middleware
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
    console.log(`Server launched on port ${PORT}`);
  });
}

startServer();
