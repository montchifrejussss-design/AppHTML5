import { SemanticTag } from "./types";

export const JS_CONCEPTS_LIST: SemanticTag[] = [
  {
    name: "const & let",
    category: "structure",
    description: "Déclaration moderne de variables à portée de bloc.",
    usage: "Utilisez 'const' pour les valeurs qui ne seront jamais réassignées, et 'let' pour les variables de boucles ou accumulateurs.",
    donts: "Bannissez 'var' du JavaScript moderne car il ne respecte pas la portée de bloc et s'expose au hoisting invisible de variables.",
    codeSnippet: `const maxScore = 100;
let currentScore = 0;
currentScore += 10;`
  },
  {
    name: "Promises & Async/Await",
    category: "interactive",
    description: "Modèle de programmation asynchrone pour gérer des requêtes de serveurs ou des tâches complexes.",
    usage: "Privilégiez la syntaxe 'async/await' plus lisible que d'enchaîner indéfiniment des callbacks '.then()'.",
    donts: "N'oubliez jamais d'englober vos appels asynchrones dans un bloc try/catch pour éviter les exceptions non capturées.",
    codeSnippet: `async function loadData() {
  try {
    const res = await fetch("https://api.example.com/data");
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Échec du chargement :", error);
  }
}`
  },
  {
    name: "Template Literals",
    category: "content",
    description: "Génération de chaînes de caractères complexes avec interpolation de variables via les accents graves (backticks).",
    usage: "Idéal pour écrire du HTML multiligne ou pour injecter dynamiquement des variables dans du texte.",
    donts: "Arrêtez d'utiliser la concaténation par le signe '+' (ex: 'bonjour ' + name), qui est lourde et propice aux fautes de frappe.",
    codeSnippet: `const username = "Sarah";
const role = "Admin";
const message = \`Profil de \${username} :
- Rôle : \${role}
- Statut : Connecté\`;`
  },
  {
    name: "Arrow Functions (=>)",
    category: "structure",
    description: "Syntaxe de fonction raccourcie ne liant pas son propre contexte 'this'.",
    usage: "Idéal pour écrire des callbacks compactes et conserver le 'this' du contexte parent sans appeler .bind(this).",
    donts: "N'utilisez pas de fonction fléchée pour déclarer des méthodes d'objets littéraux si vous avez besoin d'accéder au contexte propre de cet objet.",
    codeSnippet: `const double = (n) => n * 2;
const users = [{id: 1, active: true}];
const activeUsers = users.filter(user => user.active);`
  },
  {
    name: "Destructuring (Destructuration)",
    category: "structure",
    description: "Extraction compacte de propriétés d'objets ou d'éléments de tableaux directement dans des variables.",
    usage: "Très lisible pour récupérer en une seule ligne plusieurs attributs d'une réponse API complexe.",
    donts: "N'essayez pas de destructurer une valeur nulle ('null') ou 'undefined', sous peine d'obtenir une erreur de type immédiate.",
    codeSnippet: `const user = { name: "Marc", age: 30, email: "m@ex.com" };
const { name, email } = user; // Extraction directe

const [first, second] = ["pomme", "banane", "orange"];`
  },
  {
    name: "Spread Operator (...)",
    category: "inline",
    description: "Opérateur de décomposition permettant d'étaler les éléments d'un tableau ou d'un objet.",
    usage: "Pratique pour fusionner ou cloner superficiellement des données existantes sans toucher aux originaux (concept d'immutabilité).",
    donts: "N'oubliez pas qu'il s'agit d'un clonage superficiel (shallow copy). Les objets imbriqués gardent toujours la même référence.",
    codeSnippet: `const defaultSettings = { theme: "light", volume: 50 };
const userSettings = { volume: 80 };

const finalConfig = { ...defaultSettings, ...userSettings }; // fusion`
  },
  {
    name: "Rest Parameters (...)",
    category: "structure",
    description: "Capture un nombre indéfini d'arguments passés à une fonction sous la forme d'un tableau ordonné.",
    usage: "Parfait pour concevoir des utilitaires de calcul, d'agrégation ou de mise en forme acceptant une liste flexible de valeurs.",
    donts: "L'argument du paramètre 'rest' doit impérativement se situer en dernière position dans la liste des arguments de la fonction.",
    codeSnippet: `function sumAll(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
const total = sumAll(5, 10, 15, 20); // Retourne 50`
  },
  {
    name: "Array.prototype.map()",
    category: "content",
    description: "Crée un nouveau tableau contenant les résultats de l'appel d'une fonction fournie sur chaque élément.",
    usage: "Principal moyen en React ou JS vanille pour transformer une collection d'objets bruts en éléments visuels.",
    donts: "N'utilisez pas '.map()' si vous ne retournez rien et souhaitez simplement appliquer une instruction. Préférez '.forEach()'.",
    codeSnippet: `const numbers = [1, 2, 3];
const squares = numbers.map(x => x * x); // [1, 4, 9]`
  },
  {
    name: "Array.prototype.filter()",
    category: "content",
    description: "Génère un nouveau tableau filtré ne retenant que les éléments validant une condition de test booléenne.",
    usage: "Idéal pour implémenter des moteurs de recherche internes, des tris par catégories ou des suppressions de paniers d'achat.",
    donts: "Ne modifiez pas directement les éléments originaux pendant le filtrage; gardez l'opération pure.",
    codeSnippet: `const products = [
  { name: "PC", price: 800 },
  { name: "Souris", price: 20 }
];
const cheapProducts = products.filter(p => p.price < 50);`
  },
  {
    name: "Array.prototype.reduce()",
    category: "content",
    description: "Applique une fonction accumulatrice sur chaque élément du tableau pour réduire l'ensemble à une seule valeur unique.",
    usage: "Sert à calculer des paniers d'achat totaux (prix cumulés), à grouper des listes, ou à construire un dictionnaire d'indexation.",
    donts: "N'omettez pas de renseigner la valeur initiale de l'accumulateur (deuxième argument d'entrée), pour éviter des erreurs inattendues.",
    codeSnippet: `const cart = [{ price: 10 }, { price: 25 }, { price: 5 }];
const total = cart.reduce((temp, item) => temp + item.price, 0); // 40`
  },
  {
    name: "Array.prototype.forEach()",
    category: "content",
    description: "Exécute une fonction donnée sur chaque élément individuel d'un tableau.",
    usage: "Idéal pour appliquer des actions à effets de bord (ex: enregistrer des événements analytiques, ou manipuler manuellement des nœuds DOM).",
    donts: "Contrairement aux boucles classiques, vous ne pouvez pas stopper (break) ou ignorer (continue) l'itération d'un forEach.",
    codeSnippet: `const logs = ["Succès identification", "Alerte espace disque"];
logs.forEach((log, index) => {
  console.log(\`[\${index}] : \${log}\`);
});`
  },
  {
    name: "Array.prototype.find()",
    category: "content",
    description: "Renvoie le premier élément trouvé du tableau remplissant la condition de test logique formulée.",
    usage: "Indispensable pour récupérer instantanément un objet unique ou l'utilisateur d'une fiche à partir de son numéro d'identifiant unique.",
    donts: "Sachez que s'il y a plusieurs éléments répondant à la condition, seul le tout premier est extrait de la liste.",
    codeSnippet: `const users = [
  { id: "A", name: "Alice" },
  { id: "B", name: "Bob" }
];
const bob = users.find(u => u.id === "B"); // { id: "B", name: "Bob" }`
  },
  {
    name: "Array.prototype.some() & every()",
    category: "inline",
    description: "Méthodes de validation vérifiant si au moins un d'entre eux (some) ou l'ensemble des éléments (every) répond à un test.",
    usage: "Idéal pour s'assurer que tous les champs obligatoires du formulaire sont remplis avant la soumission.",
    donts: "Ces fonctions s'arrêtent dès que le résultat logique est scellé (court-circuit logique). Ne placez pas d'effets secondaires critiques à l'intérieur.",
    codeSnippet: `const files = [
  { name: "calc.exe", safe: true },
  { name: "virus.bat", safe: false }
];
const hasInfection = files.some(f => !f.safe); // true
const allSafe = files.every(f => f.safe); // false`
  },
  {
    name: "Array.prototype.includes()",
    category: "inline",
    description: "Vérifie si un tableau ou une chaîne de caractères contient un élément de recherche spécifique.",
    usage: "Rend les vérifications de listes de rôles autorisés ou d'extensions de fichiers extrêmement lisibles.",
    donts: "Attention, 'includes' utilise une comparaison de valeur stricte, ce qui n'est pas adapté pour rechercher des correspondances partielles d'objets complexes.",
    codeSnippet: `const roles = ["admin", "editor", "guest"];
const isAllowed = roles.includes("admin"); // true`
  },
  {
    name: "Object Keys / Values / Entries",
    category: "content",
    description: "Renvoie des listes ordonnées des clés (keys), des valeurs (values) ou des tuples complets [clé, valeur] (entries) d'un objet.",
    usage: "Sert à convertir de grandes fiches d'options configurées sous forme d'objets pour pouvoir les lister dynamiquement.",
    donts: "N'oubliez pas que l'ordre des clés d'un objet n'est pas garanti par le langage; fiez-vous aux tableaux générés.",
    codeSnippet: `const stats = { jv: 12, python: 34 };
const keys = Object.keys(stats);     // ["jv", "python"]
const entries = Object.entries(stats); // [["jv", 12], ["python", 34]]`
  },
  {
    name: "Optional Chaining (?.)",
    category: "inline",
    description: "Opérateur sécurisé interdisant l'arrêt brutal du programme en cas de lecture d'une propriété imbriquée manquante.",
    usage: "Idéal lors de manipulations de données asynchrones provenant d'API distantes dont la structure peut être incomplète.",
    donts: "N'en mettez pas de partout par paresse ! Les erreurs de types sont de précieux indicateurs de dysfonctionnement d'API.",
    codeSnippet: `const user = { profile: { address: null } };
const zipCode = user?.profile?.address?.zip; // undefined au lieu de crasher`
  },
  {
    name: "Nullish Coalescing (??)",
    category: "inline",
    description: "Opérateur de substitution renvoyant l'expression de droite uniquement lorsque la valeur de gauche est 'null' ou 'undefined'.",
    usage: "Parfait pour définir des paramètres par défaut en retenant le nombre '0' ou la chaîne vide '' comme valeurs valides.",
    donts: "Ne pas confondre avec l'opérateur logique OU '||' qui remplace aussi le nombre '0' ou la valeur booléenne 'false' !",
    codeSnippet: `const configSpeed = 0;
const speed = configSpeed ?? 100; // 0 (car 0 n'est pas nul)
const speedLegacy = configSpeed || 100; // 100 (car 0 est 'falsy')`
  },
  {
    name: "LocalStorage",
    category: "interactive",
    description: "Espace de stockage de données local persistant dans le navigateur de l'utilisateur, conservé après fermeture de l'onglet.",
    usage: "Idéal pour sauvegarder les thèmes d'affichage choisis, les listes de tâches hors-ligne ou les paniers locaux de visite.",
    donts: "N'y stockez aucun jeton d'accès secret ou données médicales sensibles, car cet espace reste accessible via des scripts de piratage XSS.",
    codeSnippet: `// Sauvegarde
localStorage.setItem("userTheme", "dark");
// Lecture
const savedTheme = localStorage.getItem("userTheme");`
  },
  {
    name: "SessionStorage",
    category: "interactive",
    description: "Espace de stockage temporaire conservé uniquement pendant la durée d'ouverture de l'onglet d'actualité.",
    usage: "Idéal pour mémoriser l'avancée d'un questionnaire d'évaluation fastidieux sans polluer la vie utilisateur de façon persistante.",
    donts: "N'y faites pas confiance pour de la sauvegarde pérenne de données clients, car dès la fermeture du navigateur, l'espace est vidé.",
    codeSnippet: `sessionStorage.setItem("temp_step", "3");
const currentStep = sessionStorage.getItem("temp_step");`
  },
  {
    name: "document.querySelector",
    category: "interactive",
    description: "Sélectionne le premier élément du DOM validant la règle de sélection CSS fournie.",
    usage: "Méthode moderne universelle unifiant les anciennes sélections par classe, tag, ou ID.",
    donts: "Rappelez-vous qu'elle ne retourne qu'UN seul élément. Si vous ciblez une liste complète, utilisez querySelectorAll.",
    codeSnippet: `const heading = document.querySelector("#main-title");
const activeTab = document.querySelector(".tab-item.active");`
  },
  {
    name: "addEventListener",
    category: "interactive",
    description: "Enregistre une fonction callback à déclencher dès qu'un événement matériel précis (clic, touche, scroll) survient.",
    usage: "La base absolue de l'interactivité dynamique d'application web.",
    donts: "N'oubliez pas de nettoyer (removeEventListener) vos écouteurs d'événements dans vos composants React ou SPA pour éviter des fuites de mémoire.",
    codeSnippet: `const btn = document.querySelector(".btn-submit");
const handleAction = () => console.log("Clic !");
btn.addEventListener("click", handleAction);`
  },
  {
    name: "classList (add, remove, toggle)",
    category: "interactive",
    description: "API de manipulation sécurisée des classes d'éléments HTML sans écraser d'autres styles existants.",
    usage: "Idéal pour activer des transitions visuelles de déplis, faire briller une carte active, ou colorer des messages d'erreur.",
    donts: "N'utilisez plus la commande lourde .className = 'active' car elle détruit instantanément l'entièreté des autres classes existantes.",
    codeSnippet: `const alertBox = document.querySelector(".alert");
alertBox.classList.add("visible");
alertBox.classList.toggle("dark-mode-card");`
  },
  {
    name: "ES Modules (import/export)",
    category: "structure",
    description: "Système de modularité officiel normalisant le partage réutilisable de morceaux de code entre fichiers.",
    usage: "Permet de découper de gigantesques blocs de codes en composants et bibliothèques propres et exportables.",
    donts: "N'importez pas l'ensemble de fonctions inutilisées pour s'assurer de préserver l'efficacité du Tree-Shaking au build.",
    codeSnippet: `// Dans mathUtils.js
export const add = (x, y) => x + y;

// Dans App.js
import { add } from "./mathUtils.js";`
  },
  {
    name: "Classes (ES6)",
    category: "structure",
    description: "Sucre syntaxique structurant la programmation orientée objet (POO) à l'aide de prototypes.",
    usage: "Idéal pour structurer de solides architectures de services, de modélisations de jeux vidéo ou d'entités métiers claires.",
    donts: "Bannissez les structures à base de fonctions de constructeurs à l'ancienne munis de prototypes déclarés manuellement.",
    codeSnippet: `class User {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return \`Bonjour \${this.name}\`;
  }
}`
  },
  {
    name: "this Keyword",
    category: "structure",
    description: "Variable spéciale faisant référence à l'instance de l'objet en cours d'exécution.",
    usage: "Permet d'accéder aux propriétés et attributs matériels à l'intérieur de classes de traitement.",
    donts: "Faites attention lorsque vous passez une méthode de classe en callback à un autre système car 'this' perd fréquemment son contexte.",
    codeSnippet: `const controller = {
  id: "45x",
  print() {
    console.log(this.id);
  }
};
controller.print(); // Reste lié au controller`
  },
  {
    name: "Closures (Fermetures)",
    category: "structure",
    description: "Capacité d'une fonction d'accéder et de retenir des variables créées dans sa portée lexicale d'origine, même après son exécution.",
    usage: "Indispensable pour créer de véritables variables privées sécurisées et inaccessibles directement depuis l'extérieur.",
    donts: "Prenez garde à ne pas retenir de manière démesurée de volumineuses variables dans des closures, car cela bloque leur libération de la RAM.",
    codeSnippet: `function createCounter() {
  let count = 0; // Privé
  return () => ++count;
}
const next = createCounter();
next(); // 1
next(); // 2`
  },
  {
    name: "Immediately Invoked Functions (IIFE)",
    category: "structure",
    description: "Fonction JavaScript s'exécutant immédiatement dès sa définition.",
    usage: "Idéal pour initialiser de manière isolée un script tiers sans déclarer d'encombrantes variables globales sur l'objet 'window'.",
    donts: "Beaucoup moins indispensable aujourd'hui avec l'essor natif des modules ES qui isolent structurellement leurs fichiers de base.",
    codeSnippet: `(() => {
  const initKey = "INIT_SECURE_TOKEN_55";
  console.log("Démarrage du système avec clé :", initKey);
})();`
  },
  {
    name: "typeof & instanceof",
    category: "structure",
    description: "Opérateurs déterminant le type primitif de données (typeof) ou la nature de classe d'une instance (instanceof).",
    usage: "Parfait pour valider la nature des données utilisateurs avant d'initier de lourds calculs de conversion ou de tri.",
    donts: "Faites très attention à 'typeof null' qui retourne historiquement l'objet indésirable 'object' !",
    codeSnippet: `typeof "bonjour"; // "string"
typeof 42;        // "number"
const error = new Error();
error instanceof Error; // true`
  },
  {
    name: "Strict Equality (===)",
    category: "inline",
    description: "Opérateur de comparaison absolue validant à la fois l'égalité géométrique de la valeur ET de son type.",
    usage: "Le seul standard de comparaison moderne fiable pour concevoir des applications web sans bugs logiques dissimulés.",
    donts: "Proscrivez formellement l'utilisation du double égal '==' qui tente des conversions implicites farfelues ('1' == 1 est vrai).",
    codeSnippet: `0 === false; // false (Types différents : number vs boolean)
0 == false;  // true (Alerte danger ! Conversion implicite)`
  },
  {
    name: "Ternary Operator (? :)",
    category: "structure",
    description: "Unique opérateur d'écriture de structure conditionnelle If/Else contractée sur une même ligne d'écriture.",
    usage: "Idéal pour injecter dynamiquement des classes CSS alternatives ou des labels courts au sein de vos composants React.",
    donts: "N'imbriquez jamais plusieurs ternaires les uns dans les autres, car cela rend l'algorithme illisible pour vos collaborateurs.",
    codeSnippet: `const age = 22;
const access = age >= 18 ? "Autorisé" : "Interdit";`
  },
  {
    name: "Map object",
    category: "structure",
    description: "Structure de dictionnaire de paires de type [clé : valeur] acceptant n'importe quel type de données en guise de clés.",
    usage: "Recommandé pour associer des objets complexes entre eux ou préserver l'ordre initial d'insertion de clés.",
    donts: "Ne tentez pas d'instancier un 'Map' si un dictionnaire d'identités textuelles simple en objet littéral {} suffit amplement.",
    codeSnippet: `const settings = new Map();
const userKey = { id: 10 };
settings.set(userKey, "Niveau 3");
console.log(settings.get(userKey)); // "Niveau 3"`
  },
  {
    name: "Set object",
    category: "structure",
    description: "Structure de données assurant l'enregistrement de valeurs uniques et excluant de fait tout doublon.",
    usage: "L'astuce suprême la plus performante pour éliminer en une ligne les valeurs dupliquées d'un volumineux tableau.",
    donts: "N'oubliez pas que l'accès aux éléments d'un Set s'effectue via .has(), car il n'existe pas d'index numérique de type [index].",
    codeSnippet: `const ids = [1, 2, 2, 3, 1];
const uniqueIds = [...new Set(ids)]; // [1, 2, 3]`
  },
  {
    name: "JSON Serialization (parse & stringify)",
    category: "content",
    description: "Convertit des objets en chaînes textuelles standardisées (stringify) et inversement (parse) pour les échanges.",
    usage: "Indispensable pour de la communication API, ou pour sauvegarder des structures d'objets ou tableaux dans localStorage.",
    donts: "Un appel à JSON.parse() sur une chaîne mal formée fera instantanément planter l'application. Protégez-vous avec try/catch.",
    codeSnippet: `const raw = JSON.stringify({ active: true });
const parsed = JSON.parse(raw); // { active: true }`
  },
  {
    name: "setTimeout & setInterval",
    category: "interactive",
    description: "Méthodes programmatiques d'ordonnancement temporel différé (setTimeout) ou répétitif régulier (setInterval).",
    usage: "Très utile pour retarder de petites animations ou interroger périodiquement un service d'état de serveurs distants.",
    donts: "N'oubliez pas de stocker l'identifiant numérique retourné pour pouvoir l'effacer (clearTimeout/clearInterval) en fin de cycle.",
    codeSnippet: `const id = setTimeout(() => {
  console.log("Exécuté après 2 secondes");
}, 2000);
clearTimeout(id); // Annule l'échéance`
  },
  {
    name: "Error Handling (try...catch)",
    category: "interactive",
    description: "Mécanisme d'interception d'échecs logiciels, évitant l'arrêt total d'un script en exécution.",
    usage: "Indispensable pour encadrer les connexions externes de fichiers, les requêtes d'historiques, ou les parsages de données complexes.",
    donts: "Ne laissez jamais un bloc catch vide ('silencing errors') sous peine de masquer des bugs profonds aux yeux de l'équipe de développement.",
    codeSnippet: `try {
  const result = JSON.parse("{ malformed json }");
} catch (error) {
  console.warn("Échec d'analyse de données système :", error.message);
}`
  },
  {
    name: "Event Bubbling & Capturing",
    category: "interactive",
    description: "Le flux de propagation des événements à travers la hiérarchie d'arborescence des balises (DOM).",
    usage: "Permet de comprendre comment un clic sur un bouton remonte au parent, utilisable via e.stopPropagation() pour isoler un clic.",
    donts: "Ne pas en paralyser continuellement la propagation sauf si un chevauchement d'événements de clic est réellement problématique.",
    codeSnippet: `button.addEventListener("click", (e) => {
  e.stopPropagation(); // Évite de propager le clic au panneau parent
});`
  },
  {
    name: "Event Delegation (Délégation)",
    category: "interactive",
    description: "Technique d'optimisation consistant à attacher un unique écouteur de clics au parent plutôt qu'un à chaque enfant d'une grande liste.",
    usage: "Idéal pour dynamiser une grille infinie de cartes sans générer des centaines de capteurs, préservant la mémoire de l'écran.",
    donts: "N'oubliez pas de filtrer la cible d'origine (e.target) avec .closest() pour identifier correctement le bouton visé.",
    codeSnippet: `const list = document.querySelector(".list-parent");
list.addEventListener("click", (e) => {
  const card = e.target.closest(".card-item");
  if (card) {
    console.log("Carte visitée :", card.id);
  }
});`
  },
  {
    name: "Debounce (Anti-rebond)",
    category: "interactive",
    description: "Retarde le traitement d'une fonction tant qu'un temps Mort n'est pas observé de manière ininterrompue.",
    usage: "Idéal sur une jauge de recherche pour interdire d'interroger la base de données à chaque lettre tapée, attendant la pause de frappe.",
    donts: "N'écrivez pas de traitement instantané sur des entrées utilisateur de type 'onKeyPress' sans y flanquer un debounce.",
    codeSnippet: `function debounce(func, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}`
  },
  {
    name: "Throttle (Limitateur de débit)",
    category: "interactive",
    description: "Garantit qu'une fonction n'est exécutée au maximum qu'une seule fois sur un intervalle de temps configuré.",
    usage: "Indispensable pour soulager les performances d'interfaces surveillant de près l'événement de défilement (onScroll) ou de redimensionnement.",
    donts: "Ne confondez pas avec le debounce; le throttle exécutera l'action régulièrement durant l'action de scroll.",
    codeSnippet: `function throttle(func, limit = 200) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`
  },
  {
    name: "Shallow vs Deep Copy",
    category: "structure",
    description: "Clonage de premier niveau (Shallow) vis-à-vis d'une copie en profondeur (Deep Copy) préservant l'autonomie des objets.",
    usage: "Appelez structuredClone() pour cloner à coup sûr vos structures de jeux ou configurations imbriquées sans les relier aux ancêtres.",
    donts: "N'utilisez pas de clonage JSON simple 'JSON.parse(JSON.stringify(obj))' sur des objets complexes contenant des fonctions ou dates.",
    codeSnippet: `const original = { task: "Apprendre", meta: { rank: 1 } };
const shallow = { ...original }; // meta.rank reste lié !
const deepCopy = structuredClone(original); // Autonomie absolue`
  },
  {
    name: "Truthy & Falsy",
    category: "inline",
    description: "Valeurs implicitement évaluées comme vraies ou fausses dans l'ossature d'une phrase de logique booléenne.",
    usage: "Permet d'écrire des raccourcis efficaces : if (userList.length) pour tester si un tableau n'est pas vide.",
    donts: "Sachez précisément que : 0, '', null, undefined, NaN et false sont tous évalués comme fausses (falsy) !",
    codeSnippet: `const name = "";
if (!name) {
  console.log("Renseignez un nom de compte d'utilisateur.");
}`
  },
  {
    name: "Hoisting (Levage)",
    category: "structure",
    description: "Comportement natif déportant idéalement la définition d'une fonction ou variable au sommet de son fichier d'interprétation.",
    usage: "Permet d'ordonner et d'appeler de robustes fonctions utilitaires avant leur ligne d'écriture physique.",
    donts: "Sachez que les variables déclarées avec let et const sont soumises à la zone morte temporelle (TDZ) et ne peuvent être lues avant d'être écrites.",
    codeSnippet: `isEven(4); // Fonctionne de fait grâce au hoisting !

function isEven(n) {
  return n % 2 === 0;
}`
  },
  {
    name: "Strict Mode",
    category: "structure",
    description: "Verrouille des contraintes d'écritures de programmation éliminant les comportements passifs dangereux.",
    usage: "Ajoutez la directive 'use strict' pour que toute erreur silencieuse inaperçue devienne un avertissement explicite dans la console.",
    donts: "Automatique si vous œuvrez sous modules ES, pas besoin de le forcer manuellement dans vos fichiers React.",
    codeSnippet: `"use strict";
x = 3.14; // Erreur ! Impossible de déclarer x sans le mot-clé let/const/var`
  },
  {
    name: "Default Parameters",
    category: "structure",
    description: "Permet de renseigner des paramètres de substitution automatique si une fonction est appelée de façon incomplète.",
    usage: "Simplifie le corps d'écriture de fonctions en évitant d'antiques et répétitifs if-else de secours.",
    donts: "Renseignez les arguments dotés de valeurs de secours à la fin, après ceux obligatoirement réclamés.",
    codeSnippet: `function buildUser(id, active = true, role = "Membre") {
  return { id, active, role };
}`
  },
  {
    name: "Generators (function*)",
    category: "structure",
    description: "Fonction spéciale pouvant suspendre temporairement sa progression pour de la génération séquentielle de flux.",
    usage: "Permet de concevoir d'historiques générateurs de flux de tâches infinis ou de processus échelonnés.",
    donts: "N'abusez pas des générateurs à la place de promesses ou de tableaux simples, car leur conceptualisation est avancée.",
    codeSnippet: `function* numberGenerator() {
  yield 1;
  yield 2;
  return 3;
}
const iterator = numberGenerator();
console.log(iterator.next().value); // 1`
  },
  {
    name: "Symbols",
    category: "inline",
    description: "Type de donnée primitif garantissant l'accès à un identifiant unique immuable.",
    usage: "Idéal pour encoder des propriétés privées ou des clés d'identification d'objets impossibles à écraser accidentellement.",
    donts: "Sachez que les symboles ne sont pas énumérés par les boucles d'itération 'for...in' classiques.",
    codeSnippet: `const secureID = Symbol("id");
const record = {};
record[secureID] = "ACC-99";`
  },
  {
    name: "Dynamic Imports",
    category: "structure",
    description: "Mécanique d'importation de fichiers à la demande uniquement au cours de l'expérience d'utilisation.",
    usage: "La base absolue du 'code-splitting' moderne diminuant de moitié le poids du fichier initial au chargement de l'application.",
    donts: "Ne l'utilisez pas pour de simples petites fonctions d'écritures légères.",
    codeSnippet: `async function onOpenChart() {
  const { drawBigComplexChart } = await import("./charts.js");
  drawBigComplexChart();
}`
  },
  {
    name: "Custom Events",
    category: "interactive",
    description: "API de création de signaux de communications synchrones personnalisés exploitant les tunnels natifs du DOM.",
    usage: "Très commode pour notifier l'ensemble de composants d'une barre latérale d'un changement de configuration globale.",
    donts: "Privilégiez les systèmes de store ou d'états dans React plutôt que les Custom Events du DOM afin de préserver la lisibilité du flux de données.",
    codeSnippet: `const myEvent = new CustomEvent("themeChange", { detail: "cyber" });
document.dispatchEvent(myEvent);`
  },
  {
    name: "Intersection Observer",
    category: "interactive",
    description: "API asynchrone surveillant le degré de visibilité d'un conteneur à l'intérieur de la fenêtre active de lecture de l'utilisateur.",
    usage: "La méthode ultime haute performance pour charger à la volée vos images (lazy loading) ou déclencher de délicats effets d'entrées.",
    donts: "N'oubliez pas d'appeler .unobserve() ou de déconnecter l'observateur une fois que l'animation est entrée à l'écran.",
    codeSnippet: `const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in-visible");
    }
  });
});
observer.observe(targetElement);`
  },
  {
    name: "Resize Observer",
    category: "interactive",
    description: "API surveillant en continu de véritables variations dimensionnelles physiques d'un conteneur.",
    usage: "Indispensable pour concevoir des composants de graphiques à dimensions de hauteurs interactives et élastiques.",
    donts: "Ne pas y poser d'instructions de mutations déclenchant des boucles de redimensionnement infinies.",
    codeSnippet: `const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(\`Taille actuelle : \${width}x\${height}\`);
  }
});
resizeObserver.observe(container);`
  },
  {
    name: "Mutation Observer",
    category: "interactive",
    description: "API à l'écoute de modifications structurelles directes apportées au cœur du code HTML du DOM.",
    usage: "Très utilisé pour surveiller l'apport de scripts externes de traducteurs ou d'options d'extensions.",
    donts: "Utiliser avec parcimonie pour éviter d'importants impacts d'écritures de performances.",
    codeSnippet: `const observer = new MutationObserver((mutations) => {
  console.log("Arborescence ou attributs du DOM modifiés !", mutations);
});
observer.observe(node, { childList: true, subtree: true });`
  },
  {
    name: "URLSearchParams",
    category: "inline",
    description: "API simplifiant le parsage de requêtes d'options issues de l'URL du navigateur.",
    usage: "Idéal pour identifier des codes de remises ou des filtres de catégories d'un e-commerce partagés via un lien d'adresse.",
    donts: "Ne l'implémentez pas de façon manuelle via des découpes répétitives de chaînes de caractères au split('&').",
    codeSnippet: `const queryParams = new URLSearchParams(window.location.search);
const activePage = queryParams.get("page") ?? "1";`
  },
  {
    name: "Navigator Clipboard API",
    category: "interactive",
    description: "API asynchrone sécurisée permettant d'inscrire ou lire des chaînes depuis le presse-papier matériel.",
    usage: "Rend l'expérience d'utilisation incroyable en intégrant de petits boutons de copies de codes en un clic.",
    donts: "Ne fonctionnera pas si la page courante n'est pas desservie sous protocole sécurisé HTTPS ou local de développement.",
    codeSnippet: `async function copyToken(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copié avec succès !");
  } catch (err) {
    console.error("Échec copie :", err);
  }
}`
  },
  {
    name: "Proxy API",
    category: "structure",
    description: "Permet de concevoir un garde-corps d'interception d'accès et d'écritures de propriétés sur vos objets.",
    usage: "Idéal pour bâtir de robustes systèmes de réactivités d'états ('state managers') ou valider des contraintes de propriétés.",
    donts: "Ajoute une surcouche de traitement invisible; n'appliquez que sur des objets cruciaux d'architecture d'application.",
    codeSnippet: `const data = { age: 20 };
const proxy = new Proxy(data, {
  set(target, prop, value) {
    if (prop === "age" && value < 0) throw new Error("Âge invalide !");
    target[prop] = value;
    return true;
  }
});`
  },
  {
    name: "Reflect API",
    category: "structure",
    description: "Fournit des méthodes d'écritures unifiées pour ordonner des manipulations d'objets, doublant les Proxy.",
    usage: "Unifie l'accès à de vieilles fonctions du langage comme Reflect.has(obj, key) ou Reflect.ownKeys().",
    donts: "N'a presque d'intérêt que combiné au développement de Proxy.",
    codeSnippet: `const user = { name: "Tom" };
Reflect.has(user, "name"); // true
Reflect.set(user, "age", 25);`
  },
  {
    name: "Web Workers",
    category: "interactive",
    description: "Permet d'exécuter des traitements de calculs complexes sur des threads d'arrière-plan sans figer l'affichage principal.",
    usage: "Idéal pour traiter de volumineuses images, générer des exports PDF ou chiffrer d'importants historiques en local.",
    donts: "Un Web Worker ne possède aucun accès direct aux balises visuelles du DOM principal de la page.",
    codeSnippet: `// instantation
const myWorker = new Worker("worker-calculations.js");
myWorker.postMessage([10000000, 20000000]);
myWorker.onmessage = (e) => console.log("Travail abattu :", e.data);`
  },
  {
    name: "History API",
    category: "interactive",
    description: "API de manipulation de l'historique et de l'url active du navigateur sans forcer le rafraîchissement d'une page.",
    usage: "Le cœur technique permettant de concevoir les routeurs d'applications de type SPA.",
    donts: "Ne l'appelez pas sans fournir d'état pour éviter de fausser le bouton 'Précédent' de l'utilisateur.",
    codeSnippet: `history.pushState({ page: 2 }, "Titre", "/explorer");`
  },
  {
    name: "Geolocation API",
    category: "interactive",
    description: "Permet d'obtenir des données de géolocalisation géographique si l'utilisateur consent au partage.",
    usage: "Utile pour suggérer des agences de livraison ou de commerces à proximité immédiates visibles de l'utilisateur.",
    donts: "Le navigateur exige obligatoirement une validation d'accord d'accès utilisateur; prévoyez un scénario de secours désactivé.",
    codeSnippet: `navigator.geolocation.getCurrentPosition(
  (position) => console.log("Coordonnées :", position.coords.latitude),
  (error) => console.warn("Refus d'accès :", error.message)
);`
  },
  {
    name: "Math Methods (random, floor, ceil)",
    category: "inline",
    description: "API de calculs d'arrondis mathématiques et de tirages numériques aléatoires.",
    usage: "Utilisez-les pour simuler des lancers de dés virtuels, distribuer des jetons de chances ou arrondir des facturations complexes.",
    donts: "Math.random() n'est pas adapté pour concevoir de la cryptographie sécurisée ou des jetons secrets sécurisés (utilisez crypto.getRandomValues).",
    codeSnippet: `const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const score = Math.round(4.56); // 5`
  },
  {
    name: "String Methods (replace, split, trim)",
    category: "inline",
    description: "Ensemble d'outils de nettoyage, de découpage et de reformatage de chaînes textuelles.",
    usage: "Appelez toujours trim() lors de la saisie d'un email système utilisateur afin d'effacer les espaces de début et fin accidentels.",
    donts: "La méthode replace() par défaut ne remplace que la TOUTE première occurrence d'un mot; préférez replaceAll() !",
    codeSnippet: `const rawMail = "  contact@gmail.com  ";
const cleanMail = rawMail.trim(); // "contact@gmail.com"
const csv = "pomme,poire".split(","); // ["pomme", "poire"]`
  },
  {
    name: "Regular Expressions (RegEx)",
    category: "inline",
    description: "Moteur de détection de motifs structurels de chaînes de caractères complexes.",
    usage: "Indispensable pour valider le respect strict des critères de sécurité requis pour la saisie de mots de passe ou d'adresses e-mails.",
    donts: "N'écrivez pas de RegEx excessivement gigantesques impossibles à relire ou débugger; divisez vos vérifications.",
    codeSnippet: `const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const isValid = emailPattern.test("demo@domain.com"); // true`
  },
  {
    name: "Console Methods (table, time, warn)",
    category: "inline",
    description: "API d'ingénierie d'analyse de données intégrée directement dans le terminal de développement du navigateur.",
    usage: "Appelez console.table(monTableau) pour visualiser d'un coup vos listes de données sous forme de magnifiques tableaux structurés de données.",
    donts: "Nettoyez vos impressions de console de débuggage (comme console.log) avant d'envoyer l'application en environnement de production.",
    codeSnippet: `console.time("calcul");
// ... calculs ...
console.timeEnd("calcul"); // Affiche la durée exacte d'exécution`
  },
  {
    name: "Module Pattern",
    category: "structure",
    description: "Modèle de structuration encapsulant des variables privées d'un fichier tout en n'exposant que des actions cibles publiques.",
    usage: "Traduisez sous la forme de fichiers à fonctions ou de classes d'accès pour de grands modules de traitement isolés.",
    donts: "Ne concevez pas un module monolithique difficile à maintenir; privilégiez de petits fragments spécialisés.",
    codeSnippet: `const authService = (() => {
  let token = null; // Variable privée protégée
  return {
    login(pass) { if(pass === "123") token = "session_xyz"; },
    getToken() { return token; }
  };
})();`
  },
  {
    name: "Memory Leaks & GC",
    category: "structure",
    description: "Comprendre le comportement du Ramasse-miettes (Garbage Collector) libérant la RAM par suppression d'identités inutiles.",
    usage: "Sert à déceler des fuites de mémoire provoquées par des variables globales oubliées ou des temporisateurs non détruits.",
    donts: "N'ajoutez pas d'éléments de listes volumineux sur l'objet window global car ils ne seront jamais purgés automations de la RAM.",
    codeSnippet: `// exemple de fuite de mémoire classique :
function buildLeak() {
  leakedGlobal = new Array(100000).fill("data"); // Pas déclaré let/const !
}`
  },
  {
    name: "Currying (Curryfication)",
    category: "structure",
    description: "Technique de transformation de fonctions consistant à convertir une fonction à plusieurs paramètres en une chaîne de fonctions à un seul paramètre.",
    usage: "Idéal pour concevoir des configurations d'applications réutilisables ou préparer des calculs d'impôts par étapes.",
    donts: "N'utilisez pas de currying si la lisibilité finale des arguments s'en retrouve pour l'équipe inutilement altérée.",
    codeSnippet: `const calcTax = (rate) => (price) => price + (price * rate);
const applyVAT = calcTax(0.20);
console.log(applyVAT(10)); // 12`
  },
  {
    name: "Self-invoking Methods (Autonomie)",
    category: "structure",
    description: "Conception de structures autonomes d'initialisations d'objets ou de contrôles de flux applicatifs.",
    usage: "Permet de stabiliser des boucles d'applications ou démarrer des chargements silencieux d'arrière-plans.",
    donts: "Bannissez les fichiers d'ordres d'interactions en cascades désordonnées.",
    codeSnippet: `const engine = {
  start() { console.log("Moteur lancé..."); return this; },
  load() { console.log("Éléments importés !"); return this; }
}.start().load(); // Concept de chaînage autonome`
  },
  {
    name: "Logical Assignment OR (||=)",
    category: "inline",
    description: "Opérateur de raccourci assignant une variable uniquement si sa valeur de départ actuelle est évaluée comme 'falsy'.",
    usage: "Très commode pour attribuer rapidement des valeurs de configurations d'options textuelles manquantes.",
    donts: "Sachez que cela écrasera aussi la variable si elle contient le chiffre 0, qu'il jugera faux !",
    codeSnippet: `let userStatus = "";
userStatus ||= "Invité"; // "Invité"`
  },
  {
    name: "Logical Assignment AND (&&=)",
    category: "inline",
    description: "Opérateur de raccourci modifiant une variable uniquement si celle-ci s'avère évaluée comme vraie (truthy).",
    usage: "Permet d'appliquer de rapides conversions ou d'apporter de petites modifications d'états d'abonnements au site.",
    donts: "Peut paraître obscur pour de jeunes développeurs non habitués aux nouveautés récentes ESM.",
    codeSnippet: `let user = { authenticated: true };
user.authenticated &&= "Utilisateur identifié !";`
  },
  {
    name: "Logical Assignment Nullish (??=)",
    category: "inline",
    description: "Opérateur n'attribuant la nouvelle valeur que si la variable de départ s'avère nulle ou indéfinie.",
    usage: "C'est l'un des moyens d'écritures les plus élégants pour initialiser de manière sécurisée de précieux réglages numériques.",
    donts: "Ne requiert rien de plus. C'est l'un des derniers ajouts approuvés par les comités du W3C JS d'interprétation.",
    codeSnippet: `let maxCapacity = null;
maxCapacity ??= 500; // 500 (car la valeur de départ est nulle)`
  },
  {
    name: "BigInt",
    category: "inline",
    description: "Type primitif permettant d'écrire et de manipuler de gigantesques nombres entiers au-delà de la limite maximale sûre du langage.",
    usage: "Recommandé pour manipuler d'immenses valeurs de bases de données, de coordonnées d'horlogeries, ou de jetons cryptographiques.",
    donts: "Vous ne pouvez pas additionner de manière directe des BigInt et des types Number classiques sans pré-conversion de type.",
    codeSnippet: `const hugeNumber = 9007199254740991n;
const added = hugeNumber + 1n;`
  },
  {
    name: "Array.from()",
    category: "structure",
    description: "Crée une véritable instance de tableau ordonné depuis n'importe quel objet semblable à un tableau (comme une NodeList).",
    usage: "Incontournable pour pouvoir exécuter des transformations de type .map() ou .filter() sur des listes de nœuds HTML issues de requêtes.",
    donts: "N'essayez pas de faire un .map() direct sur une NodeList brute si vous œuvrez sur de très vieux navigateurs.",
    codeSnippet: `const divs = document.querySelectorAll("div");
const divArray = Array.from(divs);`
  },
  {
    name: "Object Freeze & Seal",
    category: "structure",
    description: "Verrouille un objet pour interdire l'ajout ou la suppression complète de ses propriétés (Seal) ou toute modification de valeur (Freeze).",
    usage: "Idéal pour sanctuariser vos configurations d'applications critiques d'être corrompues par un autre script.",
    donts: "Sachez que ces méthodes ne protègent que le premier niveau (une congélation superficielle et non en profondeur).",
    codeSnippet: `const config = { api: "https://v1" };
Object.freeze(config);
config.api = "https://v2"; // Échoue silencieusement (ou jette une erreur en Strict Mode)`
  },
  {
    name: "Function Binding (bind, call, apply)",
    category: "structure",
    description: "Permet de forcer manuellement le contexte d'association 'this' d'une fonction.",
    usage: "Utile pour emprunter de robustes fonctions utilitaires d'une classe à une autre.",
    donts: "Bannissez ces écritures alambiquées dans de nouvelles fonctions en privilégiant de simples closures modernes.",
    codeSnippet: `const info = { label: "Info" };
function show() { console.log(this.label); }
const showBound = show.bind(info);`
  },
  {
    name: "Event Loop (Boucle d'événements)",
    category: "structure",
    description: "Mécanique d'exécution asynchrone gérant la pile de tâches, les microtâches (Promises) et la file d'attente d'événements.",
    usage: "Comprendre cet ordre permet de savoir pourquoi un setTimeout à 0ms se déclenche toujours après un bloc de promesse synchrone.",
    donts: "Ne bloquez jamais l'Event Loop avec d'interminables boucles synchrones de calcul ('blocking thread'), sous peine de geler l'affichage web.",
    codeSnippet: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Affiche dans l'ordre de l'Event Loop : 1, 4, 3, 2`
  },
  {
    name: "Microtasks vs Macrotasks",
    category: "structure",
    description: "Les deux voies de priorisations de tâches asynchrones exécutées par l'Event Loop de Javascript.",
    usage: "Les promesses (Microtasks) ont un canal de traitement prioritaire s'exécutant intégralement avant les minuteurs ou clics (Macrotasks).",
    donts: "Ne saturez pas les files de microtâches de calculs en boucle infinie (ex: appels récursifs de Promise.resolve), car cela paralyse la page.",
    codeSnippet: `queueMicrotask(() => {
  console.log("Ceci est exécuté de manière hautement prioritaire dans la file de micro-tâches !");
});`
  }
];
