import { SemanticTag, SemanticeErrorSample, GameBlock } from "./types";

export const SEMANTIC_TAGS: SemanticTag[] = [
  {
    name: "<main>",
    category: "structure",
    description: "Représente le contenu principal unique du corps (<body>) du document.",
    usage: "Il ne doit y avoir qu'un seul élément <main> visible par page. Il regroupe le contenu central qui est directement lié au sujet de la page. Ne doit pas contenir des éléments répétés comme les menus, les barres d'outils, les pieds de page, etc.",
    donts: "Ne l'incluez jamais à l'intérieur d'un <header>, <nav>, <aside> ou <footer>. N'ayez pas plusieurs éléments <main> actifs en même temps.",
    codeSnippet: `<body>
  <header>
    <h1>Mon Blog de Développement</h1>
  </header>
  
  <main>
    <h2>Dernier Article : Maîtriser le CSS Grid</h2>
    <p>Aujourd'hui, nous allons parler des grilles...</p>
  </main>
</body>`
  },
  {
    name: "<header>",
    category: "structure",
    description: "Représente un groupe d'introduction ou d'aide à la navigation.",
    usage: "Utilisez-le pour contenir les logos, le nom du site, le slogan, un champ de recherche, ou l'élément <nav> principal de navigation.",
    donts: "Ne le confondez pas avec l'élément <head> qui gère les métadonnées de la page ! Un <header> peut également être présent au début de chaque balise <article> ou <section>.",
    codeSnippet: `<header>
  <img src="logo.png" alt="Logo de l'école">
  <nav>
    <a href="/cours">Cours</a> | <a href="/contact">Contact</a>
  </nav>
</header>`
  },
  {
    name: "<nav>",
    category: "structure",
    description: "Définit un bloc de liens de navigation majeurs.",
    usage: "Utilisez-le pour la navigation principale (menu principal, sous-menus globaux, fil d'Ariane, ou pagination importante).",
    donts: "Ne l'utilisez pas pour tous les groupes de liens ! Les petits liens du pied de page ou les mentions légales n'ont généralement pas besoin d'un <nav>.",
    codeSnippet: `<nav aria-label="Menu Principal">
  <ul>
    <li><a href="/">Accueil</a></li>
    <li><a href="/blog">Articles</a></li>
    <li><a href="/a-propos">À Propos</a></li>
  </ul>
</nav>`
  },
  {
    name: "<section>",
    category: "structure",
    description: "Représente une section générique de document, regroupant un thème précis.",
    usage: "Elle doit contenir un contenu thématique, presque toujours accompagné d'un titre (<h2> à <h6>). Elle structure logiquement un document volumineux.",
    donts: "Ne l'utilisez PAS pour du simple positionnement CSS (comme wrapper ou container de mise en page). Utilisez une simple <div> pour cela. Une section doit faire sens thématiquement.",
    codeSnippet: `<section id="features">
  <h2>Nos Services Premium</h2>
  <div class="grid">
    <p>Nous offrons du consulting de haute qualité...</p>
    <p>Nous auditons votre accessibilité web de A à Z.</p>
  </div>
</section>`
  },
  {
    name: "<article>",
    category: "structure",
    description: "Représente une composition autonome dans un document ou un site.",
    usage: "Elle est destinée à être distribuable ou réutilisable de manière indépendante (ex: un article de blog, une fiche produit, un commentaire d'utilisateur, un post de forum).",
    donts: "Ne l'utilisez pas si le contenu ne peut pas être extrait du site sans perdre son sens premier. Chaque <article> doit posséder idéalement son propre titre de section d'en-tête.",
    codeSnippet: `<article class="product-card">
  <h3>Ordinateur Portable XPS 13</h3>
  <p class="price">1,299 €</p>
  <p>Compact, puissant et parfait pour coder en sémantique !</p>
  <button>Ajouter au panier</button>
</article>`
  },
  {
    name: "<aside>",
    category: "structure",
    description: "Représente une section dont le contenu est indirectement lié au contenu principal.",
    usage: "Généralement présenté comme une barre latérale, l'aside sert pour les glossaires, les publicités externes, les suggestions de lecture, les profils d'auteurs ou les citations en exergue (\"pull quotes\").",
    donts: "Ne l'utilisez pas pour des éléments qui font partie intégrante du flux de lecture nécessaire. Le lecteur doit pouvoir ignorer l'aside sans rompre sa compréhension.",
    codeSnippet: `<main>
  <article>
    <h2>Introduction au HTML5</h2>
    <p>Le HTML5 est né en 2014 pour structurer le web...</p>
  </article>
  
  <aside>
    <h3>Le Saviez-vous ?</h3>
    <p>Le créateur du HTML original est Sir Tim Berners-Lee en 1991 au CERN.</p>
  </aside>
</main>`
  },
  {
    name: "<footer>",
    category: "structure",
    description: "Représente le pied de page d'une section ou du document complet.",
    usage: "Il contient généralement des informations de copyright, de paternité, des liens vers les conditions d'utilisation, des coordonnées ou une navigation de secours.",
    donts: "N'imbriquez pas un <footer> dans un autre <footer>. Tout comme <header>, vous pouvez avoir des pieds de page de sous-sections (<article> ou <section>).",
    codeSnippet: `<footer>
  <p>© 2026 Sémantique HTML5 de A à Z. Développé avec soin.</p>
  <ul>
    <li><a href="/legal">Mentions Légales</a></li>
    <li><a href="/privacy">Confidentialité</a></li>
  </ul>
</footer>`
  },
  {
    name: "<figure> & <figcaption>",
    category: "content",
    description: "Associe un contenu autonome (image, diagramme, extrait de code) à sa légende explicative.",
    usage: "L'élément <figure> groupe le média, et <figcaption> (toujours premier ou dernier enfant) définit la légende textuelle accessible.",
    donts: "N'utilisez pas <figcaption> en dehors de <figure>. C'est une erreur de validation W3C majeure.",
    codeSnippet: `<figure>
  <img src="html5-structure.svg" alt="Schéma de la hiérarchie HTML5 avec header, nav, main, aside, footer">
  <figcaption>Figure 1.2: Schéma des zones de mise en page conformes au W3C.</figcaption>
</figure>`
  },
  {
    name: "<time>",
    category: "content",
    description: "Permet de représenter une date précise, compréhensible par les moteurs de recherche et les machines.",
    usage: "Utilisez-le pour marquer des dates de publication, d'événements ou des heures précises, avec l'attribut date-machine 'datetime'.",
    donts: "N'utilisez pas <time> sans l'attribut datetime si le texte à l'intérieur n'est pas déjà dans un format standardisé ISO 8601 (YYYY-MM-DD).",
    codeSnippet: `<article>
  <h3>Mise à jour v3.0</h3>
  <p>Publié le <time datetime="2026-06-04">4 juin 2026</time> par l'équipe.</p>
</article>`
  },
  {
    name: "<mark>",
    category: "inline",
    description: "Surligne du texte pour en montrer la pertinence actuelle.",
    usage: "Utilisez-le pour attirer l'attention sur une correspondance exacte lors d'une recherche, ou pour mettre en évidence un mot-clé dans un paragraphe.",
    donts: "Ne l'utilisez pas à des fins de simple style visuel (utilisez des classes CSS sur des <span> pour cela). <mark> donne une consonance d'importance relative.",
    codeSnippet: `<p>Résultats de recherche pour "HTML5" :
Le <mark>HTML5</mark> offre des balises comme main, header et footer.</p>`
  },
  {
    name: "<details> & <summary>",
    category: "interactive",
    description: "Crée un accordéon interactif natif, pliable et dépliable sans une seule ligne de JavaScript.",
    usage: "L'élément <details> sert d'enveloppe, et <summary> est le titre visible sur lequel l'utilisateur clique pour dérouler le reste du contenu.",
    donts: "N'oubliez pas d'inclure <summary> sous peine de voir le navigateur afficher un texte par défaut comme 'Détails'. C'est natif, léger et parfaitement accessible au clavier !",
    codeSnippet: `<details>
  <summary>Comment fonctionne le SEO sémantique ?</summary>
  <p>En utilisant des balises précises, les bots de Google listent votre contenu plus précisément, ce qui améliore drastiquement votre SEO naturel.</p>
</details>`
  },
  {
    name: "<dialog>",
    category: "interactive",
    description: "Définit une boîte de dialogue ou une fenêtre modale native accessible.",
    usage: "Il gère l'inclusion d'alertes, de fenêtres de confirmation ou de formulaires volants. Il peut être ouvert de façon modale (bloquant l'interaction arrière-plan) via la méthode dialogElement.showModal() en JavaScript.",
    donts: "N'oubliez pas que l'accessibilité requiert un piège de focus (Focus Trap). L'ouverture modale via showModal() s'en charge nativement, mais pas l'ouverture simple via show().",
    codeSnippet: `<dialog id="promoDialog">
  <h3>Félicitations !</h3>
  <p>Vous avez débloqué le badge Expert Sémantique HTML5.</p>
  <form method="dialog">
    <button>Fermer</button>
  </form>
</dialog>`
  },
  {
    name: "<progress>",
    category: "content",
    description: "Représente l'état d'avancement d'une tâche de manière accessible.",
    usage: "Utilisez-le pour afficher la progression d'un téléchargement, d'un parcours utilisateur ou le score sémantique d'un test.",
    donts: "Ne l'utilisez pas comme une jauge d'espace libre de disque dur (utilisez l'élément <meter> pour mesurer des taux d'occupation fixes ou variables).",
    codeSnippet: `<div class="progress-container">
  <label id="p-label" for="html-p">Progression du cours :</label>
  <progress id="html-p" max="100" value="85">85%</progress>
</div>`
  }
];

