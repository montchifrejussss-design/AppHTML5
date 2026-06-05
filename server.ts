import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy client initialization to prevent crash if key is missing on startup
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API endpoint for HTML Semantic Audits
app.post("/api/audit", async (req, res) => {
  try {
    const { codeSnippet } = req.body;
    if (!codeSnippet || typeof codeSnippet !== "string" || codeSnippet.trim() === "") {
      res.status(400).json({ error: "Code snippet is required" });
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      res.status(500).json({
        error: "Configuration requise",
        message: "La clé d'API de Gemini de l'application n'est pas configurée dans les secrets.",
        isConfigError: true
      });
      return;
    }

    const prompt = `Tu es un expert mondial en accessibilité web, référencement naturel (SEO) et normes du W3C.
Analyse le code HTML fourni par l'utilisateur et évalue son niveau d'utilisation des balises sémantiques HTML5 (telles que <header>, <nav>, <main>, <article>, <aside>, <section>, <footer>, <figure>, <mark>, <time>, <details>, <summary>, etc.).

Donne une note entre 0 et 100.
Formule des retours (issues) constructifs. Chaque retour peut être de type:
- 'error': Utilisation incorrecte d'une balise ou "div-soup" extrême évitant l'usage évident d'une balise sémantique HTML5 (par exemple <div class="header"> au lieu de <header>, ou <span class="bold"> au lieu de <strong>/<em> ou <div class="nav"> au lieu de <nav>).
- 'warning': Améliorations possibles de la structure pour une meilleure accessibilité (WAI-ARIA) ou un meilleur référencement (SEO).
- 'success': Félicitations sur une bonne pratique sémantique bien mise en œuvre dans leur code.

Voici le code HTML à auditer:
\`\`\`html
${codeSnippet}
\`\`\`

Rédige toutes les explications complexes en français simple, précis et pédagogique.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "Tu es un auditeur de sémantique HTML5 expert et bienveillant. Tu analyses le HTML transmis et retournes son audit sémantique structuré.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: "Note de sémantique HTML5 attribuée au code (0 à 100)."
            },
            generalAnalysis: {
              type: Type.STRING,
              description: "Une synthèse globale et encourageante en français (2-3 phrases) sur la sémantique de l'extrait HTML."
            },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: "Le niveau d'alerte sémantique : 'error' (erreur ou div-soup), 'warning' (suggestion d'amélioration), ou 'success' (bonne pratique validée)."
                  },
                  message: {
                    type: Type.STRING,
                    description: "Explication claire en français du point sémantique identifié."
                  },
                  suggestion: {
                    type: Type.STRING,
                    description: "Conseil précis en français sur ce qu'il faut faire pour s'améliorer."
                  },
                  originalCodeSnippet: {
                    type: Type.STRING,
                    description: "Le morceau de code coupable ou concerné issu de la saisie."
                  },
                  replacementCodeSnippet: {
                    type: Type.STRING,
                    description: "La réécriture idéale et propre de ce morceau de code avec les balises sémantiques appropriées."
                  }
                },
                required: ["type", "message", "suggestion", "originalCodeSnippet", "replacementCodeSnippet"]
              },
              description: "Analyse détaillée élément par élément."
            }
          },
          required: ["score", "generalAnalysis", "issues"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const auditResult = JSON.parse(text);
    res.json(auditResult);

  } catch (error: any) {
    console.error("Error in /api/audit:", error);
    res.status(500).json({ error: "Erreur lors de l'analyse du code", details: error.message });
  }
});

// API endpoint for Gemini Semantic Chatbot assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Messages array is required" });
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      res.status(500).json({
        error: "Configuration requise",
        message: "La clé d'API de Gemini de l'application n'est pas configurée dans les secrets.",
        isConfigError: true
      });
      return;
    }

    // Clean and validate messages list for Gemini SDK
    const rawMessages = messages || [];

    // 1. Map to SDK format
    let formatted = rawMessages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content || "" }]
    }));

    // 2. Filter out any leading model messages before the first user message
    const firstUserIndex = formatted.findIndex((m: any) => m.role === "user");
    if (firstUserIndex !== -1) {
      formatted = formatted.slice(firstUserIndex);
    } else {
      formatted = [];
    }

    // 3. Alternate strictly. If consecutive messages have the same role, merge their parts
    const contents: any[] = [];
    for (const msg of formatted) {
      if (contents.length > 0 && contents[contents.length - 1].role === msg.role) {
        contents[contents.length - 1].parts[0].text += "\n" + msg.parts[0].text;
      } else {
        contents.push(msg);
      }
    }

    // 4. If empty or ends with a model message, handle gracefully or require user prompt
    if (contents.length === 0) {
      res.status(400).json({ error: "Aucun message utilisateur trouvé pour démarrer la discussion." });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: "Tu es 'Assistant Sémantique de Fré_Dév-Web Tech Lab', un chatbot IA flottant chaleureux, pédagogue et expert en développement web (HTML5 sémantique, CSS, JavaScript, Python, accessibilité WAI-ARIA, SEO technique). Ta mission est d'aider les développeurs et apprenants à mieux coder et concevoir leurs applications web.\n\nCONSIGNE STRICTE D'EXCLUSIVITÉ TECHNIQUE : Tu ne dois répondre à aucune question en dehors du développement web (telles que des recettes de cuisine, du sport, de la géographie, des ragots, de l'actualité générale, ou toute discussion hors sujet).\nSi l'utilisateur te pose une question hors du développement web, ou s'il te pose des questions de nature théologique/philosophique (ex: 'Est-ce que Dieu existe ?'), ou s'il te demande comment concevoir/créer un modèle d'IA général ou intégrer des moteurs d'IA externes complexes (ex: 'Comment créer une IA ?', 'Comment intégrer une ia à ma page ?'), tu dois impérativement refuser d'y répondre d'une manière polie mais ferme.\n\nPour tout refus de ce type lié à un sujet hors développement web ou théologies/IA, tu dois répondre EXACTEMENT et textuellement avec la phrase suivante :\n\"Je ne peux pas m'écarter de notre objectif de coaching axé sur le développement web pour aborder des sujets hors de ce domaine. Je vous suggère de nous reconcentrer sur notre apprentissage informatique afin de maximiser l'efficacité de notre formation. En quoi puis-je vous aider aujourd'hui ?\"\n\nRéponds toujours en français professionnel mais amical, de manière concise, vivante et illustrée par de courts exemples si nécessaire. Rappelle fièrement ton nom 'Assistant Sémantique de Fré_Dév-Web Tech Lab' si l'utilisateur te le demande ou te salue chaleureusement."
      }
    });

    const reply = response.text || "Désolé, je n'ai pas pu générer de réponse.";
    res.json({ reply });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    const isApiKeyMissing = !process.env.GEMINI_API_KEY;
    const userFriendlyMessage = isApiKeyMissing
      ? "Erreur lors de la communication avec l'IA. Assurez-vous d'avoir configuré la variable d'environnement GEMINI_API_KEY."
      : `Erreur lors de la communication avec l'IA : ${error.message || "Erreur de génération"}`;
    res.status(500).json({ error: userFriendlyMessage, details: error.message });
  }
});

// Vite middleware flow for full stack App
async function bootstrap() {
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
