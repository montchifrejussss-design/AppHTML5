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
  History
} from "lucide-react";
import { SEMANTIC_TAGS, COMMON_ERRORS, INITIAL_AUDIT_TEMPLATES, INITIAL_GAME_BLOCKS, GAME_OPTIONS } from "./data";
import { AuditResult, GameBlock, SemanticTag } from "./types";
import developerLogo from "./assets/images/developer_logo_1780612371108.png";
import { playSound, getMuted, setMuted } from "./utils/audio";
import { getAllTags, saveTag, deleteTag, initDB } from "./utils/indexedDb";

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
  const [activeTab, setActiveTab] = useState<"dictionary" | "practices" | "auditor" | "game" | "manifesto">("dictionary");

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
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [readTags, setReadTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("html5_read_tags");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

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
  const [gameBlocks, setGameBlocks] = useState<GameBlock[]>([]);
  const [gameFeedback, setGameFeedback] = useState<{ isWon: boolean; percentage: number } | null>(null);

  // Handle Clipboard Copy
  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Filter semantic tags
  const filteredTags = tags.filter((tag) => {
    const matchesSearch =
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.usage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tag.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Load / Restart Game
  const initializeGame = () => {
    const freshBlocks = INITIAL_GAME_BLOCKS.map((block) => ({
      ...block,
      selectedTag: "",
      isCorrect: undefined
    }));
    setGameBlocks(freshBlocks);
    setGameFeedback(null);
  };

  useEffect(() => {
    initializeGame();
  }, []);

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
      <header id="main-header" className="sticky top-0 z-40 bg-header-bg border-b border-header-border transition-colors duration-200 shadow-xs px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-sm ring-4 ring-purple-100/50 dark:ring-purple-900/30">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono px-2 py-0.5 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800/80 transition-colors">HTML5 Sémantique</span>
                <span className="text-[10px] uppercase tracking-wider font-bold font-mono px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800/80 transition-colors">W3C Guide</span>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800/60 text-app-text rounded border border-card-border transition-colors">
                  <span className="text-app-muted">Dev :</span>
                  <DeveloperLogo className="w-5 h-4" />
                  <span className="text-purple-600 dark:text-purple-400 font-extrabold whitespace-nowrap">Fré_Dév-Web Tech Lab</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-app-text transition-colors mt-0.5">Balisage Sémantique HTML5 de A à Z</h1>
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
                <span>Dictionnaire A-Z</span>
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
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "game"
                    ? "bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-400 shadow-xs ring-1 ring-black/5 dark:ring-white/10"
                    : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700/50"
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Jeu Quiz</span>
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
              <span>{readTags.length + gameBlocks.filter(b => b.isCorrect === true).length}</span>
              <span className="text-purple-400/50">/</span>
              <span>{tags.length + gameBlocks.length}</span>
              <span className="text-[10px] font-medium text-app-muted">validés</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Dictionary progress bar */}
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-app-muted">
                <span className="flex items-center gap-1">📘 Encyclopédie</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">{tags.length > 0 ? Math.round((readTags.length / tags.length) * 100) : 0}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-700/40">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${tags.length > 0 ? (readTags.length / tags.length) * 100 : 0}%` }}
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
                  Le dictionnaire ultime des balises sémantiques HTML5
                </h2>
                <p className="text-gray-350 text-xs sm:text-sm leading-relaxed">
                  HTML5 décrit le <strong>sens</strong> de vos contenus. Parcourez chaque élément officiel, comprenez son rôle d'accessibilité (A11y/SEO), examinez les erreurs d'usage et intégrez des fragments conformes au W3C directement dans vos projets.
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
                  placeholder="Rechercher une balise html (ex: nav, main, article, figure...)"
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer focus:outline-hidden"
                  title="Restaurer le dictionnaire initial"
                >
                  <History className="w-3.5 h-3.5 text-gray-500" />
                  <span>Restaurer</span>
                </button>
              </div>
            </div>

            {/* Dual Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: list */}
              <div className="lg:col-span-5 bg-card-bg rounded-xl border border-card-border shadow-2xs max-h-[500px] overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
                <div className="p-3 bg-panel-bg border-b border-panel-border sticky top-0 flex justify-between items-center z-10">
                  <span className="text-xs font-bold text-app-muted uppercase">Balises correspondantes</span>
                  <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-mono font-bold">
                    {filteredTags.length}
                  </span>
                </div>

                {filteredTags.length === 0 ? (
                  <div className="p-8 text-center space-y-2 text-gray-550">
                    <Info className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="font-semibold text-xs">Aucune balise trouvée</p>
                  </div>
                ) : (
                  filteredTags.map((tag) => {
                    const isRead = readTags.includes(tag.name);
                    return (
                      <button
                        key={tag.name}
                        onClick={() => setExpandedTag(tag.name)}
                        className={`w-full text-left p-3.5 hover:bg-dict-item-hover transition-colors flex justify-between items-center gap-3 cursor-pointer ${
                          expandedTag === tag.name ? "bg-purple-50/50 dark:bg-purple-950/20 border-r-3 border-purple-600 font-medium" : ""
                        }`}
                      >
                        <div>
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
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    );
                  })
                )}
              </div>

              {/* Right Column: Detailed tag interaction card */}
              <div className="lg:col-span-7">
                {expandedTag ? (() => {
                  const tag = tags.find((t) => t.name === expandedTag);
                  if (!tag) return null;
                  return (
                    <div className="bg-card-bg rounded-xl border border-card-border shadow-2xs overflow-hidden">
                      {/* Header Segment */}
                      <div className="p-5 bg-gradient-to-tr from-purple-50/20 to-indigo-50/20 dark:from-purple-950/15 dark:to-indigo-950/15 border-b border-card-border">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400 tracking-wider">
                              Rôle Sémantique Officiel
                            </span>
                            
                            <div className="mt-2 flex flex-wrap items-baseline gap-2">
                              <code className="text-2xl font-black text-indigo-950 dark:text-indigo-200 font-mono">
                                {tag.name}
                              </code>
                              <span className="px-2 py-0.5 bg-white dark:bg-slate-755 text-[9px] font-mono text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded uppercase font-bold">
                                Catégorie: {tag.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 self-start flex-wrap">
                            <button
                              onClick={() => toggleTagRead(tag.name)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer shadow-2xs ${
                                readTags.includes(tag.name)
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 font-bold"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                              }`}
                            >
                              <CheckCircle2 className={`w-4 h-4 ${readTags.includes(tag.name) ? "text-white" : "text-slate-400"}`} />
                              <span>{readTags.includes(tag.name) ? "Appris ✔" : "Marquer comme appris"}</span>
                            </button>

                            <button
                              onClick={() => handleDeleteTag(tag.name)}
                              title="Supprimer cette balise"
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 cursor-pointer shadow-2xs transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-app-muted leading-relaxed font-semibold">
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
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-gray-900">
                La chasse au "Div Soup" (Soupe de Divs)
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Visualisez des structures comparatives côte à côte. Comprenez pourquoi l'utilisation abusive de balises neutres comme <code className="font-mono bg-gray-150 px-1 py-0.5 text-gray-800 rounded">{"<div>"}</code> ou <code className="font-mono bg-gray-150 px-1 py-0.5 text-gray-800 rounded">{"<span>"}</code> exclut de nombreux utilisateurs et pénalise votre SEO.
              </p>
            </div>

            {/* Error selector tabs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {COMMON_ERRORS.map((err, idx) => (
                <button
                  key={err.id}
                  onClick={() => setSelectedPracticeIndex(idx)}
                  className={`p-3 text-left rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedPracticeIndex === idx
                      ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 text-rose-950 dark:text-rose-200 font-bold"
                      : "bg-card-bg border-card-border hover:bg-panel-bg text-app-text"
                  }`}
                >
                  <span className="text-[9px] uppercase tracking-wider text-rose-600 dark:text-rose-455 block mb-1">Erreur de type {idx + 1}</span>
                  <p className="line-clamp-1">{err.title}</p>
                </button>
              ))}
            </div>

            {/* Side by Side Comparative Workspace */}
            {(() => {
              const currentErr = COMMON_ERRORS[selectedPracticeIndex];
              return (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* Fail Block */}
                  <div className="bg-card-bg rounded-xl border border-rose-250 dark:border-rose-900/60 overflow-hidden flex flex-col shadow-2xs">
                    <div className="p-3 bg-rose-50/50 dark:bg-rose-950/35 border-b border-rose-100/60 dark:border-rose-900 flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-850 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Mauvaise pratique (À Éviter)</span>
                      </span>
                      <span className="text-[9px] font-mono bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded font-bold uppercase">
                        Sémantique absente
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-rose-950 dark:text-rose-200">{currentErr.title}</h3>
                        <p className="text-xs text-app-muted mt-1 leading-relaxed">{currentErr.description}</p>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border border-rose-150 dark:border-rose-900/40 text-xs">
                        <div className="bg-rose-100/50 dark:bg-rose-900/45 text-red-800 dark:text-rose-300 font-mono px-3 py-1 font-bold">
                          bad_code.html
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
                      <span className="text-xs font-bold text-emerald-850 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Bonne pratique (À Faire)</span>
                      </span>
                      <span className="text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">
                        Structure valide A11y & W3C
                      </span>
                    </div>

                    <div className="p-4 flex-1 space-y-3">
                      <div>
                        <h3 className="font-extrabold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">Correction Sémantique</h3>
                        <p className="text-xs text-app-muted mt-1 leading-relaxed">Une structure limpide qui donne du sens directement lors de la compilation par le navigateur.</p>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border border-emerald-150 dark:border-emerald-900/40 text-xs">
                        <div className="bg-emerald-100/50 dark:bg-emerald-900/45 text-emerald-800 dark:text-emerald-300 font-mono px-3 py-1 font-bold">
                          clean_semantic.html
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
                Auditez et validez votre code HTML
              </h2>
              <p className="text-app-muted text-xs sm:text-sm leading-relaxed">
                Notre module d'analyse sémantique propulsé par l'IA analyse votre balisage, détecte les structures d'accessibilité ("Soupe de Divs", absence de titres sémantiques ou de liens d'ancrage), et vous propose une note ainsi qu'un plan de correction.
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
                    {INITIAL_AUDIT_TEMPLATES.map((item, index) => (
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
                    Éditeur HTML interactif
                  </label>
                  <div className="relative rounded-lg overflow-hidden border border-input-border shadow-inner">
                    <textarea
                      id="code-input"
                      value={codeToAudit}
                      onChange={(e) => setCodeToAudit(e.target.value)}
                      placeholder="Collez ici votre structure HTML à tester..."
                      rows={12}
                      className="w-full bg-slate-900 text-[#E2E8F0] p-3.5 font-mono text-xs leading-5 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-app-muted flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span>L'IA vérifie le SEO, l'A11y, et les alternatives d'en-tête.</span>
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
                        <span>Auditer mon code HTML</span>
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
                Associez les rôles au bon élément HTML5
              </h2>
              <p className="text-app-muted text-xs sm:text-sm leading-relaxed">
                Testez vos automatismes de développeur de A à Z ! Complétez les 6 cas d'usages ci-dessous en sélectionnant l'élément sémantique HTML5 approprié dans la liste déroulante correspondante.
              </p>
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
                        value={block.selectedTag}
                        onChange={(e) => handleGameTagSelect(block.id, e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-input-border focus:outline-none focus:ring-1 focus:ring-purple-400 bg-input-bg text-app-text font-mono"
                      >
                        <option value="">-- Choisissez la balise --</option>
                        {GAME_OPTIONS.map((opt) => (
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
                  onClick={initializeGame}
                  className="px-4 py-2 rounded border border-input-border hover:bg-dict-item-hover text-app-text text-xs font-medium cursor-pointer"
                >
                  Réinitialiser le Quiz
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  {gameFeedback && (
                    <div className="text-xs font-semibold px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-950 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                      Score obtenu : {gameFeedback.percentage}% (
                      {gameFeedback.isWon ? "Excellent sémanticien !" : "Consultez le dictionnaire pour vous améliorer !"}
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
            <div className="max-w-3xl space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-805">Avantages & Enjeux de A à Z</span>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-app-text">
                Pourquoi la sémantique HTML5 est-elle capitale ?
              </h2>
              <p className="text-app-muted text-xs sm:text-sm leading-relaxed">
                Le code HTML5 ne s'adresse pas qu'au navigateur pour de l'habillage. C'est l'essence même de l'accessibilité universelle et de l'indexation de vos serveurs par les géants de la recherche.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pillar 1: Accessibilité */}
              <div className="bg-card-bg rounded-xl border border-card-border p-5 space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                  01
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-app-text font-display">
                  1. Accessibilité Universelle (A11y)
                </h3>
                <p className="text-xs text-app-muted leading-relaxed font-medium">
                  Les personnes aveugles ou malvoyantes naviguent à l'aide de lecteurs d’écran vocaux. Grâce à des balises sémantiques claires (<code className="font-mono bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold px-1 rounded">{"<nav>"}</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold px-1 rounded">{"<main>"}</code>, <code className="font-mono bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold px-1 rounded">{"<footer>"}</code>), ils peuvent sauter directement d’une région à l'autre au clavier sans subir la lecture rébarbative des en-têtes répétés de chaque page.
                </p>
              </div>

              {/* Pillar 2: SEO */}
              <div className="bg-card-bg rounded-xl border border-card-border p-5 space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/45 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  02
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-app-text font-display">
                  2. Performance SEO & Crawlers
                </h3>
                <p className="text-xs text-app-muted leading-relaxed font-medium">
                  Les algorithmes d’indexation de Google parcourent continuellement le Web. Un site codé en sémantique s'exprime clairement : le robot sait exactement quel bloc représente l'intérêt véritable (<code className="font-mono bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold px-1 rounded">{"<article>"}</code>) des informations optionnelles (<code className="font-mono bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-bold px-1 rounded">{"<aside>"}</code>), garantissant un meilleur classement organique ("Rich Snippets").
                </p>
              </div>

              {/* Pillar 3: Maintainability */}
              <div className="bg-card-bg rounded-xl border border-card-border p-5 space-y-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/45 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                  03
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-app-text font-display">
                  3. Maintenance et Performance
                </h3>
                <p className="text-xs text-app-muted leading-relaxed font-medium">
                  Une page web construite de façon sémantique utilise environ 30% d'éléments imbriqués en moins qu'un code souffrant de "Div Soup". Le poids des fichiers est plus léger, le code est plus lisible pour vos collaborateurs, et la maintenance à long terme de vos feuilles de style s'avère infiniment simplifiée.
                </p>
              </div>

            </div>

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

    </div>
  );
}