export const COMMON_ERRORS_BY_LANG: Record<string, SemanticeErrorSample[]> = {
  HTML5: [
    {
      id: "error-1",
      title: "Le syndrome de la Soupe de Divs (Div Soup)",
      description: "Utiliser des <div> génériques pour tout l'habillage de la page, privant les robots de recherche et lecteurs d'écran de tout repère visuel et sémantique.",
      badCode: `<!-- INCONFORME & SANS SÉMANTIQUE -->
<div id="header">
  <div class="logo">Ma Sémantique</div>
  <div id="nav">
    <a href="/index">Accueil</a>
  </div>
</div>
<div id="main-content">
  <div class="title">Bienvenue sur le Web Moderne</div>
  <div class="intro-paragraph">Découvrez les balises...</div>
</div>
<div id="footer">
  <div class="copyright">© 2026. Tous droits réservés.</div>
</div>`,
      goodCode: `<!-- CONFORME & ACCESSIBLE -->
<header>
  <div class="logo">Ma Sémantique</div>
  <nav aria-label="Navigation principale">
    <a href="/index">Accueil</a>
  </nav>
</header>
<main>
  <h1>Bienvenue sur le Web Moderne</h1>
  <p class="intro">Découvrez les balises...</p>
</main>
<footer>
  <p>© 2026. Tous droits réservés.</p>
</footer>`,
      explanation: "Le code propre utilise 70% moins de texte pour le même résultat visuel et permet aux lecteurs d'écran d'offrir une navigation par régions (Header, Nav, Main, Footer)."
    },
    {
      id: "error-2",
      title: "L'abus de la balise <section> sans Titre",
      description: "Utiliser <section> comme un simple conteneur de mise en page CSS (remplaçant à tort les <div>) sans lui donner de but thématique ni de titre <h2>-<h6>.",
      badCode: `<!-- ERREUR COMMUNE -->
<section class="container-blue-margin">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</section>`,
      goodCode: `<!-- BONNE PRATIQUE -->
<section id="avantages" aria-labelledby="title-avantages">
  <h2 id="title-avantages">Nos Avantages Principaux</h2>
  <div class="cards-layout">
    <div class="card">Item 1</div>
    <div class="card">Item 2</div>
  </div>
</section>

<!-- Et pour du pur style et marges, privilégiez <div>: -->
<div class="container-blue-margin">
  <!-- CSS Wrapper -->
</div>`,
      explanation: "Selon les recommandations officielles du W3C: '<section> regroupe des éléments apparentés avec un thème commun, généralement introduit par un titre'. Si une section n'a pas besoin de titre, il s'agit sûrement d'une simple structure stylistique qui nécessite une <div>."
    },
    {
      id: "error-3",
      title: "Le bouton factice (Sémantique Interactive rompue)",
      description: "Rendre interactif des <div> ou des <span> via JavaScript sans utiliser <button>, ce qui casse la navigation au clavier et exclut les personnes handicapées.",
      badCode: `<!-- CATASTROPHIQUE POUR L'ACCESSIBILITÉ -->
<div class="btn-primary" onclick="sauvegarderDonnees()">
  Sauvegarder le Projet
</div>`,
      goodCode: `<!-- NATIF, ACCESSIBLE AU CLAVIER & ROBUSTE -->
<button type="button" class="btn-primary" onclick="sauvegarderDonnees()">
  Sauvegarder le Projet
</button>`,
      explanation: "L'utilisation de la balise native <button> offre gratuitement : l'accès au focus de tabulation (Tab index), le déclenchement au clavier (touches Entrée et Espace), et l'indication claire du rôle d'interaction pour les liseuses d'écran."
    },
    {
      id: "error-4",
      title: "Banaliser les dates avec des textes vagues",
      description: "Afficher des dates importantes sous forme de texte brut <span> sans attribut datetime, ce qui empêche d'automatiser des agrégateurs SEO ou des calendriers.",
      badCode: `<!-- NON EXPLOITABLE PAR LES MOTEURS -->
<p>L'événement aura lieu vendredi prochain (12 juin) à 14h.</p>`,
      goodCode: `<!-- OPTIMISÉ POUR LES ROBOTS ET L'ACCESSIBILITÉ -->
<p>L'événement aura lieu le <time datetime="2026-06-12T14:00">vendredi 12 juin à 14 heures</time>.</p>`,
      explanation: "La balise <time> avec l'attribut datetime au format standardisé ISO (AAMM-JJ) permet à des extensions d'agenda, aux robots d'indexation d'événements (Google Rich Snippets) et aux traducteurs d'extraire la date absolue."
    }
  ],
  CSS: [
    {
      id: "css-error-1",
      title: "Propriétés physiques en dur vs CSS Variables",
      description: "Répéter des valeurs de couleur ou d'espacement identiques en dur à travers des dizaines de sélecteurs, ce qui rend le code impossible à thémer.",
      badCode: `/* CSS RIGIDE ET DIFFICILE À THÉMER */
.sidebar {
  background-color: #4a154b;
  color: #ffffff;
  padding: 16px;
}
.card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
}
.btn-primary {
  background-color: #4a154b;
  color: #ffffff;
  border-radius: 4px;
}`,
      goodCode: `/* CSS VARIABLE ET ADAPTATIF */
:root {
  --primary-color: #4a154b;
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --text-dark: #1e293b;
  --radius-md: 8px;
  --spacing-normal: 1rem;
}
.sidebar {
  background-color: var(--primary-color);
  color: var(--card-bg);
  padding: var(--spacing-normal);
}
.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-dark);
}
.btn-primary {
  background-color: var(--primary-color);
  color: var(--card-bg);
  border-radius: calc(var(--radius-md) / 2);
}`,
      explanation: "L'usage des CSS Variables (--var) centralise le style dans :root. Mettre en place un mode sombre ou changer de charte graphique prend alors 10 secondes en redéfinissant uniquement ces variables."
    },
    {
      id: "css-error-2",
      title: "Mises en page 'hacks' (Float) vs CSS Grid & Flexbox",
      description: "Recourir aux alignements flottants obsolètes ou absolute forcés pour aligner des cartes complexes, ce qui rompt le flux normal et ruine le responsive.",
      badCode: `/* HISTORIQUE ET TRÈS FRAGILE */
.column-left {
  float: left;
  width: 32%;
  margin-right: 2%;
}
.column-middle {
  float: left;
  width: 32%;
  margin-right: 2%;
}
.column-right {
  float: right;
  width: 32%;
}
.clear-fix {
  clear: both;
}`,
      goodCode: `/* MODERNE, ROBUSTE ET ADAPTATIF */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
      explanation: "Grâce à CSS Grid et à l'exploitation d'auto-fit, l'affichage se recalcule naturellement. Les éléments passent à la ligne d'eux-mêmes sans media query arbitraire."
    }
  ],
  JavaScript: [
    {
      id: "js-error-1",
      title: "Variables instables 'var' vs 'let' et 'const'",
      description: "Utiliser var qui ignore la portée d'accolades (bloc), polluant le contexte global d'exécution et causant des comportements aberrants.",
      badCode: `/* PORTÉE COMMUNE ET CHOSES ÉTRANGES */
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log("Index:", i); // Renvoie toujours 'Index: 3'
  }, 100);
}`,
      goodCode: `/* PORTÉE DE BLOC ET COMPORTEMENT SAIN */
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log('Index: ' + i); // Renvoie bien 'Index: 0', 'Index: 1', etc.
  }, 100);
}`,
      explanation: "Le mot-clé 'let' capture l'indice au moment exact de l'itération grâce à sa portée de bloc stricte, écartant toute interférence asynchrone."
    },
    {
      id: "js-error-2",
      title: "Callback Hell vs Async/Await asynchrone linéaire",
      description: "Développer des pyramides d'appels réseaux imbriqués illisibles, propices aux bugs d'inattention et quasiment impossibles à surveiller.",
      badCode: `/* PYRAMIDE DE L'ENFER (CALLBACK HELL) */
