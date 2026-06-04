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

export const COMMON_ERRORS: SemanticeErrorSample[] = [
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
];

export const INITIAL_AUDIT_TEMPLATES = [
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
];

export const INITIAL_GAME_BLOCKS: GameBlock[] = [
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

export const GAME_OPTIONS = [
  "<header>",
  "<nav>",
  "<main>",
  "<section>",
  "<article>",
  "<aside>",
  "<footer>"
];
