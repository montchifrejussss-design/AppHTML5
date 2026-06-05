import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Trash2,
  Minimize2,
  HelpCircle,
  Copy,
  Check,
  Code,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Plus,
  Paperclip,
  Languages,
  ChevronDown
} from "lucide-react";
import { playSound } from "../utils/audio";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Custom simple parser to render basic Markdown & clean Code blocks with Copy functionality
function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    playSound("ding");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs sm:text-sm text-slate-100 shadow-lg">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800/80 text-[10px] text-gray-400 font-sans font-bold uppercase tracking-wider">
        <span>{language || "code"}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copié</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto whitespace-pre scrolling-touch leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function FormattedText({ text }: { text: string }) {
  if (!text) return null;

  // Split text by code blocks: ```[lang]\n[code]\n```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed font-medium w-full max-w-full break-words overflow-hidden">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Extract language and code
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "html";
          const code = match ? match[2] : part.slice(3, -3);
          return (
            <div key={index} className="w-full max-w-full overflow-hidden">
              <CodeBlock code={code.trim()} language={lang} />
            </div>
          );
        }

        // Parse inline bold (**) and inline code (`)
        const subParts = part.split(/(\*\*.*?\*\*|`.*?`)/g);

        return (
          <p key={index} className="whitespace-pre-wrap break-words w-full">
            {subParts.map((sub, sIdx) => {
              if (sub.startsWith("**") && sub.endsWith("**")) {
                return (
                  <strong key={sIdx} className="font-extrabold text-gray-900 dark:text-white break-words">
                    {sub.slice(2, -2)}
                  </strong>
                );
              }
              if (sub.startsWith("`") && sub.endsWith("`")) {
                return (
                  <code
                    key={sIdx}
                    className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-purple-750 dark:text-purple-350 font-mono text-xs px-1.5 py-0.5 rounded font-black inline-block max-w-full break-all"
                  >
                    {sub.slice(1, -1)}
                  </code>
                );
              }
              return sub;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function SemanticChatbot({ currentLanguage = "HTML5" }: { currentLanguage?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    size: number;
    content?: string;
    preview?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preferredVoice, setPreferredVoice] = useState<"female" | "male">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("html5_semantic_chat_voice") as "female" | "male") || "female";
    }
    return "female";
  });
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // References to prevent stale closure snapshots in asynchronous queue runner
  const messagesRef = useRef<Message[]>([]);
  const queueRef = useRef<string[]>([]);
  const isProcessingRef = useRef<boolean>(false);
  const isOpenRef = useRef<boolean>(false);

  // Stop synthesis and listening on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, []);

  // Helper to remove formatting and special characters for a clean and fluid Speech Synthesis
  const stripMarkdownAndTags = (text: string): string => {
    if (!text) return "";
    let clean = text;
    // Strip code blocks since reading them raw sounds bad
    clean = clean.replace(/```[\s\S]*?```/g, " [Le code est affiché.] ");
    // Strip inline code delimiters
    clean = clean.replace(/`([^`]+)`/g, " $1 ");
    // Strip emphasis delimiters
    clean = clean.replace(/\*\*([^*]+)\*\*/g, " $1 ");
    // Format list bullets nicely
    clean = clean.replace(/-\s+/g, " ");

    // Remove emojis, symbols, icons, and stickers
    try {
      clean = clean.replace(/\p{Extended_Pictographic}/gu, "");
      clean = clean.replace(/\p{Emoji_Presentation}/gu, "");
      clean = clean.replace(/\p{Emoji_Modifier_Base}/gu, "");
      clean = clean.replace(/\p{Emoji_Component}/gu, "");
      clean = clean.replace(/\p{Emoji}/gu, "");
    } catch (e) {
      clean = clean.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, "");
    }

    // Replace curly and straight apostrophes with empty string to keep word parts merged for natural French liaison (e.g. l'élément -> lélément)
    clean = clean.replace(/['’]/g, "");

    // Replace special characters requesting soft silent breaks or spaces to prevent the native TTS reader from voicing them literally
    clean = clean.replace(/_/g, " "); // Underscore (_)
    clean = clean.replace(/-/g, " "); // Hyphen (-)
    clean = clean.replace(/;/g, " "); // Semicolon (;)
    clean = clean.replace(/:/g, " "); // Colon (:)
    clean = clean.replace(/,/g, " "); // Comma (,)
    clean = clean.replace(/[()\[\]{}]/g, " "); // Parentheses and Brackets

    // Clean up multiple sequential spaces
    clean = clean.replace(/\s+/g, " ");
    return clean.trim();
  };

  const speakResponse = (text: string, messageId: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Cancel existing speak cues
    window.speechSynthesis.cancel();

    const cleanText = stripMarkdownAndTags(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "fr-FR";

    // Lookup standard French voices
    const voices = window.speechSynthesis.getVoices();
    const frVoices = voices.filter(v => v.lang.startsWith("fr"));

    let selectedVoice = null;
    if (preferredVoice === "female") {
      selectedVoice = frVoices.find(v => 
        v.name.toLowerCase().includes("hortense") || 
        v.name.toLowerCase().includes("julie") || 
        v.name.toLowerCase().includes("pauline") || 
        v.name.toLowerCase().includes("marie") ||
        v.name.toLowerCase().includes("chloe") ||
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("google")
      );
      utterance.pitch = 1.15; // Set a slightly brighter/lively female pitch representation
      utterance.rate = 1.0;
    } else {
      selectedVoice = frVoices.find(v => 
        v.name.toLowerCase().includes("thomas") || 
        v.name.toLowerCase().includes("nicolas") || 
        v.name.toLowerCase().includes("paul") || 
        v.name.toLowerCase().includes("daniel") ||
        v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("microsoft")
      );
      utterance.pitch = 0.9; // Lowered young adult male pitch representation
      utterance.rate = 0.98;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else if (frVoices.length > 0) {
      utterance.voice = frVoices[0];
    }

    utterance.onstart = () => {
      setSpeakingMessageId(messageId);
    };

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par ce périphérique ou navigateur.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error(e);
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.lang = "fr-FR";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
        playSound("ding");
      };

      rec.onresult = (event: any) => {
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputMessage((prev) => prev ? prev + " " + transcript : transcript);
          }
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Advanced safety check to block inappropriate/adult files automatically
    const adultKeywords = [
      "porn", "sexy", "nude", "naked", "xxx", "adult", "hentai", "sexe", "erotic",
      "vulgar", "vagin", "penis", "blowjob", "strip", "orgasm", "cam", "lesbian",
      "cock", "dick", "pussy", "anal", "boobs", "boob", "ass", "butt", "breasts",
      "coquin", "charme", "interdit", "sensuel"
    ];

    const fileNameLower = file.name.toLowerCase();
    const isAdultPattern = adultKeywords.some(keyword => fileNameLower.includes(keyword));

    if (isAdultPattern) {
      playSound("incorrect");
      alert("⚠️ Importation refusée : Ce fichier possède des indicateurs de contenu inapproprié ou réservé aux adultes. Veuillez s'il vous plaît téléverser une autre image, vidéo ou fichier adapté au développement d'applications.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Process file based on media type
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const previewUrl = URL.createObjectURL(file);
      setAttachedFile({
        name: file.name,
        type: file.type,
        size: file.size,
        preview: previewUrl
      });
      playSound("ding");
    } else {
      // Code files or textual documents
      const reader = new FileReader();
      reader.onload = (event) => {
        const textContent = (event.target?.result as string) || "";
        const textContentLower = textContent.toLowerCase();
        const contentIsAdult = adultKeywords.some(keyword => textContentLower.includes(keyword));

        if (contentIsAdult) {
          playSound("incorrect");
          alert("⚠️ Importation refusée : Le contenu de ce fichier sémantique a été détecté comme inapproprié ou non éducatif. Veuillez s'il vous plaît téléverser un autre fichier propre.");
          return;
        }

        setAttachedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          content: textContent
        });
        playSound("ding");
      };
      reader.readAsText(file);
    }

    // Clear input value to allow re-upload of same file if detached
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const initialBotMessage = `Bonjour ! Je suis l'**Assistant Sémantique de Fré_Dév-Web Tech Lab** 🚀.

Je suis branché en direct sur l'**IA de Gemini** pour répondre à tous vos doutes sur la sémantique HTML5, l'accessibilité web (WAI-ARIA) ou le référencement (SEO).

Voici quelques questions fréquemment posées comme exemples :
- **Pourquoi éviter d'utiliser des \`<div>\` à outrance ?**
- **Comment structurer correctement les titres \`<h1>\` à \`<h6>\` ?**
- **Quelle différence y a-t-il entre \`<section>\` et \`<article>\` ?**

Posez-moi votre question en toute simplicité en bas !`;

  // Initialize with initial message if history is empty
  useEffect(() => {
    const savedMessages = localStorage.getItem("html5_semantic_chat_history");
    if (savedMessages) {
      try {
        const loaded = JSON.parse(savedMessages);
        setMessages(loaded);
        messagesRef.current = loaded;
      } catch {
        const initial = [
          {
            id: "init",
            role: "assistant",
            content: initialBotMessage
          }
        ];
        setMessages(initial);
        messagesRef.current = initial;
      }
    } else {
      const initial = [
        {
          id: "init",
          role: "assistant",
          content: initialBotMessage
        }
      ];
      setMessages(initial);
      messagesRef.current = initial;
    }
  }, []);

  // Sync state with mutable reference & localStorage
  useEffect(() => {
    messagesRef.current = messages;
    localStorage.setItem("html5_semantic_chat_history", JSON.stringify(messages));
  }, [messages]);

  // Keep track of isOpen state ref and clear unreadCount when opened
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Smooth autoscroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Sequence processors to run user questions in precise FIFO order
  const triggerQueueProcessing = async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    setIsLoading(true);
    setErrorMessage(null);

    while (queueRef.current.length > 0) {
      const nextPrompt = queueRef.current[0];

      try {
        // Build payload up to parent state context snapshots
        let payloadMessages = messagesRef.current.map(m => ({
          role: m.role,
          content: m.content
        }));

        // Safeguard to avoid React state-flush racing issues: 
        // ensure the current prompt we are querying for is at the end of the history
        const lastMsg = payloadMessages[payloadMessages.length - 1];
        if (!lastMsg || lastMsg.content !== nextPrompt || lastMsg.role !== "user") {
          payloadMessages.push({
            role: "user",
            content: nextPrompt
          });
        }

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ messages: payloadMessages })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || data.error || "Une erreur serveur est survenue.");
        }

        const assistantMsg: Message = {
          id: (Date.now() + Math.random()).toString(),
          role: "assistant",
          content: data.reply
        };

        setMessages((prev) => {
          const updated = [...prev, assistantMsg];
          // Check if chat bubble is collapsed right now
          if (!isOpenRef.current) {
            setUnreadCount((c) => c + 1);
          }
          return updated;
        });

        playSound("audit");
        queueRef.current.shift(); // Evacuate item from FIFO queue head on success

      } catch (err: any) {
        console.error("Queue process error:", err);
        setErrorMessage(
          err.message || "Impossible de joindre l'IA de Gemini. Vérifiez votre clé GEMINI_API_KEY dans les secrets."
        );
        playSound("incorrect");
        queueRef.current.shift(); // Shift anyway to avoid freezing infinite loop
      }

      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    isProcessingRef.current = false;
    setIsLoading(false);
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText !== undefined ? customText : inputMessage;
    if (!textToSend.trim() && !attachedFile) return;

    // Play visual feedback
    playSound("ding");

    let finalPrompt = textToSend;
    if (attachedFile) {
      if (attachedFile.content) {
        finalPrompt += `\n\n[Fichier joint: ${attachedFile.name}]\n\`\`\`\n${attachedFile.content}\n\`\`\``;
      } else {
        finalPrompt += `\n\n[Fichier multimédia joint: ${attachedFile.name} (${attachedFile.type || "Fichier"})]`;
      }
    }

    const userMsg: Message = {
      id: (Date.now() + Math.random()).toString(),
      role: "user",
      content: finalPrompt
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setAttachedFile(null);
    setErrorMessage(null);

    // Append to FIFO queue
    queueRef.current.push(finalPrompt);

    // Call background runner safely
    triggerQueueProcessing();
  };

  const clearChat = () => {
    if (window.confirm("Voulez-vous réinitialiser la conversation historique ?")) {
      const reset = [
        {
          id: "init",
          role: "assistant",
          content: initialBotMessage
        }
      ];
      setMessages(reset);
      localStorage.setItem("html5_semantic_chat_history", JSON.stringify(reset));
      playSound("incorrect");
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(undefined, text);
  };

  const suggestions = [
    { text: "Balise <header> vs <main>", label: "🌐 Header/Main" },
    { text: "L'importance SEO de l'alt sur <img>", label: "📸 Alt Image" },
    { text: "Pourquoi pas de <div> partout ?", label: "🚫 Anti-DivSoup" },
    { text: "Qu'est-ce qu'un <figure> ?", label: "🖼️ Figures" }
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Expanded Chat container window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[92vw] sm:w-[380px] h-[520px] bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3.5"
            style={{ maxHeight: "calc(100vh - 100px)" }}
          >
            {/* Window header */}
            <div className="bg-purple-700 dark:bg-purple-900 text-white px-4 py-3.5 flex items-center justify-between shadow-xs relative">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/10 relative">
                  <Bot className="w-5 h-5 text-purple-200" />
                  <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-purple-700 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black tracking-wide">Assistant de Fré_Dév-Web</h3>
                  <span className="text-[10px] text-purple-200/90 font-bold block leading-none">Intelligence {currentLanguage}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 relative">
                <button
                  onClick={clearChat}
                  title="Effacer l'historique de chat"
                  className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setIsOpen(false); playSound("ding"); }}
                  className="p-1 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preferences Bar (Voice selector) - visible to choose from the beginning */}
            <div className="bg-slate-50 dark:bg-slate-900 border-b border-gray-150/80 dark:border-slate-800/80 px-3.5 py-2 flex items-center justify-between text-[11px] font-bold">
              <span className="text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                🗣️ Voix de lecture :
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setPreferredVoice("female");
                    localStorage.setItem("html5_semantic_chat_voice", "female");
                    playSound("ding");
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance("Voix féminine activée.");
                      u.lang = "fr-FR";
                      const voices = window.speechSynthesis.getVoices();
                      const fVoice = voices.find(v => v.lang.startsWith("fr") && 
                        (v.name.toLowerCase().includes("hortense") || v.name.toLowerCase().includes("pauline") || v.name.toLowerCase().includes("marie") || v.name.toLowerCase().includes("google") || v.name.toLowerCase().includes("female"))
                      );
                      if (fVoice) u.voice = fVoice;
                      u.pitch = 1.15;
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer text-[10px] flex items-center gap-1 ${
                    preferredVoice === "female"
                      ? "bg-purple-600 text-white shadow-3xs font-black"
                      : "bg-slate-200/60 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750"
                  }`}
                >
                  👩 Chloé (Femme)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreferredVoice("male");
                    localStorage.setItem("html5_semantic_chat_voice", "male");
                    playSound("ding");
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance("Voix masculine activée.");
                      u.lang = "fr-FR";
                      const voices = window.speechSynthesis.getVoices();
                      const mVoice = voices.find(v => v.lang.startsWith("fr") && 
                        (v.name.toLowerCase().includes("thomas") || v.name.toLowerCase().includes("nicolas") || v.name.toLowerCase().includes("paul") || v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("microsoft"))
                      );
                      if (mVoice) u.voice = mVoice;
                      u.pitch = 0.9;
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer text-[10px] flex items-center gap-1 ${
                    preferredVoice === "male"
                      ? "bg-purple-600 text-white shadow-3xs font-black"
                      : "bg-slate-200/60 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750"
                  }`}
                >
                  👨 Thomas (Homme)
                </button>
              </div>
            </div>

            {/* Chat Messages Body Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/25"
            >
              {messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2.5 max-w-[88%] min-w-0 ${isAssistant ? "" : "ml-auto flex-row-reverse"}`}
                  >
                    {/* Avatar icon */}
                    <div className={`p-1.5 rounded-lg text-xs flex-shrink-0 ${
                      isAssistant
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                        : "bg-indigo-120 text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300"
                    }`}>
                      {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
 
                    {/* Chat Bubble card */}
                    <div className={`p-3 rounded-2xl relative min-w-0 flex-1 overflow-hidden max-w-full w-full ${
                      isAssistant
                        ? "bg-white dark:bg-slate-800/80 text-gray-800 dark:text-slate-200 border border-gray-150/80 dark:border-slate-800/80 rounded-tl-none pr-8.5 shadow-3xs"
                        : "bg-purple-600 text-white rounded-tr-none shadow-3xs"
                    }`}>
                      {isAssistant ? (
                        <>
                          <FormattedText text={m.content} />
                          <button
                            type="button"
                            onClick={() => speakResponse(m.content, m.id)}
                            title={speakingMessageId === m.id ? "Arrêter la lecture vocale" : "Lire à haute voix (TTS)"}
                            className="absolute top-2.5 right-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1 rounded-md hover:bg-slate-100/80 dark:hover:bg-slate-700/50 cursor-pointer"
                          >
                            {speakingMessageId === m.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </>
                      ) : (
                        <p className="text-xs sm:text-sm font-semibold whitespace-pre-wrap break-words w-full max-w-full">{m.content}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Suggestions shortcuts when chat is empty or fresh */}
              {messages.length <= 1 && !isLoading && (
                <div className="pt-2 text-center space-y-1.5 select-none">
                  <span className="text-[10px] uppercase font-bold text-app-muted flex items-center justify-center gap-1">
                    <HelpCircle className="w-3 h-3 text-purple-500" />
                    <span>Suggestions de questions directes :</span>
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(s.text)}
                        className="text-[10px] font-bold py-1.5 px-2 rounded-xl text-left border bg-white dark:bg-slate-850 hover:bg-purple-50/40 dark:hover:bg-purple-950/10 border-gray-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-900 text-gray-700 dark:text-slate-300 transition-colors shadow-3xs cursor-pointer truncate"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bot thinking / Response generator loader status */}
              {isLoading && (
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 flex-shrink-0 animate-spin">
                    <Loader2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800/85 text-app-muted rounded-2xl border border-gray-150/60 dark:border-slate-800/60 rounded-tl-none shadow-3xs flex items-center gap-2">
                    <span className="text-xs font-semibold">Gemini rédige...</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </span>
                  </div>
                </div>
              )}

              {/* Error messages card block */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl text-xs text-rose-600 dark:text-rose-450 leading-relaxed font-semibold">
                  <span>⚠️ Erreur : {errorMessage}</span>
                </div>
              )}

              {/* Element boundary for autoscroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* File Staging Preview Bar (Shows prior to sending) */}
            {attachedFile && (
              <div className="px-3.5 py-2.5 bg-purple-500/10 dark:bg-purple-950/25 border-t border-gray-150 dark:border-slate-800 flex items-center justify-between gap-2.5 select-none animate-fadeIn">
                <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-slate-300 truncate">
                  {attachedFile.preview ? (
                    attachedFile.type.startsWith("image/") ? (
                      <img 
                        src={attachedFile.preview} 
                        alt="Aperçu miniature" 
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-lg object-cover border border-purple-200 dark:border-purple-900 shadow-3xs" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center border border-purple-200 dark:border-purple-900 shadow-3xs overflow-hidden">
                        <video 
                          src={attachedFile.preview} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/80 flex items-center justify-center border border-purple-200 dark:border-purple-900 shadow-3xs">
                      <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  )}
                  <div className="flex flex-col truncate leading-normal">
                    <span className="font-bold text-gray-800 dark:text-slate-200 truncate max-w-[190px]">
                      {attachedFile.name}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">
                      {(attachedFile.size / 1024).toFixed(1)} KB — Code / Média
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachedFile(null);
                    playSound("incorrect");
                  }}
                  title="Retirer ce fichier"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Footer Form */}
            <form 
              onSubmit={handleSendMessage}
              className="px-3.5 py-3 border-t border-gray-150 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 items-center"
            >
              {/* Hidden file input element */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*,.html,.css,.js,.ts,.tsx,.json,.py,.txt"
                className="hidden"
              />

              <div className="relative flex-1">
                {/* Plus upload button at the very beginning (left inside the input container) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Sélectionner un fichier de code, image ou vidéo"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-850/80 cursor-pointer flex items-center justify-center transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  id="chatbot-text-input"
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Posez votre question sur ${currentLanguage}...`}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-xl pl-10 pr-11 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-655"
                />

                <button
                  type="button"
                  onClick={startListening}
                  title={isListening ? "Reconnaissance vocale active - Cliquez pour couper" : "Saisir par reconnaissance vocale"}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse shadow-md"
                      : "text-gray-400 hover:text-purple-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850/80"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Mic className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() && !attachedFile}
                className={`p-2.5 rounded-xl text-white shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center justify-center minim-w-[36px] ${
                  inputMessage.trim() || attachedFile
                    ? "bg-purple-700 hover:bg-purple-800 hover:scale-105"
                    : "bg-gray-300 dark:bg-slate-850 text-gray-400 dark:text-slate-600 cursor-not-allowed"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button Bubble */}
      <motion.button
        id="chatbot-launcher-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          playSound("ding");
        }}
        className="h-14 px-4 rounded-full bg-purple-700 hover:bg-purple-800 text-white shadow-2xl flex items-center gap-2.5 cursor-pointer border border-purple-650"
      >
        <span className="relative">
          <MessageSquare className="w-6 h-6" />
          {!isOpen && unreadCount > 0 && (
            <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full border border-purple-700 flex items-center justify-center animate-pulse shadow-md">
              {unreadCount}
            </span>
          )}
          {!isOpen && unreadCount === 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-purple-705 animate-bounce">
              IA
            </span>
          )}
        </span>
        <span className="text-xs sm:text-sm font-black tracking-wide hidden sm:inline">
          Tech Lab Assistant
        </span>
      </motion.button>

    </div>
  );
}