getUserData(userId, function(user) {
  getUserProjects(user.id, function(projects) {
    getProjectDetails(projects[0], function(details) {
      console.log(details);
    });
  });
});`,
      goodCode: `/* FLUX ASYNCHRONE CLAIR ET SÉCURISÉ */
try {
  const user = await getUserData(userId);
  const projects = await getUserProjects(user.id);
  const details = await getProjectDetails(projects[0]);
  console.log(details);
} catch (error) {
  console.error("Échec du traitement :", error);
}`,
      explanation: "La syntaxe async/await permet d'ordonner vos traitements de manière séquentielle et naturelle, simplifiant la maintenance et fiabilisant la capture d'erreurs."
    }
  ],
  Python: [
    {
      id: "py-error-1",
      title: "Gestion hasardeuse de ressources vs 'with'",
      description: "Manipuler des fichiers ou ressources système par ouverture classique sans garantie absolue de fermeture (f.close()) si un bug survient.",
      badCode: `# CRASH POTENTIEL DE VERROU FICHIER
f = open("log.txt", "r")
data = f.read()
# Si une erreur survient ici, f.close() n'est jamais appelé !
print(data)
f.close()`,
      goodCode: `# FERMETURE INFAILLIBLE DU CANAL
with open("log.txt", "r", encoding="utf-8") as f:
    data = f.read()
    print(data)
