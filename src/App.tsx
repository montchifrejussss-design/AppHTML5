import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Award,
  FileCode2,
  ArrowRight,
  Terminal,
  Check,
  Copy,
  Info,
  Send,
  RefreshCw,
  HelpCircle,
  Accessibility,
  Sun,
  Moon,
  Youtube,
  Facebook,
  Linkedin,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  Database,
  History,
  Star,
  Languages,
  ChevronDown,
  Lightbulb,
  ArrowUpRight
} from "lucide-react";
import { SEMANTIC_TAGS, COMMON_ERRORS, INITIAL_AUDIT_TEMPLATES, INITIAL_GAME_BLOCKS, GAME_OPTIONS, GAME_DATA_BY_LANG, COMMON_ERRORS_BY_LANG, AUDIT_TEMPLATES_BY_LANG } from "./data";
import { CSS_PROPERTIES, JS_CONCEPTS, PYTHON_CONCEPTS, PHP_CONCEPTS } from "./cssData";
import { AuditResult, GameBlock, SemanticTag } from "./types";
import { getConcreteUseCases } from "./utils/useCases";
import developerLogo from "./assets/images/developer_logo_1780612371108.png";
import { playSound, getMuted, setMuted } from "./utils/audio";
import { getAllTags, saveTag, deleteTag, initDB } from "./utils/indexedDb";
import AdvancedChallenges from "./components/AdvancedChallenges";
import SemanticChatbot from "./components/SemanticChatbot";
import CssPlayground from "./components/CssPlayground";

function DeveloperLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <img
      src={developerLogo}
      alt="Logo Fré_Dév-Web Tech Lab"
      className={`${className} object-contain`}
      referrerPolicy="no-referrer"
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<"dictionary" | "practices" | "auditor" | "game" | "challenges" | "manifesto">("dictionary");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("HTML5");
  const [isPageLangDropdownOpen, setIsPageLangDropdownOpen] = useState(false);

  const [isMuted, setIsMuted] = useState<boolean>(() => getMuted());

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      setMuted(next);
      return next;
    });
  };

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  // State for Dictionary & IndexedDB
  const [tags, setTags] = useState<SemanticTag[]>(() => SEMANTIC_TAGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedTag, setExpandedTag] = useState<string | null>("<main>");

  const activeLanguageTags = (() => {
    switch (selectedLanguage) {
      case "CSS":
        return CSS_PROPERTIES;
      case "JavaScript":
        return JS_CONCEPTS;
      case "Python":
        return PYTHON_CONCEPTS;
      case "PHP":
        return PHP_CONCEPTS;
      case "HTML5":
      default:
        return tags;
    }
  })();

  // Synchronize expandedTag when language changes to show the first entry by default
  useEffect(() => {
    if (activeLanguageTags && activeLanguageTags.length > 0) {
      setExpandedTag(activeLanguageTags[0].name);
    } else {
      setExpandedTag(null);
    }
  }, [selectedLanguage, tags]);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showConcreteExamples, setShowConcreteExamples] = useState(false);

  useEffect(() => {
    setShowConcreteExamples(false);
  }, [expandedTag]);

  const [readTags, setReadTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("html5_read_tags");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentLanguageReadCount = readTags.filter(tName => 
    activeLanguageTags.some(alt => alt.name === tName)
  ).length;

  const dictionaryTitle = (() => {
    switch (selectedLanguage) {
      case "CSS":
        return "Le dictionnaire ultime des propriétés CSS";
      case "JavaScript":
        return "Le guide de survie de la syntaxe JavaScript";
      case "Python":
        return "Le guide rapide des concepts fondamentaux Python";
      case "PHP":
        return "Les bases structurelles incontournables du langage PHP";
      default:
        return "Le dictionnaire ultime des balises sémantiques HTML5";
    }
  })();

  const dictionaryDesc = (() => {
    switch (selectedLanguage) {
      case "CSS":
        return (
          <>
            <strong>CSS</strong> régit l&#39;apparence, la mise en page et l&#39;animation de vos documents. Parcourez <strong>les propriétés indispensables</strong> de mise en page moderne (Flexbox, Grid), apprenez à éviter les pièges d&#39;affichage et intégrez proprement de parfaits styles certifiés modernes.
          </>
        );
      case "JavaScript":
        return (
          <>
            <strong>JavaScript</strong> insuffle de l&#39;interactivité côté client. Comprenez les variables de bloc, la programmation asynchrone (Promises, Async/Await), la manipulation du DOM, et évitez les pièges de portée de variable.
          </>
        );
      case "Python":
        return (
          <>
            <strong>Python</strong> se distingue par sa lisibilité sémantique et son extraordinaire clarté d&#39;écriture. Maîtrisez la syntaxe, les types de structures et fonctions indispensables pour coder proprement.
          </>
        );
      case "PHP":
        return (
          <>
            <strong>PHP</strong> propulse le web dynamique côté serveur. Découvrez comment structurer vos pages, echo vos données proprement au sein du balisage et intégrer des templates sécurisés.
          </>
        );
      default:
        return (
          <>
            HTML5 décrit le <strong>sens</strong> de vos contenus. Parcourez chaque élément officiel, comprenez son rôle d&#39;accessibilité (A11y/SEO), examinez les erreurs d&#39;usage et intégrez des fragments conformes au W3C directement dans vos projets.
          </>
        );
    }
  })();

  const searchPlaceholder = (() => {
    switch (selectedLanguage) {
      case "CSS":
        return "Rechercher une propriété CSS (ex: display, position, flex, margin, gap...)";
      case "JavaScript":
        return "Rechercher un concept JS (ex: const, function, Promise, fetch...)";
      case "Python":
        return "Rechercher une notion Python (ex: def, return, for...)";
      case "PHP":
        return "Rechercher une notion PHP (ex: echo, isset, array...)";
      default:
        return "Rechercher une balise html (ex: nav, main, article, figure...)";
    }
  })();

  const [favoriteTags, setFavoriteTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("html5_favorite_tags");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavoriteTag = (tagName: string) => {
    setFavoriteTags((prev) => {
      const next = prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName];
      try {
        localStorage.setItem("html5_favorite_tags", JSON.stringify(next));
      } catch (e) {}
      playSound("ding");
      return next;
    });
  };

  // Modal form states for Add Custom Tag
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagCategory, setNewTagCategory] = useState<"structure" | "content" | "media" | "interactive" | "inline">("structure");
  const [newTagDesc, setNewTagDesc] = useState("");
  const [newTagUsage, setNewTagUsage] = useState("");
  const [newTagDonts, setNewTagDonts] = useState("");
  const [newTagCode, setNewTagCode] = useState("");

  // Load tags from IndexedDB on component mount
  useEffect(() => {
    let active = true;
    getAllTags().then((loaded) => {
      if (active && loaded && loaded.length > 0) {
        setTags(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleTagRead = (tagName: string) => {
    setReadTags((prev) => {
      const next = prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName];
      try {
        localStorage.setItem("html5_read_tags", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleAddCustomTag = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim() || !newTagDesc.trim()) return;

    let formattedName = newTagName.trim();
    if (!formattedName.startsWith("<") && !formattedName.endsWith(">")) {
      formattedName = `<${formattedName}>`;
    }

    const newTag: SemanticTag = {
      name: formattedName,
      category: newTagCategory,
      description: newTagDesc.trim(),
      usage: newTagUsage.trim() || "Consultez la documentation W3C.",
      donts: newTagDonts.trim() || "À utiliser conformément aux standards.",
      codeSnippet: newTagCode.trim() || `<!-- Exemple pour ${formattedName} -->\n${formattedName}\n  <!-- Contenu sémantique -->\n${formattedName.replace("<", "</")}`
    };

    await saveTag(newTag);
    const loaded = await getAllTags();
    setTags(loaded);
    setExpandedTag(formattedName);
    playSound("success");

    // Reset fields
    setNewTagName("");
    setNewTagDesc("");
    setNewTagUsage("");
    setNewTagDonts("");
    setNewTagCode("");
    setIsAddModalOpen(false);
  };

  const handleResetTags = async () => {
    if (confirm("Voulez-vous réinitialiser le dictionnaire aux balises d'origine ? Toutes vos balises personnalisées seront effacées.")) {
      try {
        const db = await initDB();
        const transaction = db.transaction("dictionary_tags", "readwrite");
        const store = transaction.objectStore("dictionary_tags");
        store.clear();
        for (const t of SEMANTIC_TAGS) {
          store.put(t);
        }
        const loaded = await getAllTags();
        setTags(loaded);
        playSound("ding");
      } catch (err) {
        console.error("Failed to reset database", err);
      }
    }
  };

  const handleDeleteTag = async (tagName: string) => {
    if (confirm(`Voulez-vous supprimer la balise ${tagName} de votre dictionnaire local ?`)) {
      await deleteTag(tagName);
      const loaded = await getAllTags();
      setTags(loaded);
      setExpandedTag(loaded.length > 0 ? loaded[0].name : null);
      playSound("incorrect");
    }
  };

  // State for Practices
  const [selectedPracticeIndex, setSelectedPracticeIndex] = useState(0);

  // State for Auditor
  const [codeToAudit, setCodeToAudit] = useState(INITIAL_AUDIT_TEMPLATES[0].code);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditError, setAuditError] = useState<{ message: string; isConfig: boolean } | null>(null);

  // State for Game
  const [gameLanguage, setGameLanguage] = useState<string>("HTML5");
  const [gameBlocks, setGameBlocks] = useState<GameBlock[]>([]);
  const [gameFeedback, setGameFeedback] = useState<{ isWon: boolean; percentage: number } | null>(null);

  // Sync game language, practice index, and auditor code with selected language
  useEffect(() => {
    if (GAME_DATA_BY_LANG[selectedLanguage]) {
      setGameLanguage(selectedLanguage);
    }
    setSelectedPracticeIndex(0);
    const templates = AUDIT_TEMPLATES_BY_LANG[selectedLanguage] || AUDIT_TEMPLATES_BY_LANG.HTML5;
    if (templates && templates.length > 0) {
      setCodeToAudit(templates[0].code);
    }
  }, [selectedLanguage]);

  // Handle Clipboard Copy
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter semantic tags
  const filteredTags = activeLanguageTags.filter((tag) => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.usage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "favorites" && favoriteTags.includes(tag.name)) ||
      tag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Load / Restart Game
  const initializeGame = (lang: string = gameLanguage) => {
    const targetData = GAME_DATA_BY_LANG[lang] || GAME_DATA_BY_LANG["HTML5"];
    const freshBlocks = targetData.blocks.map((block) => ({
      ...block,
      selectedTag: "",
      isCorrect: undefined
    }));
    setGameBlocks(freshBlocks);
    setGameFeedback(null);
  };

  useEffect(() => {
    initializeGame(gameLanguage);
  }, [gameLanguage]);

  // Set tag selection in game
  const handleGameTagSelect = (id: string, tag: string) => {
    setGameBlocks((prev) =>
      prev.map((block) => {
        if (block.id === id) {
          return { ...block, selectedTag: tag };
        }
        return block;
      })
    );
  };

  // Validate Game
  const checkGameAnswers = () => {
    let correctCount = 0;
    const validated = gameBlocks.map((block) => {
      const isCorrect = block.selectedTag === block.correctTag;
      if (isCorrect) correctCount++;
      return { ...block, isCorrect };
    });
    setGameBlocks(validated);
    const percentage = Math.round((correctCount / gameBlocks.length) * 100);
    setGameFeedback({
      isWon: percentage === 100,
      percentage
    });

    // Play ultra-soft audio rewards based on completion
    if (percentage === 100) {
      playSound("success");
    } else if (percentage > 0) {
      playSound("ding");
    } else {
      playSound("incorrect");
    }
  };

  // Call API for HTML Audit
  const handleRunAudit = async () => {
    if (!codeToAudit.trim()) return;
    setIsAuditing(true);
    setAuditError(null);
    setAuditResult(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeSnippet: codeToAudit })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.isConfigError) {
          setAuditError({
            message: data.message || "La clé Gemini n'est pas installée.",
            isConfig: true
          });
        } else {
          throw new Error(data.error || "Erreur inconnue lors de l'audit.");
        }
        return;
      }

      setAuditResult(data);
      playSound("audit");
    } catch (err: any) {
      console.error(err);
      setAuditError({
        message: err.message || "Erreur de connexion au serveur d'audit sémantique.",
        isConfig: false
      });
    } finally {
      setIsAuditing(false);
    }
  };

  // Load template into editor
  const loadTemplate = (code: string) => {
    setCodeToAudit(code);
    setAuditResult(null);
    setAuditError(null);
  };

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-app-bg text-app-text transition-colors duration-200 selection:bg-purple-100 selection:text-purple-900 font-sans">
      
      {/* Header Banner */}
      <header id="main-header" className="relative z-40 bg-header-bg border-b border-header-border transition-colors duration-200 shadow-xs px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-sm ring-4 ring-purple-100/50 dark:ring-purple-900/30">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800/80 transition-colors">{selectedLanguage} Sémantique</span>
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800/80 transition-colors">W3C Guide</span>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800/60 text-app-text rounded border border-card-border transition-colors">
                  <span className="text-app-muted">Dev :</span>
                  <DeveloperLogo className="w-5 h-4" />
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold whitespace-nowrap">Fré_Dév-Web Tech Lab</span>
                </div>

                {/* Inline Language Selector Dropdown */}
                <div className="relative">
                  <button
                    id="page-lang-selector-btn"
                    type="button"
                    onClick={() => {
                      setIsPageLangDropdownOpen(!isPageLangDropdownOpen);
                      playSound("ding");
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 hover:bg-purple-200/90 dark:bg-purple-950 text-purple-800 dark:text-purple-300 rounded border border-purple-300 dark:border-purple-800 transition-colors uppercase tracking-wider font-bold font-mono text-[10px] cursor-pointer shadow-xs"
                    title="Choisir un autre langage de programmation"
                  >
                    <Languages className="w-3 h-3 text-purple-650 dark:text-purple-400" />
                    <span className="ml-1">Langage : <span className="font-black text-purple-950 dark:text-purple-100 bg-purple-200/30 dark:bg-purple-900/60 px-1 py-0.2 rounded">{selectedLanguage}</span></span>
                    <ChevronDown className={`ml-1 w-2.5 h-2.5 opacity-75 transition-transform duration-200 ${isPageLangDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isPageLangDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-slate-950 border border-gray-250 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden text-gray-800 dark:text-slate-100 flex flex-col py-1"
                      >
                        <div className="px-3 py-1.5 text-[9px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-slate-500 border-b border-gray-100 dark:border-slate-900 mb-1">
                          Apprendre autre :
                        </div>
                        {["HTML5", "CSS", "JavaScript", "Python", "PHP"].map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setIsPageLangDropdownOpen(false);
                              playSound("success");
                              setActiveTab("dictionary");
                            }}
                            className={`px-3 py-1.5 text-left text-[11px] font-bold transition-colors hover:bg-purple-50/80 dark:hover:bg-purple-950/40 w-full cursor-pointer flex items-center justify-between ${
                              selectedLanguage === lang 
                                ? "text-purple-750 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/20" 
                                : ""
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                lang === "HTML5" ? "bg-orange-500" :
                                lang === "CSS" ? "bg-blue-500" :
                                lang === "JavaScript" ? "bg-yellow-500" :
                                lang === "Python" ? "bg-cyan-500" :
                                "bg-purple-505"
                              }`} />
                              <span>{lang}</span>
                            </span>
                            {selectedLanguage === lang && <Check className="w-3 h-3 text-purple-600 dark:text-purple-400" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-app-text transition-colors mt-0.5">Balisage Sémantique {selectedLanguage} de A à Z</h1>
            </div>
          </div>

          {/* Navigation Controls & Theme Toggle */}
          <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
            <nav id="navigation-bar" aria-label="Menu principal" className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 transition-all">
              <button
                id="nav-tab-dictionary"
                onClick={() => setActiveTab("dictionary")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "dictionary"
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {selectedLanguage === "HTML5"
                    ? "Dictionnaire A-Z"
                    : selectedLanguage === "CSS"
                    ? "Cours & Propriétés CSS"
                    : selectedLanguage === "JavaScript"
                    ? "Cours & Syntaxe JS"
                    : selectedLanguage === "Python"
                    ? "Cours & Syntaxe Python"
                    : "Cours PHP"}
                </span>
              </button>
              <button
                id="nav-tab-practices"
                onClick={() => setActiveTab("practices")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "practices"
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Bonnes Pratiques</span>
              </button>
              <button
                id="nav-tab-auditor"
                onClick={() => setActiveTab("auditor")}
                className={`relative flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "auditor"
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Auditeur IA</span>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
              </button>

              <button
                id="nav-tab-game"
                onClick={() => { setActiveTab("game"); initializeGame(); }}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "game"
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Jeu Quiz</span>
              </button>

              <button
                id="nav-tab-challenges"
                onClick={() => { setActiveTab("challenges"); }}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "challenges"
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <FileCode2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Défis Avancés</span>
              </button>
              <button
                id="nav-tab-manifesto"
                onClick={() => setActiveTab("manifesto")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "manifesto"
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <Accessibility className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Pourquoi ?</span>
              </button>
            </nav>

            {/* Toggle Audio button */}
            <button
              id="audio-toggle-btn"
              onClick={toggleMute}
              aria-label={isMuted ? "Activer les sons" : "Couper le son"}
              title={isMuted ? "Activer le retour sonore" : "Sourdine"}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 shadow-xs transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-4.5 h-4.5 text-rose-500" />
              ) : (
                <Volume2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* Toggle Theme button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Basculer le thème"
              title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
              className="p-2.5 rounded-xl border border-gray-205 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 shadow-xs transition-colors focus:outline-none cursor-pointer flex-shrink-0"
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Strip / Gamification Dashboard inside Header */}
        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-header-border/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">Académie Sémantique :</span>
            <div className="flex items-center gap-1.5 bg-purple-100/60 dark:bg-purple-950/40 px-2 py-0.5 rounded text-[11px] font-bold text-purple-850 dark:text-purple-300 border border-purple-200/40 dark:border-purple-900/40">
              {selectedLanguage === "HTML5" ? (
                <>
                  <span>{readTags.length + gameBlocks.filter(b => b.isCorrect === true).length}</span>
                  <span className="text-purple-400/50">/</span>
                  <span>{tags.length + gameBlocks.length}</span>
                </>
              ) : (
                <>
                  <span>{currentLanguageReadCount}</span>
                  <span className="text-purple-400/50">/</span>
                  <span>{activeLanguageTags.length}</span>
                </>
              )}
              <span className="text-[10px] font-medium text-app-muted">validés</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Dictionary progress bar */}
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-app-muted">
                <span className="flex items-center gap-1">📘 Encyclopédie</span>
                <span className="font-mono text-purple-600 dark:text-purple-405">
                  {activeLanguageTags.length > 0 ? Math.round((currentLanguageReadCount / activeLanguageTags.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-700/40">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${activeLanguageTags.length > 0 ? (currentLanguageReadCount / activeLanguageTags.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Quiz progress bar */}
            {(() => {
              const solved = gameBlocks.filter(b => b.isCorrect === true).length;
              const total = gameBlocks.length || 6;
              const pct = Math.round((solved / total) * 100);
              return (
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-app-muted">
                    <span className="flex items-center gap-1">🏆 Quiz Pratique</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">{pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-700/40">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </header>

      {/* Main Educational Workspace */}
      <main id="main-content-area" className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
        <AnimatePresence mode="wait">
          {/* ==================== TAB 1: DICTIONARY ==================== */}
          {activeTab === "dictionary" && (
            <motion.div
              key="dictionary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              id="panel-dictionary"
              className="space-y-6"
            >
            {/* Banner Intro */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
              
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono font-medium text-purple-200 border border-white/5">Encyclopédie Interactive</span>
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white leading-tight">
                  {dictionaryTitle}
                </h2>
                <p className="text-gray-350 text-xs sm:text-sm leading-relaxed">
                  {dictionaryDesc}
                </p>
              </div>
            </div>
                 {/* Filter controls and Search Bar */}
            <div className="bg-card-bg rounded-xl p-4 shadow-2xs border border-card-border flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5" />
                <input
                  id="search-tags"
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input-border focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 bg-input-bg text-app-text text-xs sm:text-sm placeholder-gray-400 dark:placeholder-slate-500 font-medium"
                />
              </div>

              {/* Categorization chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-app-muted uppercase mr-1">Filtrer:</span>
                {[
                  { value: "all", label: "Toutes" },
                  { value: "favorites", label: "Favoris ★" },
                  { value: "structure", label: "Structure" },
                  { value: "content", label: "Contenu" },
                  { value: "interactive", label: "Interactives" },
                  { value: "inline", label: "En ligne" }
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat.value
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* IndexedDB Offline operations bar */}
            {selectedLanguage === "HTML5" ? (
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-150 dark:border-slate-800 p-3.5 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-app-muted">
                  <Database className="w-4 h-4 text-purple-600 dark:text-purple-405 animate-pulse" />
                  <span>Synchronisation locale active (IndexDB hors-ligne)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer focus:outline-hidden"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une balise</span>
                  </button>
                  <button
                    onClick={handleResetTags}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card-bg text-slate-700 dark:text-slate-300 border border-card-border hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg text-xs font-bold transition-all shadow-2xs hover:brightness-105 cursor-pointer focus:outline-hidden"
                    title="Restaurer le dictionnaire initial"
                  >
                    <History className="w-3.5 h-3.5 text-gray-500" />
                    <span>Restaurer</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-purple-50/40 dark:bg-purple-950/10 border border-purple-205/40 dark:border-purple-900/10 p-3 rounded-xl flex items-center gap-2 text-[11px] font-bold text-purple-800 dark:text-purple-400">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-405 animate-pulse" />
                <span>Académie Sémantique — Module de référence {selectedLanguage} (Lecture Seule)</span>
              </div>
            )}

            {/* Dual Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: list */}
              <div className="lg:col-span-5 bg-card-bg rounded-xl border border-card-border shadow-2xs max-h-[500px] overflow-y-auto overflow-x-hidden divide-y divide-gray-100 dark:divide-slate-700">
                <div className="p-3 bg-panel-bg border-b border-panel-border sticky top-0 flex justify-between items-center z-10">
                  <span className="text-xs font-bold text-app-muted uppercase">
                    {selectedLanguage === "HTML5"
                      ? "Balises correspondantes"
                      : selectedLanguage === "CSS"
                      ? "Propriétés correspondantes"
                      : "Concepts correspondants"}
                  </span>
                  <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                    {filteredTags.length}
                  </span>
                </div>

                {filteredTags.length === 0 ? (
                  <div className="p-8 text-center space-y-2 text-gray-550">
                    <Info className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="font-semibold text-xs">
                      {selectedLanguage === "HTML5"
                        ? "Aucune balise trouvée"
                        : selectedLanguage === "CSS"
                        ? "Aucune propriété trouvée"
                        : "Aucun concept trouvé"}
                    </p>
                  </div>
                ) : (
                  filteredTags.map((tag) => {
                    const isRead = readTags.includes(tag.name);
                    return (
                      <div
                        key={tag.name}
                        onClick={() => setExpandedTag(tag.name)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setExpandedTag(tag.name);
                          }
                        }}
                        className={`w-full text-left p-3.5 hover:bg-dict-item-hover hover:translate-x-1.5 transition-all duration-200 flex justify-between items-center gap-3 cursor-pointer outline-none ${
                          expandedTag === tag.name ? "bg-purple-50/50 dark:bg-purple-950/20 border-r-3 border-purple-600 font-medium" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <code className="text-xs sm:text-sm font-bold text-purple-800 dark:text-purple-300 font-mono bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded flex items-center gap-1">
                              {isRead && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                              <span>{tag.name}</span>
                            </code>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                              tag.category === "structure" ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" :
                              tag.category === "content" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" :
                              tag.category === "interactive" ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300" :
                              "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
                            }`}>
                              {tag.category}
                            </span>
                            {isRead && (
                              <span className="text-[10px] font-sans text-emerald-600 dark:text-emerald-400 font-medium whitespace-nowrap">
                                Lu 👍
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-1 mt-1 font-normal">{tag.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavoriteTag(tag.name);
                            }}
                            title={favoriteTags.includes(tag.name) ? "Retirer des favoris" : "Épingler dans les favoris"}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-amber-500 hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                favoriteTags.includes(tag.name)
                                  ? "fill-amber-400 text-amber-500"
                                  : "text-gray-350 dark:text-slate-600"
                              }`}
                            />
                          </button>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Detailed tag interaction card */}
              <div className="lg:col-span-7">
                {expandedTag ? (() => {
                  const tag = activeLanguageTags.find((t) => t.name === expandedTag);
                  if (!tag) return null;
                  return (
                    <div className="bg-card-bg rounded-xl border border-card-border shadow-2xs overflow-hidden">
                      {/* Header Segment */}
                      <div className="p-5 bg-gradient-to-tr from-purple-50/20 to-indigo-50/20 dark:from-purple-950/15 dark:to-indigo-950/15 border-b border-card-border">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400 tracking-wider">
                              {selectedLanguage === "HTML5" 
                                ? "Rôle Sémantique Officiel" 
                                : selectedLanguage === "CSS" 
                                ? "Comportement Graphique Modern" 
                                : "Spécification Syntaxique"}
                            </span>
                            
                            <div className="mt-2 flex flex-wrap items-baseline gap-2">
                              <code className="text-2xl font-black text-indigo-950 dark:text-indigo-200 font-mono">
                                {tag.name}
                              </code>
                              <span className="px-2 py-0.5 bg-white dark:bg-slate-755 text-[9px] font-mono text-gray-550 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded uppercase font-bold">
                                Catégorie: {tag.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 self-start flex-wrap">
                            <button
                              onClick={() => toggleFavoriteTag(tag.name)}
                              title={favoriteTags.includes(tag.name) ? "Retirer des favoris" : "Épingler dans les favoris"}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer shadow-2xs ${
                                favoriteTags.includes(tag.name)
                                  ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 font-bold"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                              }`}
                            >
                              <Star className={`w-4 h-4 ${favoriteTags.includes(tag.name) ? "fill-white text-white font-bold" : "text-amber-500"}`} />
                              <span>{favoriteTags.includes(tag.name) ? "Mise en favori ✔" : "Épingler"}</span>
                            </button>

                            <button
                              onClick={() => toggleTagRead(tag.name)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer shadow-2xs ${
                                readTags.includes(tag.name)
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 font-bold"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-705"
                              }`}
                            >
                              <CheckCircle2 className={`w-4 h-4 ${readTags.includes(tag.name) ? "text-white" : "text-slate-400"}`} />
                              <span>{readTags.includes(tag.name) ? "Appris ✔" : "Marquer comme appris"}</span>
                            </button>

                            {selectedLanguage === "HTML5" && (
                              <button
                                onClick={() => handleDeleteTag(tag.name)}
                                title="Supprimer cette balise"
                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 cursor-pointer shadow-2xs transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pb-1">
                        <p className="text-xs sm:text-sm text-app-muted leading-relaxed font-semibold">
                          {tag.description}
                        </p>
                      </div>

                      {/* Content Blocks */}
                      <div className="p-5 space-y-4">
                        {/* Usage guide */}
                        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-3.5 space-y-1.5">
                          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Bonnes pratiques d'utilisation (À Faire)</span>
                          </h4>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                            {tag.usage}
                          </p>
                        </div>

                        {/* Mistakes to avoid */}
                        <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/60 rounded-xl p-3.5 space-y-1.5">
                          <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span>Les pièges classiques (À Éviter)</span>
                          </h4>
                          <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                            {tag.donts}
                          </p>
                        </div>

                        {/* Concrete Use Cases */}
                        <div 
                          onMouseEnter={() => setShowConcreteExamples(true)}
                          onMouseLeave={() => setShowConcreteExamples(false)}
                          className="bg-blue-50/45 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 space-y-2 transition-all duration-200"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setShowConcreteExamples(!showConcreteExamples);
                              playSound("ding");
                            }}
                            className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                          >
                            <span className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide flex items-center gap-1.5">
                              <Lightbulb className="w-4 h-4 text-amber-500 animate-pulse" />
                              <span>Cas d'utilisation concrets (1 à 2 exemples)</span>
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                              <span>{showConcreteExamples ? "Masquer" : "Afficher"}</span>
                              <ArrowUpRight className={`w-4 h-4 transition-transform duration-300 ${
                                showConcreteExamples ? "rotate-45 text-blue-600" : "rotate-0 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                              }`} />
                            </div>
                          </button>

                          <AnimatePresence initial={false}>
                            {showConcreteExamples && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                  {getConcreteUseCases(tag, selectedLanguage).map((useCase, index) => (
                                    <div key={index} id={`usecase-box-${index}`} className="bg-white/80 dark:bg-slate-800/80 p-3 rounded-lg border border-blue-500/10 dark:border-slate-700/60 space-y-1">
                                      <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 block font-sans">
                                        📌 {useCase.title}
                                      </span>
                                      <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                                        {useCase.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {selectedLanguage === "CSS" && (
                          <CssPlayground tag={tag} isDark={isDark} />
                        )}

                        {/* Interactive Live Code Block */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                              <Terminal className="w-4 h-4 text-gray-400" />
                              <span>Exemple d'implémentation</span>
                            </span>
                            
                            <button
                              onClick={() => handleCopy(tag.codeSnippet, `tag-${tag.name}`)}
                              className="text-xs flex items-center gap-1 text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              {copiedText === `tag-${tag.name}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Copié!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copier HTML</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="relative rounded-lg overflow-hidden border border-slate-200">
                            <pre className="bg-slate-900 text-slate-100 p-3.5 overflow-x-auto font-mono text-xs leading-5">
                              <code>{tag.codeSnippet}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 bg-white">
                    <BookOpen className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <p className="text-xs">Sélectionnez une balise sémantique pour afficher ses recommandations de A à Z.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Modal for Adding Custom Semantical Tag */}
            <AnimatePresence>
              {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAddModalOpen(false)}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
                  />

                  {/* Modal Container */}
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-card-bg rounded-2xl border border-card-border shadow-xl hover:shadow-2xl relative max-w-lg w-full max-h-[90vh] overflow-y-auto overflow-x-hidden p-6 z-10 space-y-4"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-card-border">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-600" />
                        <h3 className="text-base font-black text-gray-901 dark:text-white">Créer une balise locale</h3>
                      </div>
                      <button
                        onClick={() => setIsAddModalOpen(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-slate-350 cursor-pointer"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddCustomTag} className="space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-app-muted font-sans">Nom de la balise</label>
                          <input
                            type="text"
                            required
                            placeholder="ex: <header> ou <main>"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-app-text focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-app-muted font-sans">Catégorie sémantique</label>
                          <select
                            value={newTagCategory}
                            onChange={(e) => setNewTagCategory(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-app-text focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                          >
                            <option value="structure">Structure</option>
                            <option value="content">Contenu</option>
                            <option value="media">Média</option>
                            <option value="interactive">Interactive</option>
                            <option value="inline">En ligne (Inline)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-app-muted font-sans font-sans">Description (Simple & succincte)</label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Décrivez brièvement le rôle de cette balise informatique..."
                          value={newTagDesc}
                          onChange={(e) => setNewTagDesc(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-app-text focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-app-muted font-sans">Bonne pratique (Usage)</label>
                          <textarea
                            rows={3}
                            placeholder="Quand l'utiliser spécifiquement ?"
                            value={newTagUsage}
                            onChange={(e) => setNewTagUsage(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-app-text focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-app-muted font-sans font-sans">Mauvaise pratique (À éviter)</label>
                          <textarea
                            rows={3}
                            placeholder="Que faut-il ne pas faire ?"
                            value={newTagDonts}
                            onChange={(e) => setNewTagDonts(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-app-text focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-app-muted font-sans font-sans">Exemple de code HTML conseillé</label>
                        <textarea
                          rows={2}
                          placeholder="Exemple: <div><header>...</header></div>"
                          value={newTagCode}
                          onChange={(e) => setNewTagCode(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-input-border bg-input-bg text-app-text focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-xs leading-relaxed"
                        />
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddModalOpen(false)}
                          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-755 dark:text-slate-300 font-bold cursor-pointer"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Sauvegarder
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ==================== TAB 2: PRACTICES & ERRORS ==================== */}
        {activeTab === "practices" && (
          <motion.div
            key="practices"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="panel-practices"
            className="space-y-6"
          >
            <div className="max-w-3xl space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">Chasse aux erreurs</span>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-gray-900 dark:text-white">
                {selectedLanguage === "HTML5"
                  ? "La chasse au \"Div Soup\" (Soupe de Divs)"
                  : selectedLanguage === "CSS"
                  ? "La chasse aux antipatterns CSS"
                  : selectedLanguage === "JavaScript"
                  ? "La chasse au code spaghetti JS"
                  : selectedLanguage === "Python"
                  ? "La chasse aux antipatterns Python"
                  : "La chasse aux antipatterns PHP"}
              </h2>
              <p className="text-gray-600 dark:text-slate-350 text-xs sm:text-sm leading-relaxed">
                {selectedLanguage === "HTML5"
                  ? "Visualisez des structures comparatives côte à côte. Comprenez pourquoi l'utilisation abusive de balises neutres comme <div> ou <span> exclut de nombreux utilisateurs et pénalise votre SEO."
                  : "Visualisez des structures comparatives côte à côte. Comprenez comment éviter les mauvaises pratiques courantes pour écrire un code propre, performant, robuste et lisible."}
              </p>
            </div>

            {/* Error selector tabs */}
            {(() => {
              const currentCommonErrors = COMMON_ERRORS_BY_LANG[selectedLanguage] || COMMON_ERRORS_BY_LANG.HTML5;
              const currentErr = currentCommonErrors[selectedPracticeIndex] || currentCommonErrors[0];
              return (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {currentCommonErrors.map((err, idx) => (
                      <button
                        key={err.id}
                        onClick={() => setSelectedPracticeIndex(idx)}
                        className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                          selectedPracticeIndex === idx
                            ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 text-rose-950 dark:text-rose-200 font-bold"
                            : "bg-card-bg border-card-border hover:bg-panel-bg text-app-text"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-wider text-rose-600 dark:text-rose-405 block mb-1">Erreur de type {idx + 1}</span>
                        <p className="line-clamp-1">{err.title}</p>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Fail Block */}
                    <div className="bg-card-bg rounded-xl border border-rose-250 dark:border-rose-900/60 overflow-hidden flex flex-col shadow-2xs">
                    <div className="p-3 bg-rose-50/50 dark:bg-rose-950/35 border-b border-rose-100/60 dark:border-rose-900 flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-850 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Mauvaise pratique (À Éviter)</span>
                      </span>
                      <span className="text-[9px] font-mono bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded font-bold uppercase">
                        {selectedLanguage === "HTML5" ? "Sémantique absente" :
                         selectedLanguage === "CSS" ? "Syntaxe inefficace" :
                         selectedLanguage === "JavaScript" ? "Impératif Spaghetti" :
                         selectedLanguage === "Python" ? "Syntaxe Non-Idiomatique" :
                         "Faille de sécurité"}
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-rose-950 dark:text-rose-200">{currentErr.title}</h3>
                        <p className="text-xs text-app-muted mt-1 leading-relaxed">{currentErr.description}</p>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border border-rose-150 dark:border-rose-900/40 text-xs">
                        <div className="bg-rose-100/50 dark:bg-rose-900/45 text-red-800 dark:text-rose-300 font-mono px-3 py-1 font-bold">
                          {selectedLanguage === "HTML5" ? "bad_code.html" :
                           selectedLanguage === "CSS" ? "bad_code.css" :
                           selectedLanguage === "JavaScript" ? "bad_code.js" :
                           selectedLanguage === "Python" ? "bad_code.py" :
                           "bad_code.php"}
                        </div>
                        <pre className="bg-slate-900 text-rose-105 p-3.5 overflow-x-auto font-mono text-xs leading-5">
                          <code>{currentErr.badCode}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Success Block */}
                  <div className="bg-card-bg rounded-xl border border-emerald-250 dark:border-emerald-900/60 overflow-hidden flex flex-col shadow-2xs">
                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/35 border-b border-emerald-100/60 dark:border-emerald-900 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-850 dark:text-emerald-305 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Bonne pratique (À Faire)</span>
                      </span>
                      <span className="text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">
                        {selectedLanguage === "HTML5" ? "Structure valide A11y & W3C" :
                         selectedLanguage === "CSS" ? "CSS Moderne & Opti" :
                         selectedLanguage === "JavaScript" ? "JS Fonctionnel" :
                         selectedLanguage === "Python" ? "Philosophie Pythonic" :
                         "Code Sécurisé PDO"}
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                          {selectedLanguage === "HTML5" ? "Correction Sémantique" :
                           selectedLanguage === "CSS" ? "Correction CSS" :
                           selectedLanguage === "JavaScript" ? "Correction JavaScript" :
                           selectedLanguage === "Python" ? "Correction Pythonic" :
                           "Correction Sécurité PHP"}
                        </h3>
                        <p className="text-xs text-app-muted mt-1 leading-relaxed">
                          {selectedLanguage === "HTML5" ? "Une structure limpide qui donne du sens directement lors de la compilation par le navigateur." :
                           selectedLanguage === "CSS" ? "Des propriétés optimisées et réutilisables, réduisant la redondance et s'assurant de l'adaptabilité." :
                           selectedLanguage === "JavaScript" ? "Du code immutable modulaire utilisant des builtins optimisés limitant les effets de bord." :
                           selectedLanguage === "Python" ? "Une syntaxe idiomatique compacte qui réduit les lignes de code tout en augmentant la lisibilité." :
                           "Une structure blindée isolant le code SQL des variables utilisateur et assainissant les rendus."}
                        </p>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border border-emerald-150 dark:border-emerald-900/40 text-xs">
                        <div className="bg-emerald-100/50 dark:bg-emerald-900/45 text-emerald-805 dark:text-emerald-300 font-mono px-3 py-1 font-bold">
                          {selectedLanguage === "HTML5" ? "clean_semantic.html" :
                           selectedLanguage === "CSS" ? "clean_style.css" :
                           selectedLanguage === "JavaScript" ? "clean_functional.js" :
                           selectedLanguage === "Python" ? "clean_idiomatic.py" :
                           "clean_secure.php"}
                        </div>
                        <pre className="bg-slate-900 text-emerald-100 p-3.5 overflow-x-auto font-mono text-xs leading-5">
                          <code>{currentErr.goodCode}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Expert Insight Panel */}
                  <div className="xl:col-span-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-150 dark:border-indigo-900 p-4 space-y-1.5">
                    <span className="text-[9px] font-bold text-indigo-800 dark:text-indigo-400 uppercase tracking-wider">Pourquoi c'est mieux ?</span>
                    <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 font-medium leading-relaxed">
                      {currentErr.explanation}
                    </p>
                  </div>

                </div>
              </>
              );
            })()}
          </motion.div>
        )}

        {/* ==================== TAB 3: AUDITOR ==================== */}
        {activeTab === "auditor" && (
          <motion.div
            key="auditor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="panel-auditor"
            className="space-y-6"
          >
            <div className="max-w-3xl space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">Relecture Assistée IA</span>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-app-text">
                Auditez et validez votre code {selectedLanguage === "HTML5" ? "HTML" : selectedLanguage}
              </h2>
              <p className="text-app-muted text-xs sm:text-sm leading-relaxed">
                {selectedLanguage === "HTML5"
                  ? "Notre module d'analyse sémantique propulsé par l'IA analyse votre balisage, détecte les structures d'accessibilité (\"Soupe de Divs\", absence de titres sémantiques ou de liens d'ancrage), et vous propose une note ainsi qu'un plan de correction."
                  : selectedLanguage === "CSS"
                  ? "Notre module d'analyse propulsé par l'IA examine vos feuilles de style, détecte les sélecteurs inefficaces, la redondance de propriétés, l'oubli de variables ou de responsive fluide, et vous propose un plan complet d'optimisation."
                  : selectedLanguage === "JavaScript"
                  ? "Notre module d'analyse propulsé par l'IA examine votre code JS, détecte les structures impératives lourdes, les fuites de mémoire, l'asynchronisme non géré, et vous propose des alternatives fonctionnelles propres et sécurisées."
                  : selectedLanguage === "Python"
                  ? "Notre module d'analyse propulsé par l'IA passe au crible vos scripts Python, vérifie la conformité avec la norme PEP 8, détecte les structures non idiomatiques, et vous propose un code Pythonic optimisé."
                  : "Notre module d'analyse propulsé par l'IA analyse vos scripts PHP, cible les failles critiques d'injection SQL ou de vulnérabilités XSS, et vous aide à fortifier votre code backend."}
              </p>
            </div>

            {/* Grid Audit Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Editor Workspace */}
              <div className="lg:col-span-7 bg-card-bg rounded-xl border border-card-border p-4 sm:p-5 space-y-4 shadow-2xs">
                {/* Template Loader */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wide block">Charger un modèle de test pour voir comment l'expert IA audite :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(AUDIT_TEMPLATES_BY_LANG[selectedLanguage] || AUDIT_TEMPLATES_BY_LANG.HTML5).map((item, index) => (
                      <button
                        key={index}
                        onClick={() => loadTemplate(item.code)}
                        className="text-[11px] px-2.5 py-1.5 rounded-lg border border-card-border bg-panel-bg text-app-text hover:bg-dict-item-hover transition-colors font-semibold cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label id="editor-label" htmlFor="code-input" className="text-xs font-bold text-app-muted uppercase tracking-wider block">
                    Éditeur {selectedLanguage} interactif
                  </label>
                  <div className="relative rounded-lg overflow-hidden border border-input-border shadow-inner">
                    <textarea
                      id="code-input"
                      value={codeToAudit}
                      onChange={(e) => setCodeToAudit(e.target.value)}
                      placeholder={
                        selectedLanguage === "HTML5" ? "Collez ici votre structure HTML à tester..." :
                        selectedLanguage === "CSS" ? "Collez ici votre feuille de style CSS à auditer..." :
                        selectedLanguage === "JavaScript" ? "Collez ici votre code JavaScript à auditer..." :
                        selectedLanguage === "Python" ? "Collez ici votre script Python à auditer..." :
                        "Collez ici votre code PHP à auditer..."
                      }
                      rows={12}
                      className="w-full bg-slate-900 text-[#E2E8F0] p-3.5 font-mono text-xs leading-5 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-app-muted flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>
                      {selectedLanguage === "HTML5" ? "L'IA vérifie le SEO, l'A11y, et les alternatives d'en-tête." :
                       selectedLanguage === "CSS" ? "L'IA vérifie la redondance, le responsive et l'utilisation de variables." :
                       selectedLanguage === "JavaScript" ? "L'IA vérifie la pureté, l'architecture et les patterns asynchrones." :
                       selectedLanguage === "Python" ? "L'IA vérifie la conformité PEP 8 et la clarté idiomatique." :
                       "L'IA traque les injections SQL, failles XSS et la rigueur du typage."}
                    </span>
                  </span>
                  
                  <button
                    id="trigger-audit-btn"
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isAuditing
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {isAuditing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyse en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Auditer mon code {selectedLanguage === "HTML5" ? "HTML" : selectedLanguage}</span>
                      </>
                    )}
                  </button>
                </div>

                {auditError && (
                  <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900 p-4 space-y-2">
                    <div className="flex gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-bold text-amber-955 dark:text-amber-200">Remplissage de clé d'API requis (Diagnostic)</h4>
                        <p className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed mt-1">
                          Le serveur n'a pas pu contacter Gemini. Vous devez associer la clé d'API <code className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 text-amber-805 dark:text-amber-305 rounded">GEMINI_API_KEY</code> dans les secrets de l'application ou utiliser les cours hors-ligne ci-contre.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Results */}
              <div className="lg:col-span-5 space-y-4">
                
                {isAuditing && (
                  <div className="bg-card-bg rounded-xl border border-card-border p-8 text-center space-y-3 shadow-2xs">
                    <div className="relative w-12 h-12 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-100 dark:border-purple-950"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
                    </div>
                    <p className="text-xs font-bold text-app-text">Analyse automatisée en cours par l'expert sémantique...</p>
                  </div>
                )}

                {!isAuditing && !auditResult && (
                  <div className="bg-card-bg rounded-xl border border-card-border p-6 text-center space-y-2 shadow-2xs text-gray-400">
                    <Send className="w-8 h-8 mx-auto text-gray-300" />
                    <p className="text-xs font-bold text-app-text">Rapport d'audit sémantique</p>
                    <p className="text-[11px] text-app-muted max-w-xs mx-auto">Cliquez sur auditionner pour obtenir votre score sur 100 et identifier vos faiblesses sémantiques instantanément.</p>
                  </div>
                )}

                {auditResult && (
                  <div className="space-y-4">
                    
                    {/* Score panel */}
                    <div className="bg-card-bg rounded-xl border border-card-border p-4 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-app-muted uppercase">Score Sémantique W3C</span>
                        <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">Évaluation IA</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                          <span className="text-xl font-extrabold font-mono">{auditResult.score}</span>
                          <span className="text-[9px] font-bold opacity-80 mt-1">/100</span>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-app-text">Qualité du balisage</h4>
                          <p className="text-[11px] text-app-muted leading-relaxed font-semibold">{auditResult.generalAnalysis}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Issues */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Diagnostics détaillés :</span>
                      {auditResult.issues.map((issue, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                            issue.type === "error" ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40" :
                            issue.type === "warning" ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40" :
                            "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-250 dark:border-emerald-900/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-bold font-mono uppercase px-1.5 py-0.5 rounded ${
                              issue.type === "error" ? "bg-rose-100 text-rose-800" :
                              issue.type === "warning" ? "bg-amber-100 text-amber-800" :
                              "bg-emerald-100 text-emerald-800"
                            }`}>
                              {issue.type}
                            </span>
                          </div>

                          <p className="font-semibold text-app-text leading-relaxed text-[11px]">{issue.message}</p>
                          <p className="text-[11px] text-app-muted bg-white/70 dark:bg-slate-900/30 p-2 rounded border border-gray-150 dark:border-slate-800">
                            <strong>💡 Correction :</strong> {issue.suggestion}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>

            </div>
          </motion.div>
        )}

        {/* ==================== TAB 4: QUIZ GAME ==================== */}
        {activeTab === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="panel-game"
            className="space-y-6"
          >
            <div className="max-w-3xl space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">Atelier Formatif</span>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-app-text">
                {gameLanguage === "HTML5" ? "Associez les rôles au bon élément HTML5" :
                 gameLanguage === "CSS" ? "Associez le comportement à la propriété CSS" :
                 gameLanguage === "JavaScript" ? "Maîtrisez la syntaxe moderne JavaScript" :
                 gameLanguage === "Python" ? "Maîtrisez la sémantique de programmation Python" :
                 "Validez vos acquis sur les bases de PHP"}
              </h2>
              <p className="text-app-muted text-xs sm:text-sm leading-relaxed">
                {gameLanguage === "HTML5" ? "Testez vos automatismes de développeur de A à Z ! Complétez les 6 cas d'usages ci-dessous en sélectionnant l'élément sémantique HTML5 approprié dans la liste déroulante correspondante." :
                 gameLanguage === "CSS" ? "Testez votre maîtrise du positionnement et du design ! Choisissez la bonne propriété CSS pour chaque cas proposé." :
                 gameLanguage === "JavaScript" ? "Associez la syntaxe ES6+ moderne au bon concept de programmation pour valider votre rigueur algorithmique." :
                 gameLanguage === "Python" ? "Configurez les bonnes fonctions ou structures de données associées aux usages de haut niveau de Python." :
                 "Prouvez la sécurité et l'organisation de vos connaissances sur le langage serveur PHP sémantique."}
              </p>
            </div>

            {/* Language Selector Sub-Tabs */}
            <div className="flex flex-wrap gap-2 pb-1.5 border-b border-card-border">
              {["HTML5", "CSS", "JavaScript", "Python", "PHP"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setGameLanguage(lang);
                    initializeGame(lang);
                    playSound("ding");
                  }}
                  className={`px-3.5 py-2 text-xs font-extrabold rounded-lg border transition-all cursor-pointer ${
                    gameLanguage === lang
                      ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                      : "bg-card-bg border-card-border text-app-text hover:bg-dict-item-hover"
                  }`}
                >
                  Quiz {lang}
                </button>
              ))}
            </div>

            <div className="bg-card-bg rounded-xl border border-card-border p-4 sm:p-5 shadow-2xs space-y-5">
              {/* Game list blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gameBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`p-4 rounded-xl border transition-all ${
                      block.isCorrect === true ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800" :
                      block.isCorrect === false ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900" :
                      "bg-panel-bg border-card-border"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-purple-900 dark:text-purple-400 uppercase font-mono">{block.label}</span>
                      {block.isCorrect === true && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Correct !</span>}
                      {block.isCorrect === false && <span className="text-[10px] font-bold text-rose-600 dark:text-rose-450">Inexact</span>}
                    </div>
                    
                    <p className="text-[11px] text-app-muted leading-relaxed mb-3.5 h-10 line-clamp-2">
                      {block.description}
                    </p>

                    <div>
                      <select
                        value={block.selectedTag || ""}
                        onChange={(e) => handleGameTagSelect(block.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-input-border focus:outline-none focus:ring-1 focus:ring-purple-400 bg-input-bg text-app-text font-mono cursor-pointer"
                      >
                        <option value="">-- Choisissez la bonne réponse --</option>
                        {(GAME_DATA_BY_LANG[gameLanguage]?.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Game verification button and score feedback */}
              <div className="pt-3 border-t border-card-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <button
                  onClick={() => initializeGame(gameLanguage)}
                  className="px-4 py-2 rounded border border-input-border hover:bg-dict-item-hover text-app-text text-xs font-medium cursor-pointer"
                >
                  Réinitialiser le Quiz
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {gameFeedback && (
                    <div className="text-xs font-semibold px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                      Score obtenu : {gameFeedback.percentage}% (
                      {gameFeedback.isWon ? "Félicitations ! Maîtrise parfaite établie d'un bout à l'autre !" : "Découvrez les articles associés dans le dictionnaire pour vous bonifier !"}
                      )
                    </div>
                  )}

                  <button
                    onClick={checkGameAnswers}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-extrabold tracking-wide cursor-pointer"
                  >
                    Vérifier les Réponses
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==================== TAB: ADVANCED CHALLENGES ==================== */}
        {activeTab === "challenges" && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            id="panel-challenges"
            className="space-y-6"
          >
            <AdvancedChallenges language={selectedLanguage} />
          </motion.div>
        )}

        {/* ==================== TAB 5: WHY SEMENTIQUE IS VITAL ==================== */}
        {activeTab === "manifesto" && (
          <motion.div
            key="manifesto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            id="panel-manifesto"
            className="space-y-6"
          >
            {(() => {
              const info = (() => {
                switch (selectedLanguage) {
                  case "CSS":
                    return {
                      tag: "Critères & Styles CSS",
                      title: "Pourquoi la rigueur et l’organisation du CSS moderne sont-elles capitales ?",
                      subtitle: "Le CSS moderne ne se limite pas à appliquer des couleurs au hasard. C’est la clé de voûte de la vitesse d'affichage, des interfaces fluides adaptées à tous les écrans, et du maintien d'un code pérenne.",
                      p1: {
                        num: "01",
                        title: "1. Fluidité & Performance de Rendu",
                        desc: "Un code CSS propre évite les calculs d'affichage lourds pour le GPU. L'utilisation correcte de Flexbox et CSS Grid avec des fonctions fluides comme clamp() évite les recalculs incessants de mise en page, évitant le décalage de contenu lors du chargement.",
                        badge: "clamp()"
                      },
                      p2: {
                        num: "02",
                        title: "2. Standardisation via Propriétés Personnalisées",
                        desc: "L'emploi systématique de variables CSS (var(--theme-accent)) favorise un Design System cohérent. Cela simplifie la création de thèmes dynamiques (sombre/clair) instantanés sans surpoids de fichiers et sans duplication inutile de sélecteurs.",
                        badge: "var(--)"
                      },
                      p3: {
                        num: "03",
                        title: "3. Maintenance sans Régression",
                        desc: "Fini le fléau de l'abus de !important et des sélecteurs sur-imbriqués ! Une architecture CSS moderne (en s'appuyant sur des sélecteurs plats) garantit qu'une retouche cosmétique mineure n'entraîne pas de régression inattendue sur le reste de votre application.",
                        badge: "plat"
                      }
                    };
                  case "JavaScript":
                    return {
                      tag: "Algorithmique & Paradigmes JS",
                      title: "Pourquoi la rigueur et l’architecture JavaScript sont-elles capitales ?",
                      subtitle: "JavaScript donne vie au Web mais un code désorganisé devient vite un cauchemar à maintenir. La clé réside dans les paradigmes modernes, l'optimisation mémoire, et la gestion fluide de l'asynchronisme.",
                      p1: {
                        num: "01",
                        title: "1. Paradigmes Modernes & Expressivité",
                        desc: "En éliminant les boucles impératives lourdes au profit de méthodes fonctionnelles immutables comme .map() et .filter(), le développeur écrit un flux de données propre, hautement lisible, auto-documenté, et beaucoup moins enclin aux bugs d'effets de bord.",
                        badge: ".map()"
                      },
                      p2: {
                        num: "02",
                        title: "2. Maîtrise de l'Asynchronisme",
                        desc: "Le traitement efficace des flux réseau complexes demande une utilisation impérative du pattern async/await combiné à des blocs de secours try/catch. Cela garantit une interface réactive qui ne se bloque jamais face aux latences du serveur.",
                        badge: "async"
                      },
                      p3: {
                        num: "03",
                        title: "3. Résilience et Cycle de Vie",
                        desc: "Évitez les fuites de mémoire fatales des Single Page Applications ! Éliminez les écouteurs d'événements persistants obsolètes et libérez les ressources non utilisées à chaque démontage de composant pour assurer des performances constantes.",
                        badge: "event"
                      }
                    };
                  case "Python":
                    return {
                      tag: "Écriture Idiomatique PEP 8",
                      title: "Pourquoi l’écriture de code idiomatique Python est-elle capitale ?",
                      subtitle: "Python est célèbre pour sa simplicité, mais écrire du code lisible selon les conventions PEP 8 et performant distingue le débutant de l'ingénieur chevronné.",
                      p1: {
                        num: "01",
                        title: "1. Clarté Idiomatique & PEP 8",
                        desc: "La philosophie zen du langage privilégie la lisibilité explicite du code. L'utilisation d'éléments idiomatiques comme les comprehensions permet de synthétiser des opérations lourdes en expressions fluides et élégantes sans dénaturer la clarté.",
                        badge: "PEP 8"
                      },
                      p2: {
                        num: "02",
                        title: "2. Gestion Robuste des Ressources",
                        desc: "La gestion sécurisée des entrées/sorties et des fichiers nécessite l'utilisation systématique de context managers via l'instruction with. Elle prévient les fuites de descripteurs système et assure un nettoyage automatique même en cas de crash.",
                        badge: "with"
                      },
                      p3: {
                        num: "03",
                        title: "3. Robustesse & Exceptions",
                        desc: "Un code robuste ne présume jamais du succès des opérations système. Des interceptions ciblées via des exceptions précises (except KeyError, except FileNotFoundError) évitent les arrêts prématurés des processus en production.",
                        badge: "except"
                      }
                    };
                  case "PHP":
                    return {
                      tag: "Rigueur & Sécurité Web Backend",
                      title: "Pourquoi la sécurité et l’architecture PHP moderne sont-elles capitales ?",
                      subtitle: "PHP fait tourner près de 80% du Web. Assurer la sécurité des applications, la rigueur du typage et l'étanchéité des flux SQL est indispensable pour repousser les attaques automatisées.",
                      p1: {
                        num: "01",
                        title: "1. Parer les Injections SQL",
                        desc: "Ne concaténez jamais vos variables dans vos requêtes ! L'utilisation obligatoire de requêtes préparées avec PDO isole la commande SQL des données de l'utilisateur, neutralisant de fait les tentatives d'injections SQL destructrices.",
                        badge: "PDO"
                      },
                      p2: {
                        num: "02",
                        title: "2. Protection Face aux Failles XSS",
                        desc: "Tout affichage dynamique d'une entrée utilisateur doit être assaini. L'utilisation systématique de fonctions protectrices comme htmlspecialchars() lors du rendu empêche l'injection furtive de scripts malveillants JavaScript dans le navigateur.",
                        badge: "XSS"
                      },
                      p3: {
                        num: "03",
                        title: "3. Typer Rigoureusement ses API",
                        desc: "L'instruction declare(strict_types=1) élève la sécurité de vos scripts. Elle oblige à l'exactitude des types de paramètres et de retours, réduisant ainsi considérablement les comportements erratiques ou imprévisibles.",
                        badge: "types"
                      }
                    };
                  default: // HTML5
                    return {
                      tag: "Avantages & Enjeux de A à Z",
                      title: "Pourquoi la sémantique HTML5 est-elle capitale ?",
                      subtitle: "Le code HTML5 ne s'adresse pas qu'au navigateur pour de l'habillage. C'est l'essence même de l'accessibilité universelle et de l'indexation de vos serveurs par les géants de la recherche.",
                      p1: {
                        num: "01",
                        title: "1. Accessibilité Universelle (A11y)",
                        desc: "Les personnes aveugles ou malvoyantes naviguent à l'aide de lecteurs d’écran vocaux. Grâce à des balises sémantiques claires (<nav>, <main>, <footer>), ils peuvent sauter directement d’une région à l'autre au clavier sans subir la lecture rébarbative.",
                        badge: "<nav>"
                      },
                      p2: {
                        num: "02",
                        title: "2. Performance SEO & Crawlers",
                        desc: "Les algorithmes d’indexation de Google parcourent continuellement le Web. Un site codé en sémantique s'exprime clairement : le robot sait exactement quel bloc représente l'intérêt véritable (<article>) des informations optionnelles (<aside>).",
                        badge: "<aside>"
                      },
                      p3: {
                        num: "03",
                        title: "3. Maintenance et Performance",
                        desc: "Une page web construite de façon sémantique utilise environ 30% d'éléments imbriqués en moins qu'un code souffrant de 'Div Soup'. Le poids des fichiers est plus léger, le code est plus lisible pour vos collaborateurs, et la maintenance est simplifiée.",
                        badge: "soup"
                      }
                    };
                }
              })();

              return (
                <div className="space-y-6 w-full">
                  <div className="max-w-3xl space-y-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-805">
                      {info.tag}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-app-text">
                      {info.title}
                    </h2>
                    <p className="text-app-muted text-xs sm:text-sm leading-relaxed">
                      {info.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Pillar 1 */}
                    <div className="bg-card-bg rounded-xl border border-card-border p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                          {info.p1.num}
                        </div>
                        <span className="font-mono text-[9px] bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-bold px-1.5 py-0.5 rounded border border-indigo-150/10">
                          {info.p1.badge}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-app-text font-display">
                        {info.p1.title}
                      </h3>
                      <p className="text-xs text-app-muted leading-relaxed font-semibold">
                        {info.p1.desc}
                      </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="bg-card-bg rounded-xl border border-card-border p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/45 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                          {info.p2.num}
                        </div>
                        <span className="font-mono text-[9px] bg-emerald-50/50 dark:bg-emerald-100/10 text-emerald-600 dark:text-emerald-450 font-bold px-1.5 py-0.5 rounded border border-emerald-150/10">
                          {info.p2.badge}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-app-text font-display">
                        {info.p2.title}
                      </h3>
                      <p className="text-xs text-app-muted leading-relaxed font-semibold">
                        {info.p2.desc}
                      </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="bg-card-bg rounded-xl border border-card-border p-5 space-y-3.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/45 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                          {info.p3.num}
                        </div>
                        <span className="font-mono text-[9px] bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 font-bold px-1.5 py-0.5 rounded border border-purple-150/10">
                          {info.p3.badge}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-app-text font-display">
                        {info.p3.title}
                      </h3>
                      <p className="text-xs text-app-muted leading-relaxed font-semibold">
                        {info.p3.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Developer Spotlight Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-md mt-6">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15 pointer-events-none">
                <DeveloperLogo className="w-80 h-80" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold font-mono text-indigo-200 border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                    <span>Propulsé par l'innovation</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                    Fré_Dév-Web Tech Lab
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-medium">
                    Un pôle d'ingénierie et de création d’applications Web sur-mesure. Nous défendons les standards modernes du Web, l'accessibilité universelle et l'optimisation des architectures logicielles pour un Web plus inclusif, performant et pérenne.
                  </p>

                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <a
                      href="https://youtube.com/@fre_dev-webtechlab?si=FwDh-gjiFxWY1fis"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF0000] hover:bg-[#CC0000] text-white text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>Chaîne YouTube</span>
                    </a>
                    <a
                      href="https://www.facebook.com/frejus.montchi.3"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                    >
                      <Facebook className="w-4 h-4" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/fr%C3%A9jus-montchi-b14a173a7?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077B5] hover:bg-[#005E93] text-white text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 cursor-pointer"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
                <div className="flex-shrink-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center space-y-3 w-full sm:w-auto min-w-[200px]">
                  <DeveloperLogo className="w-20 h-16" />
                  <div>
                    <p className="text-xs font-bold text-white">Créateur Officiel</p>
                    <p className="text-[10px] text-indigo-300 font-mono">Web Tech Laboratory</p>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
        </AnimatePresence>

      </main>

      {/* Main Footer */}
      <footer id="app-footer" className="bg-header-bg border-t border-header-border mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-header-border/40 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-card-border">
                <DeveloperLogo className="w-12 h-9" />
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight text-app-text">Fré_Dév-Web Tech Lab</h4>
                <p className="text-[11px] text-app-muted font-medium">Expertise Web & Solutions Sémantiques Innovantes</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 text-app-text border border-card-border">
                👨‍💻 Développeur Certifié
              </span>
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 text-app-text border border-card-border">
                ⚡ Standards W3C
              </span>
              <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800/60 text-app-text border border-card-border">
                🤖 Diagnostic Sémantique IA
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-app-muted">
            <p>© 2026 Sémantique HTML5 de A à Z - Conçu et réalisé par <strong className="text-app-text font-black">Fré_Dév-Web Tech Lab</strong>.</p>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-semibold text-app-text whitespace-nowrap">W3C Compliant</span>
              <span className="font-semibold text-app-text whitespace-nowrap">SEO / A11y Focus</span>
              <div className="h-4 w-[1px] bg-card-border hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <a
                  href="https://youtube.com/@fre_dev-webtechlab?si=FwDh-gjiFxWY1fis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-[#FF0000]/10 text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all cursor-pointer"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/frejus.montchi.3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all cursor-pointer"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/fr%C3%A9jus-montchi-b14a173a7?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all cursor-pointer"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating real-time AI semantic chatbot */}
      <SemanticChatbot currentLanguage={selectedLanguage} />

    </div>
  );
}
