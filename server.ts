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

// Helper function to call the Gemini API with a robust fallback chain to handle transient loads and 503 errors
async function generateContentWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    defaultModel?: string;
  }
) {
  // Ordered from most lightweight & fast/available models to backup options
  const modelsToTry = [
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-3.5-flash"
  ];

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      console.log(`[Gemini SDK] Executing request using model: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config
      });
      console.log(`[Gemini SDK] Generation successful via model: ${model}`);
      return response;
    } catch (err: any) {
      console.error(`[Gemini SDK] Model failure (${model}):`, err.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("All fallback models failed.");
}

// API endpoint for HTML/CSS/JS/Python/PHP Semantic Audits
app.post("/api/audit", async (req, res) => {
  try {
    const { codeSnippet, language = "HTML5" } = req.body;
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

    let prompt = "";
    let systemInstruction = "";
    let scoreDescription = "";

    if (language === "CSS") {
      systemInstruction = "Tu es un auditeur de styles CSS expert et bienveillant, orienté vers la performance et les standards modernes. Tu analyses le CSS transmis et retournes son audit sémantique structuré.";
      scoreDescription = "Note de qualité et modernité CSS attribuée au code (0 à 100).";
      prompt = `Tu es un expert mondial en intégration web, architecture CSS moderne (BEM, CSS Modules), responsiveness et performance visuelle.
Analyse le code CSS fourni par l'utilisateur et évalue son niveau de maîtrise d'intégration moderne (usage de Flexbox, Grid, variables CSS, sélecteurs avancés, gestion intelligente du responsive) et son adhésion aux bonnes pratiques de maintenance.

Donne une note entre 0 et 100.
Formule des retours (issues) constructifs. Chaque retour peut être de type:
- 'error': Mauvaise pratique flagrante, bugs de mise en page récurrents, ou usage excessif d'anciennes techniques (comme float, tableaux de mise en page, ou valeurs physiques codées en dur là où des variables ou fonctions de calcul comme calc(), min(), clamp() feraient merveille).
- 'warning': Amélioration d'organisation (ex : regrouper les media queries, utiliser des propriétés logiques adaptées à l'internationalisation, mieux structurer les règles de cascades).
- 'success': Félicitations sur l'élégance de l'organisation, l'écriture propre ou l'exploitation judicieuse de fonctionnalités modernes telles que CSS flexbox/grid ou les variables déclarées sous :root.

Voici le code CSS à auditer:
\`\`\`css
${codeSnippet}
\`\`\`

Rédige toutes les explications complexes en français simple, précis et pédagogique.`;
    } else if (language === "JavaScript") {
      systemInstruction = "Tu es un auditeur de code JavaScript / ES6+ expert et bienveillant. Tu analyses le JavaScript transmis et retournes son audit sémantique structuré.";
      scoreDescription = "Note de rigueur et d'optimisation JavaScript attribuée au code (0 à 100).";
      prompt = `Tu es un architecte logiciel JavaScript senior, expert d'ECMAScript 2015+ (ES6+) et de l'intégration web optimisée en performance et sécurité.
Analyse le code JavaScript fourni par l'utilisateur et évalue sa conformité aux standards actuels et sa sécurité d'exécution.

Donne une note entre 0 et 100.
Formule des retours (issues) constructifs. Chaque retour peut être de type:
- 'error': Anti-patterns majeurs (utilisation de var, pollution de la portée globale, écriture asynchrone non sécurisée avec callback hell, oublis de try-catch sur les fetch, blocage du thread principal).
- 'warning': Recommandations d'écriture moderne (préférer map/filter/reduce aux boucles manuelles encombrantes, utiliser l'optional chaining ou l'opérateur de coalescence des nuls, destructuration d'objets).
- 'success': Félicitations pour l'utilisation d'algorithmes clairs, de programmation fonctionnelle, d'asynchronisme maîtrisé via async/await ou de gestion d'erreurs robuste.

Voici le code JavaScript à auditer:
\`\`\`javascript
${codeSnippet}
\`\`\`

Rédige toutes les explications complexes en français simple, précis et pédagogique.`;
    } else if (language === "Python") {
      systemInstruction = "Tu es un auditeur de code Python expert, adepte des principes du Zen de Python et de la PEP 8. Tu analyses le Python transmis et retournes son audit sémantique structuré.";
      scoreDescription = "Note de conformité pythonesque attribuée au code (0 à 100).";
      prompt = `Tu es un ingénieur logiciel Python d'élite, garant de la lisibilité et de la propreté idiomatique de votre code (Pythonic code).
Analyse le code Python fourni par l'utilisateur et évalue son adhésion à la PEP 8 et à l'esprit pythonesque (Zen of Python).

Donne une note entre 0 et 100.
Formule des retours (issues) constructifs. Chaque retour peut être de type:
- 'error': Écritures non pythoniques (boucles d'index manuelles C-style, absence de try-except s'il y a des flux de fichiers, concaténations lourdes à la place des f-strings, absence de gestionnaires de contexte comme 'with' pour ouvrir des ressources).
- 'warning': Amélioration de syntaxe (par exemple, remplacer des transformations manuelles de listes par des list comprehensions ou des expressions génératrices, documenter les fonctions avec des docstrings conformes).
- 'success': Félicitations pour la clarté du style, la simplification optimale d'expressions complexes, ou l'organisation modulaire propre.

Voici le code Python à auditer:
\`\`\`python
${codeSnippet}
\`\`\`

Rédige toutes les explications complexes en français simple, précis et pédagogique.`;
    } else if (language === "PHP") {
      systemInstruction = "Tu es un auditeur de code PHP moderne (version 8.x+) pédagogue et très vigilant sur la sécurité applicative. Tu analyses le PHP transmis et retournes son audit sémantique structuré.";
      scoreDescription = "Note de sécurité et d'organisation PHP moderne attribuée au code (0 à 100).";
      prompt = `Tu es un expert mondial de la sécurité web et des applications PHP de niveau entreprise (normes PSR, injection SQL, failles CSRF/XSS).
Analyse le code PHP fourni par l'utilisateur et examine l'état de la sécurité (absence absolue d'injections SQL via PDO, escape de sortie pour déjouer XSS, hachage robuste de mot de passe) et de l'architecture du script.

Donne une note entre 0 et 100.
Formule des retours (issues) constructifs. Chaque retour peut être de type:
- 'error': Failles de sécurité graves (injection de variables brutes directement dans du SQL sans requêtes préparées, injection XSS via echo non sécurisé, utilisation de fonctions de hachage obsolètes comme md5 ou sha1, ou structure PHP spaghetti obsolète).
- 'warning': Amélioration de la programmation orientée objet, déclaration stricte des types (declare(strict_types=1)), ou utilisation d'outils modernes de PHP 8+ (match, nullsafe operator).
- 'success': Code sécurisé, utilisation de requêtes préparées via PDO, hachage professionnel avec password_hash, et bonne isolation des responsabilités.

Voici le code PHP à auditer:
\`\`\`php
${codeSnippet}
\`\`\`

Rédige toutes les explications complexes en français simple, précis et pédagogique.`;
    } else {
      // General HTML5 fallback
      systemInstruction = "Tu es un auditeur de sémantique HTML5 expert et bienveillant. Tu analyses le HTML transmis et retournes son audit sémantique structuré.";
      scoreDescription = "Note de sémantique HTML5 attribuée au code (0 à 100).";
      prompt = `Tu es un expert mondial en accessibilité web, référencement naturel (SEO) et normes du W3C.
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
    }

    const response = await generateContentWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.INTEGER,
              description: scoreDescription
            },
            generalAnalysis: {
              type: Type.STRING,
              description: "Une synthèse globale et encourageante en français (2-3 phrases) sur la qualité technique et sémantique."
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
                    description: "Explication claire en français du point identifié."
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
                    description: "Le réécriture idéale et propre de ce morceau de code conforme aux meilleures pratiques du langage."
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

    const response = await generateContentWithFallback(ai, {
      contents: contents,
      config: {
        systemInstruction: "Tu es 'Assistant Sémantique de Fré_Dév-Web Tech Lab', un chatbot IA flottant chaleureux, pédagogue et expert en développement web (HTML5 sémantique, CSS, JavaScript, Python, accessibilité WAI-ARIA, SEO technique). Ta mission est d'aider les développeurs et apprenants à mieux coder et concevoir leurs applications web.\n\nCONSIGNE STRICTE D'EXCLUSIVITÉ TECHNIQUE : Tu ne dois répondre à aucune question en dehors du développement web (telles que des recettes de cuisine, du sport, de la géographie, des ragots, de l'actualité générale, ou toute discussion hors sujet).\nSi l'utilisateur te pose une question hors du développement web, ou s'il te pose des questions de nature théologique/philosophique (ex: 'Est-ce que Dieu existe ?'), ou s'il te demande comment concevoir/créer un modèle d'IA général ou intégrer des moteurs d'IA externes complexes (ex: 'Comment créer une IA ?', 'Comment intégrer une ia à ma page ?'), tu dois impérativement refuser d'y répondre d'une manière polie mais ferme.\n\nPour tout refus de ce type lié à un sujet hors développement web ou théologies/IA, tu dois répondre EXACTEMENT et textuellement avec la phrase suivante :\n\"Je ne peux pas m'écarter de notre objectif de coaching axé sur le développement web pour aborder des sujets hors de ce domaine. Je vous suggère de nous reconcentrer sur notre apprentissage informatique afin de maximiser l'efficacité de notre formation. En quoi puis-je vous aider aujourd'hui ?\"\n\nRéponds toujours en français professionnel mais amical, de manière concise, vivante et illustrée par de courts exemples si nécessaire. Rappelle fièrement ton nom 'Assistant Sémantique de Fré_Dév-Web Tech Lab' si l'utilisateur te le demande ou te salue chaleureusement."
      }
    });

    const reply = response.text || "Désolé, je n'ai pas pu générer de réponse.";
    res.json({ reply });

  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    
    let friendlyMessage = "Une erreur est survenue lors de la communication avec l'IA.";
    const errStr = error.message ? String(error.message) : String(error);
    
    if (errStr.includes("503") || errStr.includes("UNAVAILABLE") || errStr.includes("demand") || errStr.includes("busy") || errStr.includes("overloaded")) {
      friendlyMessage = "⚠️ Le service d'Intelligence Artificielle de Google (Gemini) subit actuellement une forte demande temporaire (Surcharge temporaire 503). Veuillez patienter quelques secondes et renvoyer votre message. Tout rentrera dans l'ordre de suite !";
    } else if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota")) {
      friendlyMessage = "⚠️ La limite de requêtes par minute a été atteinte ou le quota d'utilisation est temporairement épuisé. Veuillez patienter une minute avant d'envoyer un nouveau message.";
    } else if (!process.env.GEMINI_API_KEY) {
      friendlyMessage = "La clé d'API de Gemini (GEMINI_API_KEY) n'est pas ou plus définie dans les secrets de l'application.";
    } else {
      try {
        if (errStr.includes("{")) {
          const startIdx = errStr.indexOf("{");
          const endIdx = errStr.lastIndexOf("}") + 1;
          const parsed = JSON.parse(errStr.slice(startIdx, endIdx));
          if (parsed.error && parsed.error.message) {
            friendlyMessage = `Erreur de l'IA : ${parsed.error.message}`;
          } else {
            friendlyMessage = `Erreur lors de la communication avec l'IA : ${errStr}`;
          }
        } else {
          friendlyMessage = `Erreur lors de la communication avec l'IA : ${errStr}`;
        }
      } catch (e) {
        friendlyMessage = `Erreur lors de la communication avec l'IA : ${errStr}`;
      }
    }

    res.status(500).json({ error: friendlyMessage, details: errStr });
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