# Le fichier se referme même si une exception éclate dans le bloc`,
      explanation: "L'instruction 'with' implémente le pattern Context Manager de Python. Il garantit qu'en sortant du bloc, la ressource est libérée proprement de la mémoire."
    },
    {
      id: "py-error-2",
      title: "Boucles de listes lourdes vs Compréhension de liste",
      description: "Écrire d'encombrantes boucles multi-lignes pour simplement filtrer et transformer une liste d'éléments.",
      badCode: `# STYLE VERBEUX ISSU DES LANGAGES TRADITIONNELS
result = []
for x in range(10):
    if x % 2 == 0:
        result.append(x * x)`,
      goodCode: `# COMPRÉHENSION EXPRESSIVE PYTHONIQUE
result = [x * x for x in range(10) if x % 2 == 0]`,
      explanation: "Les list comprehensions sont la signature d'un code pythonique d'excellence : elles se lisent sans effort de gauche à droite et bénéficient d'optimisations de vitesse internes."
    }
  ],
  PHP: [
    {
      id: "php-error-1",
      title: "Faille d'injection SQL béante vs PDO Préparé",
      description: "Concaténer directement du texte en provenance d'un utilisateur au sein d'un ordre de base de données SQL, permettant l'injection de commandes hostiles.",
      badCode: `// DANGEREUX : INTRUSION SYSTÈME POSSIBLE 
$clientId = $_GET['client_id'];
$query = "SELECT * FROM clients WHERE id = " . $clientId;
$result = $db->query($query);`,
      goodCode: `// INCRAQUABLE PAR INJECTION SQL
$clientId = $_GET['client_id'];
$stmt = $db->prepare("SELECT * FROM clients WHERE id = :id");
$stmt->execute(['id' => $clientId]);
$client = $stmt->fetch();`,
      explanation: "En transmettant les variables dans un tableau d'exécution séparé, PDO neutralise toute tentative de piratage en interdisant à la base de données d'interpréter le texte saisi comme de l'instruction machine."
    },
    {
      id: "php-error-2",
      title: "Affichage de texte non filtré vs Fail-Safe XSS",
      description: "Faire écho de variables ou paramètres URL directement sans échapper les balises, rendant possible l'administration forcée de scripts JS espions.",
      badCode: `// VULNÉRABLE AU VOL DE SESSIONS ET COOKIES
echo "<div>Bienvenue sur votre profil, " . $_GET['user'] . "</div>";`,
      goodCode: `// CONVERTI EN ENTITÉS UNITAIRES TOTALEMENT INOFFENSIVES
$user = htmlspecialchars($_GET['user'], ENT_QUOTES, 'UTF-8');
echo "<div>Bienvenue sur votre profil, " . $user . "</div>";`,
      explanation: "`htmlspecialchars` convertit des symboles critiques comme '<' ou '>' en chaînes inoffensives visualisables par le navigateur sans risques d'exécution de scripts."
    }
  ]
};

