import { useState, useEffect } from "react";
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
  Flame,
  HelpCircle,
  Accessibility,
  Plus
} from "lucide-react";
import { SEMANTIC_TAGS, COMMON_ERRORS, INITIAL_AUDIT_TEMPLATES, INITIAL_GAME_BLOCKS, GAME_OPTIONS } from "./data";
import { SemanticTag, AuditIssue, AuditResult, GameBlock } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dictionary" | "practices" | "auditor" | "game" | "manifesto">("dictionary");

  // State for Dictionary
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedTag, setExpandedTag] = useState<string | null>("<main>");
  const [copiedText, setCopiedText] = useState<string | null>(null);

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
  const filteredTags = SEMANTIC_TAGS.filter((tag) => {
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
    <div id="app-root" className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1D1D1F] selection:bg-purple-100 selection:text-purple-900 font-sans transition-colors duration-200">
      
      {/* Dynamic Header */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-150/80 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-sm ring-4 ring-purple-100/60">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold font-mono px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200">HTML5 Sémantique</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">W3C Standard</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-gray-900 mt-0.5">Sémantique de A à Z</h1>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav id="navigation-bar" aria-label="Menu principal de l'application" className="flex flex-wrap gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200/50">
            <button
              id="nav-tab-dictionary"
              onClick={() => setActiveTab("dictionary")}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeTab === "dictionary"
                  ? "bg-white text-purple-700 shadow-xs ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Dictionnaire A-Z</span>
            </button>
            <button
              id="nav-tab-practices"
              onClick={() => setActiveTab("practices")}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeTab === "practices"
                  ? "bg-white text-purple-700 shadow-xs ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Erreurs & Pratiques</span>
            </button>
            <button
              id="nav-tab-auditor"
              onClick={() => setActiveTab("auditor")}
              className={`relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeTab === "auditor"
                  ? "bg-white text-purple-700 shadow-xs ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Auditeur IA</span>
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </button>
            <button
              id="nav-tab-game"
              onClick={() => { setActiveTab("game"); initializeGame(); }}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeTab === "game"
                  ? "bg-white text-purple-700 shadow-xs ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Award className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>Jeu Quiz</span>
            </button>
            <button
              id="nav-tab-manifesto"
              onClick={() => setActiveTab("manifesto")}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeTab === "manifesto"
                  ? "bg-white text-purple-700 shadow-xs ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Accessibility className="w-4 h-4 text-sky-500" />
              <span>Pourquoi c'est vital ?</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Educational Workspace */}
      <main id="main-content-area" className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6">

        {/* ==================== TAB 1: DICTIONARY ==================== */}
        {activeTab === "dictionary" && (
          <div id="panel-dictionary" className="space-y-6 animate-fadeIn">
            {/* Banner Intro */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
              
              <div className="relative z-10 max-w-2xl space-y-3">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-mono font-medium text-purple-200 border border-white/5">Encyclopédie Interactive</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white leading-tight">
                  Le dictionnaire ultime des balises sémantiques HTML5
                </h2>
                <p className="text-gray-350 text-sm sm:text-base leading-relaxed">
                  HTML5 ne sert pas simplement à structurer visuellement ; il décrit le <strong>sens</strong> de vos contenus. Parcourez chaque élément, comprenez son rôle, examinez les erreurs d'usage et intégrez des fragments conformes au W3C directement dans vos projets.
                </p>
              </div>
            </div>

            {/* Filter controls and Search Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-150 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 font-light" />
                <input
                  id="search-tags"
                  type="text"
                  placeholder="Rechercher une balise html (ex: nav, main, article, figure...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-250 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-500 bg-gray-50/50 text-sm placeholder-gray-400 font-medium"
                />
              </div>

              {/* Categorization chips */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase mr-1">Filtrer:</span>
                {[
                  { value: "all", label: "Toutes les balises" },
                  { value: "structure", label: "Gabarit & Structure" },
                  { value: "content", label: "Contenu & Légendes" },
                  { value: "interactive", label: "Interactives" },
                  { value: "inline", label: "En ligne / Inline" }
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedCategory === cat.value
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Grid Layout: Tag list & Interactive detailed view */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: list */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-xs max-h-[600px] overflow-y-auto divide-y divide-gray-100">
                <div className="p-4 bg-gray-50/70 border-b border-gray-200/60 sticky top-0 flex justify-between items-center z-10">
                  <span className="text-xs font-bold text-gray-500 uppercase">Balises correspondantes</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                    {filteredTags.length} balise{filteredTags.length > 1 ? "s" : ""}
                  </span>
                </div>

                {filteredTags.length === 0 ? (
                  <div className="p-8 text-center space-y-2 text-gray-500">
                    <Info className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="font-semibold text-sm">Aucune balise trouvée</p>
                    <p className="text-xs">Modifiez vos critères ou écrivez un mot différent.</p>
                  </div>
                ) : (
                  filteredTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => setExpandedTag(tag.name)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex justify-between items-start gap-3 cursor-pointer ${
                        expandedTag === tag.name ? "bg-purple-50/50 border-r-3 border-purple-600" : ""
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="text-base font-bold text-purple-800 font-mono bg-purple-50 px-2 py-0.5 rounded">
                            {tag.name}
                          </code>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            tag.category === "structure" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                            tag.category === "content" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                            tag.category === "interactive" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                            "bg-purple-50 text-purple-700 border border-purple-100"
                          }`}>
                            {tag.category === "structure" ? "Structure" :
                             tag.category === "content" ? "Contenu" :
                             tag.category === "interactive" ? "Interactif" : "En ligne"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{tag.description}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${
                        expandedTag === tag.name ? "translate-x-1 text-purple-600" : ""
                      }`} />
                    </button>
                  ))
                )}
              </div>

              {/* Right Column: Detailed tag interactive card */}
              <div className="lg:col-span-7">
                {expandedTag ? (() => {
                  const tag = SEMANTIC_TAGS.find((t) => t.name === expandedTag);
                  if (!tag) return null;
                  return (
                    <div className="bg-white rounded-3xl border border-gray-200/95 shadow-sm overflow-hidden sticky top-24">
                      
                      {/* Header Segment */}
                      <div className="p-6 bg-gradient-to-tr from-purple-50/30 to-indigo-50/30 border-b border-gray-150 relative">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold uppercase text-purple-700 tracking-wider">
                            Description Détaillée
                          </span>
                          <span className="text-[11px] font-mono text-gray-400 bg-white shadow-2xs border border-gray-200/80 rounded px-2 py-0.5">
                            Standard HTML5
                          </span>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
                          <code className="text-3xl font-extrabold text-indigo-950 tracking-tight font-mono select-all">
                            {tag.name}
                          </code>
                          <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-600 border border-gray-150 uppercase shadow-2xs">
                            {tag.category === "structure" ? "Mise en page & Gabarit" :
                             tag.category === "content" ? "Enrichissement sémantique" :
                             tag.category === "interactive" ? "Module interactif natif" : "Balise inline"}
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-gray-700 leading-relaxed font-medium">
                          {tag.description}
                        </p>
                      </div>

                      {/* Content Blocks */}
                      <div className="p-6 space-y-6">
                        {/* Usage guide */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span>Comment bien l'utiliser (À Faire)</span>
                          </h4>
                          <p className="text-sm text-gray-800 leading-relaxed bg-emerald-50/30 border border-emerald-100 rounded-xl p-3.5">
                            {tag.usage}
                          </p>
                        </div>

                        {/* Mistakes to avoid */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                            <span>Les pièges classiques (À Éviter)</span>
                          </h4>
                          <p className="text-sm text-gray-800 leading-relaxed bg-rose-50/30 border border-rose-100 rounded-xl p-3.5">
                            {tag.donts}
                          </p>
                        </div>

                        {/* Interactive Live Implementation Code Block */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Terminal className="w-4 h-4 text-gray-500" />
                              <span>Exemple d'implémentation propre</span>
                            </h4>
                            <button
                              onClick={() => handleCopy(tag.codeSnippet, `tag-${tag.name}`)}
                              className="text-xs flex items-center gap-1 text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded transition-colors cursor-pointer"
                            >
                              {copiedText === `tag-${tag.name}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Copié!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copier le HTML</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="relative rounded-xl overflow-hidden shadow-xs border border-slate-200">
                            {/* Editor window decoration */}
                            <div className="bg-slate-800 text-slate-400 px-4 py-2 text-[10px] font-mono flex items-center gap-1.5">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              <span className="ml-2">index.html (HTML5 Standard)</span>
                            </div>
                            <pre className="bg-slate-900 text-slate-50 p-4 overflow-x-auto font-mono text-xs leading-5">
                              <code>{tag.codeSnippet}</code>
                            </pre>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })() : (
                  <div className="h-48 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 text-gray-400 bg-white">
                    <BookOpen className="w-10 h-10 mb-2 opacity-50" />
                    <p className="text-sm font-medium">Sélectionnez une balise à gauche pour voir les détails d'expert.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 2: PRACTICES & ERRORS ==================== */}
        {activeTab === "practices" && (
          <div id="panel-practices" className="space-y-6 animate-fadeIn">
            {/* Introductory statement */}
            <div className="max-w-3xl space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-[#FF4D4D] bg-red-50 px-3 py-1 rounded-full border border-red-150">Chasser la mauvaise sémantique</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-gray-900">
                Lutte contre la Soupe de Divs et l'inaccessibilité
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Apprenez à identifier les pires erreurs encore trop courantes dans l'industrie du web. Comparez directement l'implémentation non-conforme et ses barrières d'accès avec l'implémentation propre, robuste et performante.
              </p>
            </div>

            {/* Error selector tabs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {COMMON_ERRORS.map((err, idx) => (
                <button
                  key={err.id}
                  onClick={() => setSelectedPracticeIndex(idx)}
                  className={`p-4 text-left rounded-2xl border text-sm font-medium transition-all cursor-pointer ${
                    selectedPracticeIndex === idx
                      ? "bg-rose-50/50 border-rose-300 text-rose-900 shadow-xs"
                      : "bg-white border-gray-250 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="font-semibold text-xs text-rose-600 mb-1">Cas d'Étude {idx + 1}</div>
                  <div className="font-bold line-clamp-1">{err.title}</div>
                </button>
              ))}
            </div>

            {/* Comparative View Workspace */}
            {(() => {
              const currentErr = COMMON_ERRORS[selectedPracticeIndex];
              return (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* Left block: Failure snippet */}
                  <div className="bg-white rounded-3xl border border-rose-200 shadow-xs overflow-hidden flex flex-col">
                    <div className="p-4 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between text-rose-900">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>Mauvais Usage : Hors-Norme (À Éviter)</span>
                      </span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-rose-200 rounded font-bold uppercase">
                        Div Soup / Factice
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-base text-rose-950 font-display">{currentErr.title}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{currentErr.description}</p>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-rose-150">
                        <div className="bg-rose-100/60 text-red-800 px-4 py-2 text-[10px] font-mono flex items-center justify-between">
                          <span>Solder.html</span>
                          <span className="text-red-600 font-bold flex items-center gap-1">❌ Inaccessible</span>
                        </div>
                        <pre className="bg-slate-900 text-red-200/90 p-4 overflow-x-auto font-mono text-xs leading-5">
                          <code>{currentErr.badCode}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Right block: Clean snippet */}
                  <div className="bg-white rounded-3xl border border-emerald-250 shadow-xs overflow-hidden flex flex-col">
                    <div className="p-4 bg-emerald-50/70 border-b border-emerald-150 flex items-center justify-between text-emerald-950">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Bonne Sémantique : Standardisé (À Faire)</span>
                      </span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 border border-emerald-200 rounded font-bold uppercase">
                        Valide W3C
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-bold text-base text-emerald-900 font-display">La Correction Idéale</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">Solution qui respecte les moteurs de recherche, le typage DOM et l'accessibilité vocale.</p>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border border-emerald-150">
                        <div className="bg-emerald-100/60 text-emerald-800 px-4 py-2 text-[10px] font-mono flex items-center justify-between">
                          <span>Conforme.html</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">✅ Optimal</span>
                        </div>
                        <pre className="bg-slate-900 text-emerald-100 p-4 overflow-x-auto font-mono text-xs leading-5">
                          <code>{currentErr.goodCode}</code>
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Educational explanation bar */}
                  <div className="xl:col-span-2 bg-indigo-50/60 rounded-2xl border border-indigo-150 p-5 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span>Analyse d'Expert sémantique</span>
                    </h4>
                    <p className="text-sm text-indigo-950 leading-relaxed font-medium">
                      {currentErr.explanation}
                    </p>
                  </div>

                </div>
              );
            })()}

          </div>
        )}

        {/* ==================== TAB 3: AI-POWERED AUDITOR ==================== */}
        {activeTab === "auditor" && (
          <div id="panel-auditor" className="space-y-6 animate-fadeIn">
            
            {/* Explainer Intro Card */}
            <div className="max-w-3xl space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">Intelligence Artificielle de Sémantique</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-gray-900">
                Auditez votre code HTML instantanément
              </h2>
              <p className="text-gray-650 text-sm sm:text-base leading-relaxed">
                Notre module d'intelligence artificielle analyse la structure, les balises, et les erreurs d'accessibilité de votre code pour vous attribuer un score sémantique et vous proposer un plan de correction clé en main.
              </p>
            </div>

            {/* Audit Grid Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Code inputs & template loaders (7 cols) */}
              <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-3xl border border-gray-200/90 shadow-xs p-5 sm:p-6 space-y-5">
                
                {/* Templates Selector */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Charger un modèle de test :</span>
                  <div className="flex flex-wrap gap-2">
                    {INITIAL_AUDIT_TEMPLATES.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => loadTemplate(item.code)}
                        className="text-xs px-3 py-2 rounded-xl border border-gray-250 bg-gray-50 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all font-medium cursor-pointer flex items-center gap-1.5"
                      >
                        <FileCode2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Code Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label id="editor-label" htmlFor="code-input" className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Terminal className="text-purple-600 w-4 h-4" />
                      <span>Votre Code HTML (Entrée libre) :</span>
                    </label>
                    <span className="text-xs text-gray-400 font-mono">HTML5 Valide recommandé</span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden border border-gray-250 shadow-inner">
                    <textarea
                      id="code-input"
                      value={codeToAudit}
                      onChange={(e) => setCodeToAudit(e.target.value)}
                      placeholder="Collez ici votre structure HTML à tester..."
                      rows={12}
                      className="w-full bg-slate-900 text-[#E2E8F0] p-4 font-mono text-xs leading-5 focus:outline-none focus:ring-0 resize-none"
                    />
                  </div>
                </div>

                {/* Audit trigger buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span>L'audit évalue la pertinence de l'en-tête, menu, sections et l'accessibilité.</span>
                  </p>
                  
                  <button
                    id="trigger-audit-btn"
                    onClick={handleRunAudit}
                    disabled={isAuditing}
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-display text-sm tracking-wide text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      isAuditing
                        ? "bg-purple-400 cursor-not-allowed"
                        : "bg-gradient-to-tr from-purple-600 top-indigo-700 hover:from-purple-700 hover:to-indigo-800 hover:scale-[1.01]"
                    }`}
                  >
                    {isAuditing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Analyse sémantique en cours...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Auditer le code maintenant</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Display connection errors / Warnings if Gemini is not ready */}
                {auditError && (
                  <div className="rounded-2xl border bg-amber-50/50 border-amber-250 p-4.5 space-y-3 animate-fadeIn">
                    <div className="flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-emerald-950 font-display">Clé de l'API de Gemini non configurée</h4>
                        <p className="text-xs text-gray-700 leading-relaxed mt-1">
                          Le serveur n'a pas pu contacter l'API de Gemini car la variable <code className="font-mono bg-white px-2 py-0.5 rounded text-amber-800">GEMINI_API_KEY</code> n'est pas configurée dans les secrets de l'application ou l'environnement local.
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border border-amber-100 rounded-xl p-3.5 space-y-2">
                      <p className="text-xs font-semibold text-gray-700">💡 Que pouvez-vous faire ?</p>
                      <ul className="text-[11px] list-disc list-inside text-gray-600 space-y-1">
                        <li>Renseignez la clé au niveau des secrets ou de votre fichier <code className="font-mono">.env</code></li>
                        <li>Utilisez les onglets <strong className="text-purple-700 font-bold">Dictionnaire A-Z</strong> et <strong className="text-purple-700 font-bold">Erreurs & Pratiques</strong> pour apprendre de façon autonome.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Results from Server (5 cols) */}
              <div className="lg:col-span-12 xl:col-span-5 space-y-6">
                
                {isAuditing && (
                  <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-4 shadow-xs">
                    <div className="relative w-16 h-16 mx-auto">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-purple-600 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-900 font-display">Notre expert IA inspecte votre balisage</p>
                      <p className="text-xs text-gray-500">Validation des en-têtes, de l'indexation, de la div-soup et des alternatives d'accessibilité...</p>
                    </div>
                  </div>
                )}

                {!isAuditing && !auditResult && (
                  <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center space-y-3 shadow-xs text-gray-400">
                    <Send className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="text-sm font-bold">Prêt pour l'évaluation</p>
                    <p className="text-xs leading-relaxed max-w-xs mx-auto">Cliquez sur le bouton d'audit pour visualiser votre score de performance sémantique, le diagnostic W3C et les corrections automatiques.</p>
                  </div>
                )}

                {auditResult && (
                  <div className="space-y-6 animate-fadeIn">
                    
                    {/* Score panel */}
                    <div className="bg-white rounded-3xl border border-gray-200/90 p-5 shadow-sm space-y-4">
                      
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-gray-500 uppercase">Score Sémantique Global</span>
                        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded">Évaluation IA</span>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="relative flex-shrink-0 w-20 h-20">
                          {/* Radial Progress */}
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-100"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={`${
                                auditResult.score >= 80 ? "text-emerald-500" :
                                auditResult.score >= 50 ? "text-amber-500" : "text-rose-500"
                              }`}
                              strokeDasharray={`${auditResult.score}, 100`}
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-extrabold font-display leading-none text-gray-900">{auditResult.score}</span>
                            <span className="text-[10px] text-gray-400 font-bold self-end mb-1">/100</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className={`text-sm font-bold font-display ${
                            auditResult.score >= 80 ? "text-emerald-800" :
                            auditResult.score >= 50 ? "text-amber-800" : "text-rose-800"
                          }`}>
                            {auditResult.score >= 80 ? "Sémantique Excellente !" :
                             auditResult.score >= 50 ? "Peut Mieux Faire" : "Sémantique Critique !"}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed font-medium">
                            {auditResult.generalAnalysis}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Detailed findings and issues list */}
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Analyse des Éléments ({auditResult.issues.length})</span>
                      
                      <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
                        {auditResult.issues.map((issue, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-2xl border text-sm space-y-3 ${
                              issue.type === "error"
                                ? "bg-rose-50/40 border-rose-200"
                                : issue.type === "warning"
                                ? "bg-amber-50/40 border-amber-200"
                                : "bg-emerald-50/40 border-emerald-200"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold font-mono ${
                                issue.type === "error" ? "bg-rose-100 text-rose-800" :
                                issue.type === "warning" ? "bg-amber-100 text-amber-800" :
                                "bg-emerald-100 text-emerald-800"
                              }`}>
                                {issue.type === "error" ? "Erreur critique" :
                                 issue.type === "warning" ? "Avertissement" : "Bonne pratique"}
                              </span>

                              {issue.type === "error" && <XCircle className="w-4.5 h-4.5 text-rose-500" />}
                              {issue.type === "warning" && <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />}
                              {issue.type === "success" && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />}
                            </div>

                            <p className="text-xs text-gray-800 font-medium leading-relaxed">
                              {issue.message}
                            </p>

                            <div className="text-[11px] text-gray-650 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl border border-gray-150 relative space-y-1">
                              <span className="font-bold text-purple-800 block">💡 Suggestion de correction :</span>
                              <p>{issue.suggestion}</p>
                            </div>

                            {/* Code comparison if snippets exist */}
                            {issue.originalCodeSnippet && issue.replacementCodeSnippet && (
                              <div className="grid grid-cols-1 gap-2 pt-1">
                                <details className="group">
                                  <summary className="text-[11px] font-bold text-purple-700 hover:text-purple-900 cursor-pointer outline-none select-none flex items-center gap-1">
                                    <span>Visualiser la réécriture propre</span>
                                  </summary>
                                  
                                  <div className="mt-2 text-[10px] space-y-2 border-t border-gray-200/50 pt-2 animate-fadeIn">
                                    <div className="bg-slate-900 rounded-xl overflow-hidden">
                                      <div className="bg-rose-950/40 border-b border-rose-900/40 text-rose-300 px-3 py-1 text-[9px] font-mono">
                                        Original :
                                      </div>
                                      <pre className="p-3 text-red-100 overflow-x-auto font-mono leading-relaxed">
                                        <code>{issue.originalCodeSnippet}</code>
                                      </pre>
                                    </div>

                                    <div className="bg-slate-900 rounded-xl overflow-hidden">
                                      <div className="bg-emerald-950/40 border-b border-emerald-900/40 text-emerald-300 px-3 py-1 text-[9px] font-mono">
                                        Sémantique Corrigé :
                                      </div>
                                      <pre className="p-3 text-emerald-100 overflow-x-auto font-mono leading-relaxed">
                                        <code>{issue.replacementCodeSnippet}</code>
                                      </pre>
                                    </div>
                                  </div>
                                </details>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 4: INTERACTIVE QUIZ GAME ==================== */}
        {activeTab === "game" && (
          <div id="panel-game" className="space-y-6 animate-fadeIn">
            
            <div className="max-w-3xl space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-750 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">Testez Vos Réflexes</span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-gray-900">
                Le Jeu de Correspondance Sémantique
              </h2>
              <p className="text-gray-650 text-sm sm:text-base leading-relaxed">
                Mettez en pratique vos connaissances ! Associez chaque cas d'usage ou description à la balise HTML5 sémantique correcte préconisée par le standard universel W3C.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 font-display">Complétez le Gabarit</h3>
                  <p className="text-xs text-gray-500">Choisissez la balise la plus appropriée pour chaque zone de texte.</p>
                </div>
                
                <button
                  id="reset-game-btn"
                  onClick={initializeGame}
                  className="px-4 py-2 border border-gray-250 hover:bg-gray-50 text-gray-700 bg-white shadow-3xs rounded-xl text-xs font-bold font-display flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              </div>

              {/* Game blocks grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameBlocks.map((block) => {
                  let statusBorder = "border-gray-200 hover:border-gray-300";
                  let statusBg = "bg-gray-50/30";

                  if (block.isCorrect === true) {
                    statusBorder = "border-emerald-300 ring-2 ring-emerald-500/10";
                    statusBg = "bg-emerald-50/30";
                  } else if (block.isCorrect === false) {
                    statusBorder = "border-rose-300 ring-2 ring-rose-500/10";
                    statusBg = "bg-rose-50/30";
                  }

                  return (
                    <div
                      key={block.id}
                      className={`p-5 rounded-2xl border transition-all space-y-3.5 ${statusBorder} ${statusBg}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center font-mono">
                            #
                          </span>
                          <span className="font-bold text-sm text-gray-900 font-display leading-tight">{block.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-normal">{block.description}</p>
                      </div>

                      {/* Dropdown Selector */}
                      <div className="space-y-1">
                        <label id={`game-label-${block.id}`} htmlFor={`game-select-${block.id}`} className="sr-only">Sélectionner une balise pour {block.label}</label>
                        <select
                          id={`game-select-${block.id}`}
                          value={block.selectedTag}
                          onChange={(e) => handleGameTagSelect(block.id, e.target.value)}
                          className="w-full text-xs font-mono font-bold bg-white border border-gray-250 rounded-xl px-3 py-2 text-purple-800 outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
                        >
                          <option value="">-- Choisir la balise --</option>
                          {GAME_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Correction feedback */}
                      {block.isCorrect !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          {block.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-emerald-700">Correct ! Excellent</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-550" />
                              <span className="text-rose-700">Attendu : <code className="font-mono bg-rose-100 rounded text-rose-900 px-1">{block.correctTag}</code></span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom trigger row */}
              <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-gray-500">
                  Complétez l'ensemble des {gameBlocks.length} blocs avant d'évaluer vos réponses.
                </div>

                <button
                  id="submit-answers-btn"
                  onClick={checkGameAnswers}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-display text-xs tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Vérifier mes réponses
                </button>
              </div>

              {/* Dynamic Game Feedback Panel */}
              {gameFeedback && (
                <div className={`p-5 rounded-2xl border flex items-center flex-col sm:flex-row gap-5 animate-fadeIn ${
                  gameFeedback.isWon
                    ? "bg-emerald-50/50 border-emerald-250"
                    : "bg-purple-50/50 border-purple-200"
                }`}>
                  <div className="flex-shrink-0 bg-white shadow-md w-16 h-16 rounded-full flex items-center justify-center border border-gray-100">
                    <Award className={`w-8 h-8 ${gameFeedback.isWon ? "text-amber-500 animate-bounce" : "text-purple-600"}`} />
                  </div>
                  
                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <h4 className="font-bold text-gray-900 font-display text-base">
                      {gameFeedback.isWon ? "🎉 Félicitations ! Score Sémantique Parfait" : "📈 Bon début, continuez de vous entraîner !"}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Votre taux de réussite est de <strong>{gameFeedback.percentage}%</strong>. Chaque balise maîtrisée permet de rendre l'internet plus accessible et mieux indexé.
                    </p>
                  </div>

                  <div className="font-mono text-3xl font-black text-purple-800">
                    {gameFeedback.percentage}%
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ==================== TAB 5: LE MANIFESTE SÉMANTIQUE ==================== */}
        {activeTab === "manifesto" && (
          <div id="panel-manifesto" className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
            
            <div className="space-y-2 text-center pb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">Plongée Philosophique</span>
              <h2 className="text-3xl font-black font-display tracking-tight text-gray-900">
                Pourquoi la Sémantique est Cruciale
              </h2>
              <p className="text-gray-550 text-sm max-w-lg mx-auto leading-relaxed">
                Rendre le web sémantique, c'est respecter vos utilisateurs, les machines, et l'avenir d'internet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-3xs space-y-3.5">
                <div className="p-2 w-max rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
                  <Accessibility className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 font-display text-lg">1. L'Accessibilité Universelle (A11y)</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Les personnes aveugles ou malvoyantes parcourent le web à l'aide de lecteurs d'écran (voix synthétique ou plage braille). Ces liseuses se basent sur des **repères structurels (landmarks)**.
                </p>
                <p className="text-xs text-indigo-950 font-semibold bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                  "Une page structurée avec main, header, nav et section permet à l'utilisateur de sauter directement au contenu recherché au lieu de devoir écouter l'intégralité du menu à chaque rechargement !"
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-3xs space-y-3.5">
                <div className="p-2 w-max rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-bold text-gray-900 font-display text-lg">2. Le Référencement Naturel (SEO)</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Les robots d'indexation (like Googlebot) n'ont pas d'yeux. Ils interprètent le code brut. Quand un robot explore une page remplie de <code className="font-mono bg-gray-100 text-gray-800 px-1 rounded">{"<div>"}</code>, il a d'extrêmes difficultés à comprendre quel est le fragment d'information le plus important.
                </p>
                <p className="text-xs text-emerald-950 font-semibold bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                  "Grâce aux balises sémantiques, les moteurs capturent élégamment les dates de révision avec &lt;time&gt; et les citations avec &lt;blockquote&gt; pour les placer en haut des résultats de recherche."
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-3xs space-y-3.5">
                <div className="p-2 w-max rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 font-display text-lg">3. Performance de Développement</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Moins de wrappers CSS complexes. En utilisant les balises HTML5 natives, le code devient autonome. Sa lecture est intuitive : n'importe quel développeur comprend l'objectif du code instantanément.
                </p>
                <p className="text-xs text-blue-950 font-semibold bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                  "Moins de classes à maintenir, aucun script JavaScript lourd pour simuler des boutons, les navigateurs gérant nativement le fonctionnement interactif d'un &lt;details&gt;."
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-3xs space-y-3.5">
                <div className="p-2 w-max rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 font-display text-lg">4. Pérennité & Évolution du standard</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  Les navigateurs s'optimisent constamment, tout comme les montres connectées et assistants vocaux. Rédiger un HTML strictement sémantique vous garantit l'affichage propre de votre site sur n'importe quel support futuriste.
                </p>
                <p className="text-xs text-purple-950 font-semibold bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                  "Une montre intelligente peut choisir d'afficher précisément et uniquement l'élément &lt;article&gt; principal en format lecture rapide pour optimiser l'écran miniature."
                </p>
              </div>

            </div>

            {/* General Conclusion Quote card */}
            <div className="bg-gradient-to-r from-purple-950 to-indigo-950 p-8 rounded-3xl text-white flex flex-col items-center text-center space-y-4 shadow-md">
              <p className="font-mono text-[10px] uppercase text-purple-300 font-bold tracking-widest bg-white/10 px-3 py-1 rounded-full">
                Le Standard W3C
              </p>
              <blockquote className="text-base sm:text-lg max-w-2xl font-display font-medium text-purple-50 italic leading-relaxed">
                "La sémantique n'est pas une option ou un luxe cosmétique. C'est l'épine dorsale d'un Web ouvert, démocratique et accessible, qui permet aux humains et aux machines d'échanger en parfaite synchronie."
              </blockquote>
              <cite className="text-xs font-mono text-gray-400 not-italic">
                — Guide d'Expertise Sémantique HTML5
              </cite>
            </div>

          </div>
        )}

      </main>

      {/* Footer Branding section */}
      <footer id="global-footer" className="bg-white border-t border-gray-150 py-8 text-center text-xs text-gray-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-800">Sémantique HTML5 de A à Z</span>
            <span>•</span>
            <span>Maîtrise complète du Code HTML</span>
            <span>•</span>
            <span>Auditeur de sémantique WAI-ARIA</span>
          </div>
          <p className="leading-relaxed">
            Propulsé par le moteur d'analyse Gemini. Validé conformément aux critères d'expérience utilisateur et de sémantique moderne du W3C.
          </p>
          <p className="text-[10px] font-mono text-gray-400">
            Dernière mise à jour : {new Date().getFullYear()} – Tous droits réservés.
          </p>
        </div>
      </footer>

    </div>
  );
}
