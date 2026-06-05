import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  Copy,
  Check,
  Code2,
  HelpCircle,
  FileBadge,
  CheckSquare,
  Network,
  Eye,
  Activity,
  ArrowRight,
  Bookmark
} from "lucide-react";
import { playSound } from "../utils/audio";

interface Rule {
  id: string;
  description: string;
  check: (doc: Document, rawText: string) => boolean;
}

interface Challenge {
  id: string;
  title: string;
  difficulty: "Débutant" | "Intermédiaire" | "Expert";
  difficultyColor: string;
  description: string;
  goal: string;
  initialCode: string;
  targetSkeleton: string; // Brief visual representation of what is expected
  tagsUsed: string[];
  rules: Rule[];
}

interface TreeNode {
  tag: string;
  children: TreeNode[];
  id: string;
}

export default function AdvancedChallenges() {
  const challenges: Challenge[] = [
    {
      id: "blog_post",
      title: "La Une de Presse Sémantique",
      difficulty: "Débutant",
      difficultyColor: "text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20",
      description: "Structurez la une d'un grand journal en ligne. Vous devez fournir un en-tête de site intégrant un menu de navigation, suivi du corps de l'article principal daté et organisé sémantiquement.",
      goal: "Évitez tout élément générique (div, span) et tirez parti de la hiérarchie sémantique HTML5 complète : header, nav, main, article et time.",
      initialCode: "<!-- Écrivez votre structure sémantique ici ! -->\n<header>\n  <h1>Le Petit Sémantique</h1>\n  <!-- Ajoutez le menu de navigation ici -->\n</header>\n\n<main>\n  <!-- Créez l'article principal de la une ici -->\n</main>",
      targetSkeleton: `<header>
  <nav>[Articles | À propos]</nav>
</header>
<main>
  <article>
    <header>
      <h2>Titre</h2>
      <time>Date</time>
    </header>
    <p>Corps de l'article...</p>
    <footer>Mots-clés</footer>
  </article>
</main>`,
      tagsUsed: ["header", "nav", "main", "article", "time", "footer", "p"],
      rules: [
        {
          id: "no_div_span",
          description: "Aucun élément générique <div> ou <span> n'est toléré.",
          check: (doc) => doc.querySelectorAll("div, span").length === 0
        },
        {
          id: "has_header",
          description: "Contient au moins une balise globale d'en-tête (<header>).",
          check: (doc) => doc.querySelectorAll("header").length >= 1
        },
        {
          id: "has_nav",
          description: "Possède un bloc de navigation (<nav>) imbriqué dans l'en-tête.",
          check: (doc) => {
            const header = doc.querySelector("header");
            return header ? header.querySelector("nav") !== null : false;
          }
        },
        {
          id: "has_main",
          description: "Contient la zone principale (<main>) de la page.",
          check: (doc) => doc.querySelectorAll("main").length === 1
        },
        {
          id: "has_article_inside_main",
          description: "L'article principal (<article>) est situé dans la zone <main>.",
          check: (doc) => {
            const main = doc.querySelector("main");
            return main ? main.querySelector("article") !== null : false;
          }
        },
        {
          id: "article_header_footer",
          description: "L'article possède un <header> (titre/date) et un <footer> (mots-clés/liens).",
          check: (doc) => {
            const article = doc.querySelector("main article");
            if (!article) return false;
            return article.querySelector("header") !== null && article.querySelector("footer") !== null;
          }
        },
        {
          id: "has_time",
          description: "Contient une balise de date précise (<time>) dans l'en-tête de l'article.",
          check: (doc) => {
            const articleHeader = doc.querySelector("main article header");
            return articleHeader ? articleHeader.querySelector("time") !== null : false;
          }
        },
        {
          id: "has_p_tag",
          description: "Le texte de l'article est enveloppé dans au moins un paragraphe sémantique (<p>).",
          check: (doc) => {
            const article = doc.querySelector("main article");
            return article ? article.querySelectorAll("p").length >= 1 : false;
          }
        }
      ]
    },
    {
      id: "media_gallery",
      title: "Galerie Photo d'Artistes",
      difficulty: "Intermédiaire",
      difficultyColor: "text-amber-600 dark:text-amber-400 border-amber-305 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20",
      description: "Réalisez une vitrine interactive de photographies marines. Chaque image doit être légendée sémantiquement, les articles doivent posséder des panneaux d'informations d'artistes latéraux et des mentions de copyright.",
      goal: "Représenter sémantiquement des photos et médias via <figure> et son <figcaption>, utiliser des sections thématiques et des appartes contextuelles.",
      initialCode: "<!-- Débutez votre galerie sémantique -->\n<main>\n  <section>\n    <h2>Photographies de l'Océan</h2>\n    <!-- Insérez la figure de votre œuvre d'art ici -->\n  </section>\n  \n  <!-- Ajoutez des infos d'artiste complémentaires -->\n</main>",
      targetSkeleton: `<main>
  <section>
    <figure>
      <img>
      <figcaption>Légende de la photo</figcaption>
    </figure>
  </section>
  <aside>Biographie de l'artiste</aside>
  <footer>Copyright</footer>
</main>`,
      tagsUsed: ["main", "section", "figure", "figcaption", "img", "aside", "footer"],
      rules: [
        {
          id: "no_div_span",
          description: "Aucun élément générique <div> ou <span> n'est toléré.",
          check: (doc) => doc.querySelectorAll("div, span").length === 0
        },
        {
          id: "has_main",
          description: "Le site possède une zone principale de contenu (<main>).",
          check: (doc) => doc.querySelectorAll("main").length === 1
        },
        {
          id: "has_section_inside_main",
          description: "La galerie est structurée dans un groupement thématique (<section>).",
          check: (doc) => {
            const main = doc.querySelector("main");
            return main ? main.querySelector("section") !== null : false;
          }
        },
        {
          id: "has_figure_and_caption",
          description: "L'image est enveloppée dans une <figure> contenant une légende sémantique (<figcaption>).",
          check: (doc) => {
            const fig = doc.querySelector("figure");
            if (!fig) return false;
            const img = fig.querySelector("img");
            const caption = fig.querySelector("figcaption");
            return img !== null && caption !== null;
          }
        },
        {
          id: "has_aside",
          description: "Contient une apparté (<aside>) pour l'encart d'informations de l'auteur.",
          check: (doc) => doc.querySelectorAll("aside").length >= 1
        },
        {
          id: "has_footer",
          description: "Contient un pied de page (<footer>) pour signaler la licence des images.",
          check: (doc) => doc.querySelectorAll("footer").length >= 1
        }
      ]
    },
    {
      id: "app_dashboard",
      title: "Tableau de Bord Applicatif",
      difficulty: "Expert",
      difficultyColor: "text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20",
      description: "Codez la structure d'arrière-plan d'un panneau d'administration de projet. Il possède un menu d'applications, un espace de statistiques, un widget d'historique en temps réel et des alertes de sécurité.",
      goal: "Combiner avec rigueur les rôles structurels afin de rendre le tableau de bord intelligible et accessible, sans la moindre boîte générique div.",
      initialCode: "<!-- Architecture d'un dashboard de pointe -->\n<nav>\n  <!-- Liens de navigation du dashboard -->\n</nav>\n\n<main>\n  <!-- Section des indicateurs clés (stats) -->\n  \n  <!-- Zone d'activité en temps réel avec date -->\n</main>\n\n<!-- Sidebar contextuelle d'aide -->",
      targetSkeleton: `<nav>Liens Dashboard</nav>
<main>
  <section><h3>Statistiques</h3></section>
  <article>
    <h4>Alerte Système</h4>
    <time>Dernière mise à jour</time>
  </article>
</main>
<aside>Chat & Assistance</aside>`,
      tagsUsed: ["nav", "main", "section", "article", "time", "aside"],
      rules: [
        {
          id: "no_div_span",
          description: "Consigne d'or : aucune balise neutre <div> ou <span>.",
          check: (doc) => doc.querySelectorAll("div, span").length === 0
        },
        {
          id: "has_nav",
          description: "Possède un module de navigation (<nav>) pour basculer d'onglet.",
          check: (doc) => doc.querySelectorAll("nav").length >= 1
        },
        {
          id: "has_main",
          description: "Contient la zone centrale (<main>) de l'espace de travail.",
          check: (doc) => doc.querySelectorAll("main").length === 1
        },
        {
          id: "has_sections",
          description: "Le <main> détient au moins une <section> thématique.",
          check: (doc) => {
            const main = doc.querySelector("main");
            return main ? main.querySelectorAll("section").length >= 1 : false;
          }
        },
        {
          id: "alerts_are_articles",
          description: "Chaque notification système est formatée comme un bloc indépendant (<article>).",
          check: (doc) => doc.querySelectorAll("article").length >= 1
        },
        {
          id: "has_time",
          description: "Contient un marqueur temporel (<time>) pour l'actualisation des données.",
          check: (doc) => doc.querySelectorAll("time").length >= 1
        },
        {
          id: "has_aside",
          description: "Intègre un panneau flottant d'aide (<aside>) pour l'assistance.",
          check: (doc) => doc.querySelectorAll("aside").length >= 1
        }
      ]
    }
  ];

  const [activeChallengeIndex, setActiveChallengeIndex] = useState(0);
  const currentChallenge = challenges[activeChallengeIndex];
  
  const [userCode, setUserCode] = useState(currentChallenge.initialCode);
  const [activeSubTab, setActiveSubTab] = useState<"checks" | "tree" | "preview">("checks");
  
  // Rule status
  const [rulesStatus, setRulesStatus] = useState<{ id: string; passed: boolean }[]>([]);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [hasTriggeredSuccessAlert, setHasTriggeredSuccessAlert] = useState(false);
  
  // Syntax structures
  const [parsedTree, setParsedTree] = useState<TreeNode[]>([]);
  const [hasSyntaxError, setHasSyntaxError] = useState(false);
  const [syntaxErrorMessage, setSyntaxErrorMessage] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  // Initialize code when changing challenges
  useEffect(() => {
    setUserCode(currentChallenge.initialCode);
    setHasSucceeded(false);
    setHasTriggeredSuccessAlert(false);
  }, [activeChallengeIndex]);

  // Real-time parser validation
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const parser = new DOMParser();
      // Parse current user input. Wrap inside body to make parsing predictable
      const parsedDoc = parser.parseFromString(`<body>${userCode}</body>`, "text/html");
      
      // Check for syntax errors reported by the parser
      const parseErrorNode = parsedDoc.querySelector("parsererror");
      if (parseErrorNode) {
        setHasSyntaxError(true);
        setSyntaxErrorMessage(parseErrorNode.textContent || "Erreur de syntaxe HTML");
      } else {
        setHasSyntaxError(false);
        setSyntaxErrorMessage("");
      }

      // Check each rule
      const statuses = currentChallenge.rules.map(rule => {
        try {
          return {
            id: rule.id,
            passed: rule.check(parsedDoc, userCode)
          };
        } catch {
          return { id: rule.id, passed: false };
        }
      });

      setRulesStatus(statuses);

      // Verify overall success
      const allPassed = statuses.every(s => s.passed);
      setHasSucceeded(allPassed);

      // Extract DOM Tree structure for the visual tree
      const rootBody = parsedDoc.body;
      let nodeIdCounter = 0;
      
      const buildTree = (el: Element): TreeNode => {
        const id = `${el.tagName.toLowerCase()}-${nodeIdCounter++}`;
        return {
          tag: el.tagName.toLowerCase(),
          children: Array.from(el.children).map(child => buildTree(child)),
          id
        };
      };

      const trees = Array.from(rootBody.children).map(child => buildTree(child));
      setParsedTree(trees);

    } catch (e: any) {
      console.error(e);
    }
  }, [userCode, activeChallengeIndex]);

  // Play sweet success audio only once per challenge accomplishment
  useEffect(() => {
    if (hasSucceeded && !hasTriggeredSuccessAlert) {
      playSound("success");
      setHasTriggeredSuccessAlert(true);
    }
  }, [hasSucceeded, hasTriggeredSuccessAlert]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    playSound("ding");
  };

  const handleInjectTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    const openTag = `<${tag}>`;
    const closeTag = `</${tag}>`;
    const insertText = openTag + (start !== end ? text.substring(start, end) : "") + closeTag;

    const newCode = before + insertText + after;
    setUserCode(newCode);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const cursorOffset = before.length + openTag.length;
      textarea.setSelectionRange(cursorOffset, cursorOffset);
    }, 50);

    playSound("ding");
  };

  const currentScore = Math.round(
    (rulesStatus.filter(r => r.passed).length / currentChallenge.rules.length) * 100
  );

  // Helper renderer for recursively drawing the HTML tag node list
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const isSemantic = currentChallenge.tagsUsed.includes(node.tag);
    const isGeneric = node.tag === "div" || node.tag === "span";

    return (
      <div key={node.id} className="select-none font-mono">
        <div 
          className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        >
          <span className="text-gray-400">├─</span>
          <code className={`text-xs px-1.5 py-0.5 rounded font-black tracking-wide border ${
            isGeneric
              ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border-rose-200 dark:border-rose-900/40"
              : isSemantic
              ? "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/40"
              : "bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-350 border-gray-200 dark:border-slate-705"
          }`}>
            &lt;{node.tag}&gt;
          </code>
          <span className="text-[10px] text-gray-400 font-sans">
            {isGeneric ? "⚠️ Non-Sémantique" : isSemantic ? "✨ Conforme" : "Balise standard"}
          </span>
        </div>
        {node.children.map(child => renderTreeNode(child, depth + 1))}
      </div>
    );
  };

  // Helper to map user HTML sémantics to visual responsive cards for block layout mock preview
  const renderInteractiveBlockMock = (node: TreeNode): React.ReactNode => {
    const tag = node.tag;
    const name = `<${tag}>`;

    const blockStyles: Record<string, string> = {
      header: "bg-amber-100/60 dark:bg-amber-955/20 border-amber-300 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 shadow-2xs",
      nav: "bg-indigo-100/60 dark:bg-indigo-955/20 border-indigo-300 dark:border-indigo-900/50 text-indigo-800 dark:text-indigo-300 font-mono text-[11px]",
      main: "bg-blue-50/60 dark:bg-blue-955/20 border-blue-300 dark:border-blue-900/50 text-blue-800 dark:text-blue-300 min-h-[140px]",
      section: "bg-cyan-50/50 dark:bg-cyan-955/20 border-cyan-200 dark:border-cyan-900/40 text-cyan-800 dark:text-cyan-300 p-3 my-2",
      article: "bg-emerald-50/50 dark:bg-emerald-955/20 border-emerald-250 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 p-3.5 my-2 border-dashed",
      aside: "bg-pink-100/50 dark:bg-pink-955/20 border-pink-200 dark:border-pink-900/40 text-pink-800 dark:text-pink-300",
      footer: "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-center font-bold",
      figure: "bg-teal-50 dark:bg-teal-950/25 border-teal-250 dark:border-teal-900/40 p-2 border italic",
      figcaption: "text-[10px] tracking-wide text-app-muted border-t border-teal-200/50 mt-1.5 pt-1",
      img: "bg-white dark:bg-slate-900 rounded border p-1 text-[10px] block max-w-[80px] text-center",
      time: "inline-block bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-[10px] px-1.5 py-0.5 rounded text-purple-700 dark:text-purple-300 text-xs font-mono font-bold"
    };

    const isDirectInline = tag === "time" || tag === "img" || tag === "figcaption";
    const layoutStyle = blockStyles[tag] || "bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 text-xs";

    return (
      <div 
        key={node.id} 
        className={`border rounded-lg p-2.5 transition-all w-full select-none ${layoutStyle} ${
          isDirectInline ? "inline-block w-auto m-0.5" : "block space-y-2 mb-2"
        }`}
      >
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider mb-1">
          <span>{name}</span>
        </div>
        
        {/* Render child elements */}
        {node.children.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            {node.children.map(child => renderInteractiveBlockMock(child))}
          </div>
        ) : (
          !isDirectInline && <span className="text-[10px] opacity-50 block italic">Contenu sémantique...</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-850 p-6 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/50">
              <Network className="w-5 h-5 text-purple-700 dark:text-purple-400" />
            </div>
            <h2 className="text-xl font-black text-gray-901 dark:text-white flex items-center gap-1.5">
              <span>Défis Sémantiques Avancés</span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-250 text-[11px] px-2 py-0.5 rounded-full font-sans font-bold">PRO</span>
            </h2>
          </div>
          <p className="text-sm text-app-muted leading-relaxed max-w-2xl font-semibold">
            Reconstruisez d'authentiques maquettes web conformes aux standards W3C. Vos structures HTML doivent utiliser <strong>uniquement des balises sémantiques</strong>, éliminant totalement les conteneurs neutres de type div.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-purple-50 dark:bg-purple-950/35 border border-purple-150 dark:border-purple-900 p-3 rounded-xl flex-shrink-0 w-full md:w-auto">
          <FileBadge className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <div>
            <div className="text-xs text-app-muted font-sans font-bold uppercase">SCORE MOYEN</div>
            <div className="text-lg font-black text-purple-800 dark:text-purple-300 font-mono">
              {challenges.length} Niveaux Dispo
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Challenges & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Challenge List & Goal Details */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-gray-150 dark:border-slate-800 p-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-app-muted flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-purple-500" />
              <span>Choix du Scénario</span>
            </h3>
            
            <div className="space-y-2">
              {challenges.map((c, idx) => {
                const isActive = activeChallengeIndex === idx;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveChallengeIndex(idx);
                      playSound("ding");
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center gap-3 cursor-pointer ${
                      isActive
                        ? "bg-purple-50/60 dark:bg-purple-950/20 border-purple-500 ring-2 ring-purple-400/20 shadow-2xs"
                        : "bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border-gray-150 dark:border-slate-800"
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="text-xs font-bold text-gray-901 dark:text-white truncate">
                        {idx + 1}. {c.title}
                      </div>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full border ${c.difficultyColor}`}>
                        {c.difficulty}
                      </span>
                    </div>
                    {isActive ? (
                      <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white scale-110 shadow-xs">
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400">
                        <Play className="w-2.5 h-2.5 fill-gray-400 hover:scale-110" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goal & Target Wireframe layout cardboard */}
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-gray-150 dark:border-slate-800 p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-app-muted font-sans flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>Objectif de la mission</span>
              </span>
              <p className="text-xs text-gray-750 dark:text-slate-300 leading-relaxed font-semibold">
                {currentChallenge.description}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-3 rounded-xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted block">Gabarit Sémantique Cible :</span>
              <pre className="text-[11px] font-mono leading-tight text-purple-700 dark:text-purple-400 bg-purple-50/20 dark:bg-purple-950/10 p-2.5 rounded border border-purple-200/30 overflow-x-auto whitespace-pre-wrap">
                {currentChallenge.targetSkeleton}
              </pre>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted block">Balises reines requises :</span>
              <div className="flex flex-wrap gap-1.5">
                {currentChallenge.tagsUsed.map((t) => (
                  <code 
                    key={t}
                    onClick={() => handleInjectTag(t)}
                    title={`Cliquer pour insérer <${t}>`}
                    className="text-[11px] font-mono text-purple-650 dark:text-purple-305 bg-purple-50 dark:bg-purple-950/40 border border-purple-150 dark:border-purple-900/40 px-2 py-1 rounded cursor-pointer hover:bg-purple-100/60 dark:hover:bg-purple-900 hover:scale-105 active:scale-95 transition-all shadow-2xs font-bold"
                  >
                    &lt;{t}&gt;
                  </code>
                ))}
              </div>
              <span className="text-[9px] text-gray-400 italic block">Astuce : Cliquez sur une balise ci-dessus pour l'insérer au curseur d'édition !</span>
            </div>
          </div>
        </div>

        {/* Center panel: HTML source editor */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
            <div className="bg-slate-50 dark:bg-slate-900/60 px-4 py-3 border-b border-gray-150 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-bold text-gray-901 dark:text-white">Éditeur Sémantique XML/HTML</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400 cursor-pointer shadow-3xs transition-colors flex items-center gap-1"
                  title="Copier le code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-bold">Copier</span>
                </button>
                <button
                  onClick={() => {
                    setUserCode(currentChallenge.initialCode);
                    playSound("incorrect");
                  }}
                  className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/10 hover:bg-rose-100 dark:hover:bg-rose-950/25 text-rose-600 dark:text-rose-400 cursor-pointer text-[10px] font-bold"
                >
                  Réinitialiser
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                id="challenge-html-editor"
                ref={textareaRef}
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="<!-- Saisissez vos balises HTML sémantiques ici... -->"
                rows={11}
                className="w-full p-4 font-mono text-xs sm:text-sm bg-slate-950 text-slate-100 focus:outline-none leading-relaxed border-0 focus:ring-2 focus:ring-purple-500 resize-y"
                style={{ minHeight: "280px" }}
              />

              {hasSyntaxError && (
                <div className="absolute bottom-0 left-0 right-0 bg-rose-500/10 backdrop-blur-md px-4 py-2 border-t border-rose-500/30 text-[11px] text-rose-450 flex items-start gap-2 max-h-16 overflow-y-auto">
                  <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span className="font-mono">{syntaxErrorMessage}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-900/20 dark:bg-slate-950/20 p-3 border-t border-gray-150 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs font-semibold">
              <div className="flex items-center gap-1 text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-555"></span>
                <span>Calcul en direct</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {["header", "nav", "main", "article", "aside", "section", "figure", "figcaption", "footer", "time"].map(x => (
                  <button
                    key={x}
                    onClick={() => handleInjectTag(x)}
                    className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-mono text-gray-600 dark:text-slate-300 font-bold border border-gray-200 dark:border-slate-700 cursor-pointer"
                  >
                    +{x}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Validation Ceremony Banner */}
          <AnimatePresence>
            {hasSucceeded && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-2xl flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-305 flex items-center gap-1.5">
                    <span>Structure d'Or Réussie !</span>
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                    Félicitations ! Vous avez validé tous les critères d'implantation pour '{currentChallenge.title}'. Aucun élément parasite n'a dégradé la sémantique.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right panel: Validation Checklists & Real-time Tree Visualizer / Preview */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-gray-150 dark:border-slate-800 shadow-2xs overflow-hidden">
            {/* Horizontal sub-tabs for checking and viewing */}
            <div className="flex border-b border-gray-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1">
              <button
                onClick={() => { setActiveSubTab("checks"); playSound("ding"); }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSubTab === "checks"
                    ? "bg-white dark:bg-slate-850 text-purple-700 dark:text-purple-400 shadow-3xs"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-900"
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Critères ({rulesStatus.filter(r => r.passed).length}/{currentChallenge.rules.length})</span>
              </button>
              <button
                onClick={() => { setActiveSubTab("tree"); playSound("ding"); }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSubTab === "tree"
                    ? "bg-white dark:bg-slate-850 text-purple-700 dark:text-purple-400 shadow-3xs"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-900"
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Arbre DOM</span>
              </button>
              <button
                onClick={() => { setActiveSubTab("preview"); playSound("ding"); }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeSubTab === "preview"
                    ? "bg-white dark:bg-slate-850 text-purple-700 dark:text-purple-400 shadow-3xs"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu</span>
              </button>
            </div>

            <div className="p-4" style={{ minHeight: "330px", maxHeight: "450px", overflowY: "auto" }}>
              
              {/* SUB TAB 1: Evaluation rules with scores */}
              {activeSubTab === "checks" && (
                <div className="space-y-4">
                  {/* Circular visual progress score */}
                  <div className="bg-slate-50 dark:bg-slate-905 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-app-muted block tracking-wider">Conformité Globale</span>
                      <span className="text-xl font-black text-gray-901 dark:text-white font-mono">{currentScore}%</span>
                    </div>
                    
                    <div className="h-2 w-28 bg-gray-150 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          currentScore === 100 
                            ? "bg-emerald-500" 
                            : currentScore > 50 
                            ? "bg-purple-650 animate-pulse" 
                            : "bg-red-500"
                        }`}
                        style={{ width: `${currentScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {currentChallenge.rules.map((rule) => {
                      const status = rulesStatus.find(s => s.id === rule.id);
                      const isPassed = status ? status.passed : false;
                      
                      return (
                        <div 
                          key={rule.id}
                          className={`flex items-start gap-2 text-xs font-medium p-2.5 rounded-lg border transition-all ${
                            isPassed 
                              ? "bg-emerald-55/30 dark:bg-emerald-950/10 border-emerald-150 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                              : "bg-slate-50 dark:bg-slate-900/40 border-slate-150 dark:border-slate-800 text-slate-700 dark:text-slate-400"
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <HelpCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`${isPassed ? "line-through opacity-75 font-semibold" : "font-extrabold"}`}>
                            {rule.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SUB TAB 2: Semantic tree representation */}
              {activeSubTab === "tree" && (
                <div className="space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted block">Hiérarchie imbriquée calculée :</span>
                  
                  {parsedTree.length === 0 ? (
                    <div className="text-center py-10 text-xs italic text-app-muted block font-semibold">
                      Aucune balise sémantique détectée au premier niveau.
                    </div>
                  ) : (
                    <div className="space-y-1 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-150 dark:border-slate-800/60 max-h-[380px] overflow-auto">
                      {parsedTree.map(node => renderTreeNode(node))}
                    </div>
                  )}
                </div>
              )}

              {/* SUB TAB 3: Visual responsive outline container mockup mapping */}
              {activeSubTab === "preview" && (
                <div className="space-y-3">
                  <div className="flex bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-900/50 items-start gap-1.5">
                    <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold leading-normal">
                      Cette boîte à outils simule l'affiche de vos conteneurs physiques pour examiner la distribution de vos balises sémantiques.
                    </span>
                  </div>

                  {parsedTree.length === 0 ? (
                    <div className="text-center py-14 text-xs italic text-app-muted block font-semibold">
                      Saisissez des balises pour faire apparaitre la structure filaire physique.
                    </div>
                  ) : (
                    <div className="space-y-1.5 p-2 bg-slate-950 rounded-xl border border-slate-850 max-h-[380px] overflow-auto">
                      {parsedTree.map(node => renderInteractiveBlockMock(node))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