export const COMMON_ERRORS: SemanticeErrorSample[] = COMMON_ERRORS_BY_LANG.HTML5;

export const AUDIT_TEMPLATES_BY_LANG: Record<string, { label: string; code: string }[]> = {
  HTML5: [
    {
      label: "Div Soup / Mauvais Élément (Très critique)",
      code: `<div id="navbar">
  <div class="logo">TechNews</div>
  <div class="links">
    <a href="/index">Accueil</a>
    <a href="/news">Actualités</a>
  </div>
</div>

<div class="jumbotron">
  <div class="title-main">Débuter l'HTML Sémantique de suite</div>
  <span class="date">Publié le 14 Juin 2026 par Julie</span>
  
  <div class="content">
    La sémantique est primordiale pour de multiples raisons. 
    Par exemple, utiliser des div partout rend le document illisible pour un robot de crawl automatique.
  </div>
  
  <div class="comment-box">
    <div class="comment-author">Gérard</div>
    <div class="comment-text">Super article, très concret !</div>
  </div>
</div>

<div id="sidebar-widgets">
  <div class="ad-title">Publicité</div>
  <img src="ad.jpg" alt="Achetez des balises !">
</div>

<div id="footer">
  <span class="bold">© 2026. TechNews Corporation.</span>
</div>`
    },
    {
      label: "Sémantique Partie: Manque de Structure",
      code: `<header>
  <h1>Mon Blog Voyage</h1>
</header>

<section class="banner">
  <h2>Voyager pas cher au Japon</h2>
</section>

<!-- Tout est jeté en vrac sans sectionnement global -->
<h3>Jour 1: Arrivée à Tokyo</h3>
<p>C'est un choc culturel intense à Akihabara...</p>

<h3>Jour 2: Les temples d'Asakusa</h3>
<p>Le temple est magnifique sous le soleil du matin...</p>

<!-- Publicité hors sujet -->
<div class="ad">
  <span>Voyagez à 50% de réduction !</span>
</div>

<footer>
  <a href="/legal">Mentions légales</a>
</footer>`
    },
    {
      label: "Sémantique Parfaite (Valide à 100%)",
      code: `<header>
  <div class="brand">WebCraft</div>
  <nav aria-label="Navigation principale">
    <ul>
      <li><a href="/">Accueil</a></li>
      <li><a href="/services">Services</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <header>
      <h1>Guide Complet du W3C</h1>
      <p>Par <span class="author">Adrien</span>, publié le <time datetime="2026-06-04">4 Juin 2026</time></p>
    </header>
    
    <section id="chapitre1">
      <h2>1. Pourquoi coder accessible ?</h2>
      <p>L'accessibilité web permet de rendre Internet utilisable par tous.</p>
    </section>
    
    <section id="chapitre2">
      <h2>2. Les clés du succès</h2>
      <p>Mettre en place des aria-labels et valider le HTML au W3C validator.</p>
    </section>
    
    <footer>
      <p>Catégorie: Tutoriels HTML5</p>
    </footer>
  </article>

  <aside aria-label="Lectures complémentaires">
    <h2>Articles recommandés</h2>
    <ul>
      <li><a href="/accessibility">S'initier aux normes RGAA</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>© 2026 WebCraft.</p>
</footer>`
    }
  ],
  CSS: [
    {
      label: "CSS Spaghetti non structuré (Critique)",
      code: `/* Style spaghetti sans réutilisation ni variables */
.box-header {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 12px;
  font-size: 18px;
  border-radius: 4px;
}
.box-body {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
}
.sidebar-ad {
  float: left;
  width: 250px;
  background-color: #3b82f6;
  margin-top: 10px;
}`
    },
    {
      label: "CSS Moderne & Structuré (Propriétés sémantiques)",
      code: `/* Style moderne avec variables et layout solide */
:root {
  --primary-accent: #3b82f6;
  --bg-slate: #f8fafc;
  --border-slate: #e2e8f0;
  --radius-normal: 6px;
  --spacing-md: 1rem;
}

.box-header {
  background-color: var(--primary-accent);
  color: #fff;
  padding: var(--spacing-md);
  font-size: 1.125rem;
  border-radius: var(--radius-normal);
}

.box-body {
  background-color: var(--bg-slate);
  border: 1px solid var(--border-slate);
  padding: var(--spacing-md);
}

.sidebar-ad {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(100%, 250px);
  background-color: var(--primary-accent);
}`
    }
  ],
  JavaScript: [
    {
      label: "JavaScript ES5 obsolète et asynchrone bloquant",
      code: `// Utilisation de var, concaténation de chaînes pénible et callbacks imbriqués
var apiEndpoint = "https://api.github.com/users/";

function startProcess(username) {
  var completeUrl = apiEndpoint + username;
  var request = new XMLHttpRequest();
  request.open("GET", completeUrl, false); // Appel Synchrone Bloquant !
  request.send(null);

  if (request.status === 200) {
    var rawData = JSON.parse(request.responseText);
    console.log("Nom complet trouvé : " + rawData.name);
    
    // Suite du traitement avec callback manuel
    loadRepos(rawData.repos_url, function(repos) {
       console.log("Dépôts chargés : " + repos.length);
    });
  }
}`
    },
    {
      label: "JavaScript ES6+ Moderne synchrone découpé",
      code: `// Flèche, Async/Await sécurisé, Template literals & Déstructuration
const GITHUB_API = "https://api.github.com/users/";

const fetchUserProfile = async (username) => {
  try {
    const response = await fetch(\`\${GITHUB_API}\${username}\`);
    if (!response.ok) throw new Error(\`Erreur HTTP : \${response.status}\`);
    
    const { name, repos_url } = await response.json();
    console.log(\`Nom complet trouvé : \${name || "Non renseigné"}\`);

    const reposResponse = await fetch(repos_url);
    if (reposResponse.ok) {
       const repos = await reposResponse.json();
       console.log(\`Dépôts chargés : \${repos.length}\`);
    }
  } catch (error) {
    console.error(\`Échec de l'audit utilisateur : \${error.message}\`);
  }
};`
    }
  ],
  Python: [
    {
      label: "Script Python peu idiomatique (C-Style)",
      code: `# Style impératif verbeux
f = open("scores.csv", "r")
lines = f.readlines()

result_data = []
i = 0
while i < len(lines):
    line = lines[i].strip()
    if line != "":
        row = line.split(",")
        name = row[0]
        points = int(row[1])
        if points > 50:
            result_data.append(name.upper())
    i += 1

f.close()
print("Lauréats: " + str(result_data))`
    },
    {
      label: "Pythonic Code d'excellence (Même logique)",
      code: `# Utilisation d'un gestionnaire de contexte et compréhension de liste
import csv

try:
    with open("scores.csv", "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        # Compréhension de liste filtrée
        winners = [row[0].upper() for row in reader if row and int(row[1]) > 50]
        print(f"Lauréats: {winners}")
except FileNotFoundError:
    print("Erreur : Le fichier de scores n'existe pas.")
except (ValueError, IndexError):
    print("Erreur : Le fichier CSV est mal formaté.")`
    }
  ],
  PHP: [
    {
      label: "Vieux Script PHP avec injection et failles de sécurité",
      code: `<?php
// Connexion non sécurisée obsolète et aucune validation d'argument
$link = mysql_connect("localhost", "root", "");
mysql_select_db("ecomm_db", $link);

$itemId = $_GET['item_id'];
$query = "SELECT * FROM items WHERE status = 'active' AND id = " . $itemId;

$dbResult = mysql_query($query);
$row = mysql_fetch_assoc($dbResult);

// Faille XSS flagrante
echo "<h1>Fiche Produit : " . $row['title'] . "</h1>";
echo "<p>" . $row['description'] . "</p>";
?>`
    },
    {
      label: "PHP 8 Moderne Sécurisé (Inject-Proof et XSS-Defuse)",
      code: `<?php
declare(strict_types=1);

try {
    $db = new PDO("mysql:host=localhost;dbname=ecomm_db;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    $itemId = filter_input(INPUT_GET, 'item_id', FILTER_VALIDATE_INT);
    if (!$itemId) {
        throw new InvalidArgumentException("Identifiant de produit incorrect.");
    }

    $stmt = $db->prepare("SELECT title, description FROM items WHERE status = 'active' AND id = :id");
    $stmt->execute(['id' => $itemId]);
    $item = $stmt->fetch();

    if ($item) {
        $cleanTitle = htmlspecialchars($item['title'], ENT_QUOTES, 'UTF-8');
        $cleanDesc = htmlspecialchars($item['description'], ENT_QUOTES, 'UTF-8');
        
        echo "<h1>Fiche Produit : " . $cleanTitle . "</h1>\\n";
        echo "<p>" . $cleanDesc . "</p>\\n";
    } else {
        echo "<p>Produit introuvable.</p>";
    }
} catch (Exception $e) {
    error_log($e->getMessage());
    echo "<p>Une erreur est survenue lors du chargement des informations.</p>";
}
?>`
    }
  ]
};

export const INITIAL_AUDIT_TEMPLATES = AUDIT_TEMPLATES_BY_LANG.HTML5;

export const INITIAL_GAME_BLOCKS_HTML: GameBlock[] = [
  {
    id: "g1",
    label: "En-tête de page",
    correctTag: "<header>",
    description: "Le logo du site, l'identité visuelle et le menu de navigation principal habitent ici.",
  },
  {
    id: "g2",
    label: "Liens de navigation principaux",
    correctTag: "<nav>",
    description: "L'enveloppe indispensable qui regroupe la liste des hyperliens principaux de redirection.",
  },
  {
    id: "g3",
    label: "Contenu central unique de la page",
    correctTag: "<main>",
    description: "C'est l'hôte principal. Un seul par page. Il déclare le coeur de l'information présente.",
  },
  {
    id: "g4",
    label: "Un article ou une fiche postale autonome",
    correctTag: "<article>",
    description: "Définit un bloc complet qui garde sa signification entière s'il est extrait du site.",
  },
  {
    id: "g5",
    label: "Une barre latérale optionnelle",
    correctTag: "<aside>",
    description: "Contient des informations de fond, des publicités ou des widgets secondaires liés au sujet principal.",
  },
  {
    id: "g6",
    label: "Le Pied de page",
    correctTag: "<footer>",
    description: "La signature basse possédant le copyright, les adresses de contact et les mentions obligatoires.",
  }
];

export const GAME_OPTIONS_HTML = [
  "<header>",
  "<nav>",
  "<main>",
  "<section>",
  "<article>",
  "<aside>",
  "<footer>"
];

export const INITIAL_GAME_BLOCKS_CSS: GameBlock[] = [
  {
    id: "css1",
    label: "Bloc d'alignement flexible",
    correctTag: "display: flex;",
    description: "La propriété incontournable pour aligner les éléments fils selon l'axe principal ou secondaire.",
  },
  {
    id: "css2",
    label: "Alignement sur l'axe principal",
    correctTag: "justify-content",
    description: "Définit la distribution de l'espace libre le long de l'axe de direction d'un conteneur flex/grid.",
  },
  {
    id: "css3",
    label: "Alignement perpendiculaire",
    correctTag: "align-items",
    description: "Gère l'alignement individuel ou groupé des éléments enfants le long de l'axe transversal.",
  },
  {
    id: "css4",
    label: "Gouttières d'espacement",
    correctTag: "gap",
    description: "Définit simplement l'espacement entre lignes et colonnes sans utiliser de padding ou margin complexes.",
  },
  {
    id: "css5",
    label: "Hors flux de page",
    correctTag: "position: absolute;",
    description: "Retire l'élément de la structure par défaut pour le placer librement face à son plus proche parent relatif.",
  },
  {
    id: "css6",
    label: "Contour sphérique ou adouci",
    correctTag: "border-radius",
    description: "Arrondit les angles d'une boîte ou transforme tout carré en cercle parfait.",
  },
  {
    id: "css7",
    label: "Ombre et relief tridimensionnel",
    correctTag: "box-shadow",
    description: "Ajoute des effets d'ombre arrière-plan à la boîte de l'élément pour renforcer la cohésion et le réalisme visuel.",
  },
  {
    id: "css8",
    label: "Respiration et espacement interne",
    correctTag: "padding",
    description: "Définit l'espace entre le contenu d'un élément et sa bordure périphérique pour éviter que le texte ne colle.",
  },
  {
    id: "css9",
    label: "Ordre d'empilement 3D (Profondeur)",
    correctTag: "z-index",
    description: "Gère la superposition verticale des boîtes positionnées sur l'axe virtuel Z pour définir qui passe au-dessus.",
  },
  {
    id: "css10",
    label: "Interpolation et fluidité d'animation",
    correctTag: "transition",
    description: "Permet de modifier les valeurs des propriétés CSS de manière douce et progressive au lieu d'un changement brusque.",
  }
];

export const GAME_OPTIONS_CSS = [
  "display: flex;",
  "justify-content",
  "align-items",
  "gap",
  "position: absolute;",
  "border-radius",
  "box-shadow",
  "padding",
  "z-index",
  "transition",
  "margin",
  "opacity"
];

export const INITIAL_GAME_BLOCKS_JS: GameBlock[] = [
  {
    id: "js1",
    label: "Variable avec référence figée",
    correctTag: "const",
    description: "Déclare une variable dont la référence de liaison ne peut être modifiée ni écrasée.",
  },
  {
    id: "js2",
    label: "Code asynchrone synchrone",
    correctTag: "async / await",
    description: "Simplifie le traitement asynchrone séquentiel en évitant les cascades infernales de chaînes .then().",
  },
  {
    id: "js3",
    label: "Sécurité d'accès nul",
    correctTag: "?.",
    description: "Évite le crash fatal de l'application si l'un des parents d'une chaîne d'attributs n'est pas défini (null/undefined).",
  },
  {
    id: "js4",
    label: "Production de liste immuable",
    correctTag: "map()",
    description: "Méthode moderne de l'objet Array créant un nouveau tableau en appliquant une fonction sur chaque cellule.",
  },
  {
    id: "js5",
    label: "Extraction de variables",
    correctTag: "destructuring",
    description: "Sépare les propriétés d'un objet complexe ou les index d'un tableau pour les affecter à des variables uniques.",
  },
  {
    id: "js6",
    label: "Persistance de données navigateur",
    correctTag: "localStorage",
    description: "Permet de stocker de façon permanente des informations textuelles directement sur l'ordinateur du client.",
  }
];

export const GAME_OPTIONS_JS = [
  "const",
  "let",
  "async / await",
  "?.",
  "map()",
  "destructuring",
  "localStorage",
  "Promise"
];

export const INITIAL_GAME_BLOCKS_PYTHON: GameBlock[] = [
  {
    id: "py1",
    label: "Boucle inline raccourcie",
    correctTag: "List Comprehension",
    description: "Permet d'instancier, de filtrer et de transformer des listes ou collections en une seule ligne élégante.",
  },
  {
    id: "py2",
    label: "Gestion automatique de fichiers",
    correctTag: "with open(...)",
    description: "Déclare un gestionnaire de contexte assurant la libération (fermeture) instantanée d'un fichier ouvert.",
  },
  {
    id: "py3",
    label: "Concaténation sémantique",
    correctTag: "f-string",
    description: "Permet d'injecter et d'évaluer dynamiquement des expressions au coeur d'une chaîne textuelle en Python.",
  },
  {
    id: "py4",
    label: "Chambre d'interception d'erreur",
    correctTag: "try / except",
    description: "Capture les dysfonctionnements pendant l'exécution pour proposer une branche logique de contournement saine.",
  },
  {
    id: "py5",
    label: "Fonctions à usage unique brusques",
    correctTag: "lambda",
    description: "Crée des mini-fonctions anonymes jetables à la volée, souvent passées en paramètres de filtres.",
  },
  {
    id: "py6",
    label: "Structure associative",
    correctTag: "dict",
    description: "Type de collection natif associant des clés immuables uniques à des valeurs diverses.",
  }
];

export const GAME_OPTIONS_PYTHON = [
  "List Comprehension",
  "with open(...)",
  "f-string",
  "try / except",
  "lambda",
  "dict",
  "def",
  "import"
];

export const INITIAL_GAME_BLOCKS_PHP: GameBlock[] = [
  {
    id: "php1",
    label: "Protection contre les failles XSS",
    correctTag: "htmlspecialchars()",
    description: "Convertit les caractères spéciaux utilisateur en entités HTML inoffensives avant de les afficher.",
  },
  {
    id: "php2",
    label: "Cryptage ultra-robuste",
    correctTag: "password_hash()",
    description: "Génère une clé de chiffrement unidirectionnelle hautement sécurisée pour sauvegarder les mots de passe.",
  },
  {
    id: "php3",
    label: "Abstraction SQL sans injection",
    correctTag: "PDO",
    description: "Bibliothèque d'accès aux bases de données interdisant les injections grâce aux requêtes préparées.",
  },
  {
    id: "php4",
    label: "Isolation de namespaces",
    correctTag: "namespace",
    description: "Clarifie l'organisation des fichiers et évite la confusion de classes partageant un même nom.",
  },
  {
    id: "php5",
    label: "Récepteurs de requêtes",
    correctTag: "$_POST / $_GET",
    description: "Variables superglobales renfermant l'ensemble des données issues d'un formulaire client.",
  },
  {
    id: "php6",
    label: "Abris pour fautes d'exécution",
    correctTag: "try / catch",
    description: "Gère les exceptions critiques déclenchées par la base SQL ou le système de fichiers pour préserver le serveur.",
  }
];

export const GAME_OPTIONS_PHP = [
  "htmlspecialchars()",
  "password_hash()",
  "PDO",
  "namespace",
  "$_POST / $_GET",
  "try / catch",
  "echo",
  "array"
];

export const GAME_DATA_BY_LANG: Record<string, { blocks: GameBlock[]; options: string[] }> = {
  "HTML5": {
    blocks: INITIAL_GAME_BLOCKS_HTML,
    options: GAME_OPTIONS_HTML
  },
  "CSS": {
    blocks: INITIAL_GAME_BLOCKS_CSS,
    options: GAME_OPTIONS_CSS
  },
  "JavaScript": {
    blocks: INITIAL_GAME_BLOCKS_JS,
    options: GAME_OPTIONS_JS
  },
  "Python": {
    blocks: INITIAL_GAME_BLOCKS_PYTHON,
    options: GAME_OPTIONS_PYTHON
  },
  "PHP": {
    blocks: INITIAL_GAME_BLOCKS_PHP,
    options: GAME_OPTIONS_PHP
  }
};

// Keep exports for backward compatibility if any imports still rely on them directly
export const INITIAL_GAME_BLOCKS = INITIAL_GAME_BLOCKS_HTML;
export const GAME_OPTIONS = GAME_OPTIONS_HTML;
