import { SemanticTag } from "./types";
import { JS_CONCEPTS_LIST } from "./jsData";
import { PYTHON_CONCEPTS_LIST } from "./pythonData";
import { PHP_CONCEPTS_LIST } from "./phpData";

export const CSS_PROPERTIES: SemanticTag[] = [
  {
    name: "display",
    category: "structure",
    description: "Spécifie le type d'affichage d'un élément dans le flux de la page.",
    usage: "Permet de modifier le comportement natif d'un élément (ex: transformer une balise inline en block), ou d'activer des agencements avancés avec flex et grid.",
    donts: "N'essayez pas de définir des dimensions de largeur ou hauteur sur display: inline, car les navigateurs les ignorent. Utilisez inline-block à la place.",
    codeSnippet: `.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}`
  },
  {
    name: "position",
    category: "structure",
    description: "Définit la méthode de positionnement d'un élément (static, relative, absolute, fixed, sticky).",
    usage: "Idéal pour superposer des éléments (absolute), fixer un en-tête (fixed/sticky) ou créer un point de référence pour les enfants absolus (relative).",
    donts: "N'abusez pas de position: absolute pour l'agencement général de la page, car cela brise le flux normal du document et nuit à la réactivité sur mobile (responsive).",
    codeSnippet: `.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
}`
  },
  {
    name: "flex",
    category: "structure",
    description: "Propriété raccourcie définissant la capacité d'un élément à grandir, rétrécir, ou avoir une taille de base dans un conteneur Flexbox.",
    usage: "Combine flex-grow, flex-shrink et flex-basis en une seule ligne. Idéal pour des colonnes auto-ajustables.",
    donts: "N'utilisez pas de valeurs brutes sans comprendre l'ordre : flex-grow en 1er, flex-shrink en 2e, et flex-basis en 3e.",
    codeSnippet: `.main-content {
  flex: 1 1 auto; /* Grandit et rétrécit selon l'espace */
}`
  },
  {
    name: "grid",
    category: "structure",
    description: "Propriété raccourcie permettant de configurer un système de grille bidimensionnel complet.",
    usage: "Pour créer des colonnes et lignes alignées sur deux axes en même temps de manière ultra-robuste.",
    donts: "Évitez d'utiliser grid pour des listes d'éléments unidimensionnelles simples. Préférerez flexbox dans ce cas.",
    codeSnippet: `.bento-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}`
  },
  {
    name: "flex-direction",
    category: "structure",
    description: "Définit l'axe de direction principal dans un conteneur Flexbox (row, row-reverse, column, column-reverse).",
    usage: "Permet d'aligner les enfants horizontalement (row par défaut) ou verticalement (column), idéal pour les listes réactives.",
    donts: "N'utilisez pas row-reverse uniquement pour inverser l'ordre visuel si cela nuit à l'ordre logique d'accessibilité au clavier (touches de tabulation).",
    codeSnippet: `.sidebar-nav {
  display: flex;
  flex-direction: column;
}`
  },
  {
    name: "justify-content",
    category: "structure",
    description: "Aligne les éléments enfants le long de l'axe principal dans Flexbox ou Grid (flex-start, center, space-between, space-around, space-evenly).",
    usage: "Permet d'espacer de manière identique des boutons dans un bandeau ou de centrer une carte horizontalement.",
    donts: "Ne fonctionnera pas si le conteneur n'a pas de largeur définie ou de display réglé sur flex/grid.",
    codeSnippet: `.navbar-items {
  display: flex;
  justify-content: space-between;
}`
  },
  {
    name: "align-items",
    category: "structure",
    description: "Aligne les éléments enfants le long de l'axe secondaire/transverse (vertical si flex-direction est horizontal).",
    usage: "Utilisez 'center' pour aligner parfaitement un icône et un texte sur la même ligne verticale.",
    donts: "Ne pas confondre avec align-content qui gère l'alignement des lignes entières d'un flexbox multi-lignes.",
    codeSnippet: `.header-bar {
  display: flex;
  align-items: center;
}`
  },
  {
    name: "flex-wrap",
    category: "structure",
    description: "Permet de décider si les éléments enfants d'un flexbox doivent passer à la ligne suivante en cas de manque d'espace.",
    usage: "Utilisez 'wrap' pour créer une galerie de cartes fluide et adaptative pour mobile.",
    donts: "Si wrap est absent (nowrap par défaut), vos éléments risquent de rétrécir excessivement ou de déborder de l'écran.",
    codeSnippet: `.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}`
  },
  {
    name: "flex-grow",
    category: "structure",
    description: "Définit l'aptitude d'un élément flex à s'étirer pour occuper l'espace restant disponible.",
    usage: "Utilisez flex-grow: 1 sur un champ d'input de recherche pour qu'il prenne toute la place restante à côté d'un bouton fixe.",
    donts: "Évitez d'attribuer des valeurs démesurées sans raison (ex: flex-grow: 9999). Des entiers simples comme 1, 2 ou 3 suffisent à définir les ratios.",
    codeSnippet: `.search-input {
  flex-grow: 1;
}`
  },
  {
    name: "flex-shrink",
    category: "structure",
    description: "Définit comment un élément flex doit se contracter vis-à-vis des autres si l'espace est insuffisant.",
    usage: "Mettez flex-shrink: 0 sur un avatar circulaire ou une icône pour éviter qu'ils ne se déforment et s'aplatissent sur les petits écrans.",
    donts: "N'oubliez pas que par défaut la valeur est à 1, ce qui signifie que l'élément accepte de rétrécir.",
    codeSnippet: `.avatar-img {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}`
  },
  {
    name: "flex-basis",
    category: "structure",
    description: "Spécifie la taille par défaut d'un élément flex avant que l'espace libre ne soit distribué.",
    usage: "Sert de largeur de départ fiable pour vos composants de colonnes.",
    donts: "Moins robuste que d'utiliser la notation abrégée 'flex: 0 0 250px' recommandée par le W3C.",
    codeSnippet: `.sidebar-column {
  flex-basis: 300px;
}`
  },
  {
    name: "grid-template-columns",
    category: "structure",
    description: "Définit les colonnes d'une grille CSS grid avec leurs largeurs respectives.",
    usage: "Combinez-le avec la fonction repeat() et l'unité fractionnaire fr pour des grilles s'adaptant parfaitement.",
    donts: "N'utilisez pas uniquement des pixels fixes (px) qui cassent la réactivité mobile du site.",
    codeSnippet: `.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}`
  },
  {
    name: "grid-template-rows",
    category: "structure",
    description: "Définit les lignes d'une grille CSS grid avec leurs hauteurs.",
    usage: "Idéal pour concevoir des mises en page avec un en-tête fixe, un contenu principal souple et un pied de page fixe.",
    donts: "Faites attention à ne pas contraindre inutilement la hauteur du contenu éditorial pour éviter des chevauchements de texte.",
    codeSnippet: `.page-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}`
  },
  {
    name: "grid-column",
    category: "structure",
    description: "Configure la position et l'envergure d'un élément enfant à l'intérieur des colonnes d'une grille.",
    usage: "Permet de faire s'étendre un bandeau sur toutes les colonnes via '1 / -1'.",
    donts: "Ne spécifiez pas de valeurs en dehors des limites maximales réelles de la grille sous peine d'erreurs d'affichage.",
    codeSnippet: `.hero-banner {
  grid-column: 1 / -1; /* S'étend du premier à l'extrême dernier */
}`
  },
  {
    name: "grid-row",
    category: "structure",
    description: "Configure la position et l'étendue d'un élément enfant à travers les lignes d'une grille.",
    usage: "Utile pour positionner un élément verticalement sur plusieurs cases dans un bento grid.",
    donts: "N'oubliez pas que les lignes de grille commencent à l'index 1 et non à 0.",
    codeSnippet: `.featured-item {
  grid-row: span 2; /* S'étend sur deux lignes verticales */
}`
  },
  {
    name: "gap",
    category: "structure",
    description: "Définit la taille de l'espace (gouttière) entre les lignes et les colonnes d'un layout Flexbox ou Grid.",
    usage: "C'est l'alternative moderne et propre aux marges extérieures, évitant de surcharger les sélecteurs :last-child.",
    donts: "N'utilisez plus de marges négatives alambiquées pour corriger les espacements externes, gap gère cela de manière isolée.",
    codeSnippet: `.flex-grid {
  display: flex;
  gap: 16px 24px; /* Haut/Bas Gauche/Droite */
}`
  },
  {
    name: "margin",
    category: "structure",
    description: "Définit l'espace libre extérieur périphérique autour d'un élément.",
    usage: "Permet de distancer deux blocs distincts ou de centrer horizontalement un bloc fixe via 'margin: 0 auto'.",
    donts: "N'abusez pas des marges négatives pour rattraper un mauvais positionnement structurel.",
    codeSnippet: `.centered-card {
  max-width: 500px;
  margin: 24px auto;
}`
  },
  {
    name: "padding",
    category: "structure",
    description: "Définit l'espace interne (marge intérieure) entre le contenu d'un élément et ses bordures.",
    usage: "Indispensable pour donner de l'air au texte dans un bouton ou un encadré.",
    donts: "N'ajoutez pas de gros paddings sans définir au préalable box-sizing: border-box, sinon l'élément s'élargira au-delà de sa largeur voulue.",
    codeSnippet: `.btn-action {
  padding: 12px 24px;
}`
  },
  {
    name: "width",
    category: "structure",
    description: "Définit la largeur d'un élément.",
    usage: "Permet de spécifier des tailles relatives (ex: 'width: 50%') ou absolues d'un composant.",
    donts: "Évitez d'injecter des valeurs fixes en pixels de grande taille (ex: 'width: 1200px') qui casseront l'affichage sur smartphone.",
    codeSnippet: `.modal-box {
  width: 90%;
  max-width: 600px;
}`
  },
  {
    name: "height",
    category: "structure",
    description: "Définit la hauteur d'un élément.",
    usage: "Très utile pour forcer un élément à prendre toute la hauteur de l'écran visible via 'height: 100vh' ou 'height: 100%'.",
    donts: "Évitez de fixer une 'height' stricte sur les conteneurs de textes, car si le texte dépasse, il débordera de façon inesthétique. Privilégiez 'min-height'.",
    codeSnippet: `.hero-section {
  min-height: 80vh;
}`
  },
  {
    name: "max-width",
    category: "structure",
    description: "Définit la largeur maximale qu'un élément peut atteindre.",
    usage: "La clé absolue du responsive ! Si l'écran est plus petit, l'élément rétrécit proprement.",
    donts: "Ne l'utilisez pas conjointement avec un 'width' en pixels plus grand, car cela peut créer des conflits.",
    codeSnippet: `.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}`
  },
  {
    name: "min-width",
    category: "structure",
    description: "Garantit une largeur minimale pour un élément.",
    usage: "Évite qu'un élément crucial du formulaire ou une barre latérale ne se contracte trop et devienne invisible.",
    donts: "N'appliquez pas un min-width supérieur à la largeur d'un écran mobile classique (320px) sans précautions.",
    codeSnippet: `.dropdown-pane {
  min-width: 220px;
}`
  },
  {
    name: "box-sizing",
    category: "structure",
    description: "Définit la méthode de calcul de la largeur et hauteur totale d'un élément (content-box ou border-box).",
    usage: "Réglez-le universellement sur 'border-box' pour que le padding et les bordures soient inclus dans le calcul de la taille globale, simplifiant les calculs de mise en page.",
    donts: "Bannissez 'content-box' des designs modernes !",
    codeSnippet: `* {
  box-sizing: border-box;
}`
  },
  {
    name: "z-index",
    category: "structure",
    description: "Régit l'ordre d'empilement vertical 3D des éléments positionnés (les valeurs élevées s'affichent devant).",
    usage: "Indispensable pour maintenir des boîtes modales, des menus ou des headers collants au-dessus du flux standard.",
    donts: "Ne donnez pas de z-index démesurés (ex: z-index: 99999999) au hasard. Établissez une charte ordonnée dans vos styles.",
    codeSnippet: `.sticky-nav {
  position: sticky;
  top: 0;
  z-index: 100;
}`
  },
  {
    name: "overflow",
    category: "structure",
    description: "Contrôle ce qui se passe lorsque le contenu d'un élément dépasse de ses dimensions physiques.",
    usage: "Possède des valeurs comme 'hidden' (masquer le surplus), 'scroll' (ajouter des barres de défilement) ou 'auto'.",
    donts: "Évitez 'overflow: hidden' sur des éléments contenant des menus déroulants, car ces derniers se retrouveront rognés et inutilisables.",
    codeSnippet: `.scrollable-card {
  max-height: 300px;
  overflow: auto;
}`
  },
  {
    name: "color",
    category: "content",
    description: "Définit la couleur de premier plan d'un élément (généralement la couleur du texte).",
    usage: "Utilisez-le avec des variables CSS, des codes hexadécimaux ou des valeurs RGB(A)/HSL.",
    donts: "N'utilisez jamais de couleurs de texte présentant un très faible contraste avec le fond, afin de préserver l'accessibilité pour tous.",
    codeSnippet: `.lead-text {
  color: hsl(260, 85%, 25%);
}`
  },
  {
    name: "background-color",
    category: "content",
    description: "Spécifie la couleur d'arrière-plan d'une boîte d'élément.",
    usage: "Sert à délimiter visuellement des sections ou des boutons interactifs.",
    donts: "Ne l'utilisez pas sans définir aussi une 'color' compatible pour conserver de la lisibilité.",
    codeSnippet: `.badge-success {
  background-color: rgb(240, 253, 244);
  color: rgb(21, 128, 61);
}`
  },
  {
    name: "font-family",
    category: "content",
    description: "Définit la police de caractères (typographie) utilisée pour restituer les textes.",
    usage: "Spécifiez toujours une famille de secours générique (comme sans-serif ou serif) en bout de chaîne.",
    donts: "N'importez pas de multiples polices externes lourdes depuis Google Fonts qui ralentissent grandement le chargement du site.",
    codeSnippet: `body {
  font-family: 'Inter', system-ui, sans-serif;
}`
  },
  {
    name: "font-size",
    category: "content",
    description: "Définit la taille visuelle de la police.",
    usage: "Privilégiez l'unité relative 'rem' au lieu de pixels ('px') pour permettre aux navigateurs de redimensionner le texte en fonction des réglages utilisateur.",
    donts: "Évitez d'utiliser des polices minuscules inférieures à 0.75rem (12px) pour le texte de lecture continue.",
    codeSnippet: `.main-title {
  font-size: 2rem; /* Équivaut à 32px par défaut */
}`
  },
  {
    name: "font-weight",
    category: "content",
    description: "Ajuste l'épaisseur de graisse des caractères (ex: bold, regular, ou des valeurs chiffrées de 100 à 900).",
    usage: "Mettez en relief vos titres avec des graisses imposantes (700 ou 800) et le corps de texte en normal (400).",
    donts: "Ne chargez pas des graisses inutilisées à des fins de performance web.",
    codeSnippet: `.font-bold-accent {
  font-weight: 800;
}`
  },
  {
    name: "line-height",
    category: "content",
    description: "Contrôle la distance (l'interligne) entre deux lignes de texte consécutives.",
    usage: "Utilisez des ratios unitless comme '1.5' ou '1.6' pour rendre la lecture confortable à l'œil.",
    donts: "Un interligne trop serré (comme 1.0) rend les textes de plusieurs phrases extrêmement difficiles à déchiffrer.",
    codeSnippet: `.article-body {
  line-height: 1.625;
}`
  },
  {
    name: "text-align",
    category: "content",
    description: "Aligne l'écriture textuelle à l'intérieur d'un bloc parent (left, right, center, justify).",
    usage: "Utile pour centrer les en-têtes ou aligner à droite des prix chiffrés.",
    donts: "Évitez de justifier (justify) des paragraphes sur le web, car cela provoque d'horribles espaces blancs saccadés (rivières de blanc).",
    codeSnippet: `.text-center {
  text-align: center;
}`
  },
  {
    name: "font-style",
    category: "content",
    description: "Définit le style de rendu de la police (normal ou italic).",
    usage: "Utilisez l'italique pour les citations ou références sémantiques.",
    donts: "Ne l'utilisez pas machinalement pour de grands textes car sa lisibilité est moindre.",
    codeSnippet: `.citation {
  font-style: italic;
}`
  },
  {
    name: "letter-spacing",
    category: "content",
    description: "Contrôle la distance d'espacement horizontal entre les lettres individuelles.",
    usage: "Très élégant en réduisant subtilement l'espace sur les grands titres lourds, ou en l'augmentant sur des étiquettes en capitales.",
    donts: "Ne l'augmentez pas trop sur le corps de texte principal car cela dissocie visuellement les mots.",
    codeSnippet: `.section-label {
  letter-spacing: 0.1em;
  text-transform: uppercase;
}`
  },
  {
    name: "text-decoration",
    category: "content",
    description: "Définit les soulignements, surlignements ou barrages de texte.",
    usage: "Utilisez text-decoration: none pour retirer la ligne de base inesthétique des liens dans les menus de navigation.",
    donts: "Ne retirez pas le soulignement des liens à l'intérieur de longs paragraphes de texte sous peine de couper les indices visuels d'interactivité.",
    codeSnippet: `.nav-link {
  text-decoration: none;
}`
  },
  {
    name: "text-transform",
    category: "content",
    description: "Spécifie la casse d'un texte pour le forcer en majuscules (uppercase), minuscules, ou capitalisation du début de mot.",
    usage: "Utilisez-le pour styliser des libellés légers ou des petits intitulés sans saturer le HTML d'écriture capitalisée brute.",
    donts: "N'écrivez pas en brut d'autorité en MAJUSCULES dans votre code HTML, car les liseuses d'écrans épellent parfois les mots lettre par lettre.",
    codeSnippet: `.table-header-title {
  text-transform: uppercase;
}`
  },
  {
    name: "border",
    category: "content",
    description: "Propriété raccourcie dessinant un contour périphérique complet autour d'un élément (taille, style, couleur).",
    usage: "Idéal pour configurer des séparations visuelles élégantes ou des bordures de focus.",
    donts: "Évitez d'utiliser des bordures épaisses et criardes qui nuisent à l'élégance minimaliste de l'application.",
    codeSnippet: `.input-field {
  border: 1px solid hsl(240, 10%, 90%);
}`
  },
  {
    name: "border-radius",
    category: "content",
    description: "Arrondit les angles physiques de la boîte d'un élément.",
    usage: "Utilisez des valeurs légères (ex: 8px) pour adoucir le design, ou 9999px combiné à des dimensions carrées pour générer des cercles parfaits.",
    donts: "Évitez d'utiliser des rayons d'arrondi trop massifs sur des éléments de texte étirés qui perdent alors leur alignement de lecture.",
    codeSnippet: `.profile-avatar {
  border-radius: 9999px;
}`
  },
  {
    name: "box-shadow",
    category: "content",
    description: "Ajoute des effets d'ombrage portés sous la boîte d'un élément.",
    usage: "Idéal pour matérialiser l'élévation d'un élément et détacher visuellement une fenêtre pop-up ou une carte du fond.",
    donts: "Bannissez les ombres dures, sombres et saturées. Privilégiez des ombres à large diffusion très transparentes.",
    codeSnippet: `.floating-panel {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}`
  },
  {
    name: "text-shadow",
    category: "content",
    description: "Ajoute un effet d'ombrage directement aux caractères d'un texte.",
    usage: "Pour créer des effets d'écriture lumineux ou augmenter la visibilité d'un texte clair sur un fond de couleur complexe.",
    donts: "N'appliquez pas d'ombres de texte trop floues ou décalées car elles réduiront grandement la netteté de lecture.",
    codeSnippet: `.contrast-headline {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}`
  },
  {
    name: "background-image",
    category: "media",
    description: "Affecte un ou plusieurs médias visuels (images, dégradés linéaires/radiaux) en arrière-plan.",
    usage: "Très employé pour créer de superbes boutons dégradés ou poser une image d'habillage de fond.",
    donts: "N'utilisez pas d'image trop contrastée sans ajouter d'overlay ou de calque sombre par-dessus si vous y écrivez du texte.",
    codeSnippet: `.gradient-button {
  background-image: linear-gradient(135deg, #4f46e5, #9333ea);
}`
  },
  {
    name: "background-size",
    category: "media",
    description: "Régit la taille de rendu de l'image de fond (cover, contain, ou valeurs dimensionnelles).",
    usage: "Le mot-clé 'cover' est parfait pour forcer l'image à se redimensionner intelligemment sans se déformer pour remplir l'espace.",
    donts: "N'utilisez pas de taille par défaut sur une image haute résolution, car elle risque d'apparaître zoomée anormalement.",
    codeSnippet: `.hero-background-image {
  background-size: cover;
  background-position: center;
}`
  },
  {
    name: "background-position",
    category: "media",
    description: "Indique les coordonnées de placement initial du média d'arrière-plan.",
    usage: "Utilisez 'center' pour s'assurer que le sujet principal de votre image d'arrière-plan reste au centre.",
    donts: "N'oubliez pas que l'échelle peut altérer le rendu si l'image est recadrée arbitrairement.",
    codeSnippet: `.banner {
  background-position: center top;
}`
  },
  {
    name: "background-repeat",
    category: "media",
    description: "Précise si l'image de fond doit être répétée en mosaïque verticale, horizontale, ou pas du tout.",
    usage: "Dans la majorité des cas modernes, réglez-le sur 'no-repeat'.",
    donts: "Bannissez la mosaïque automatique d'images non raccordables qui surcharge visuellement la mise en page.",
    codeSnippet: `.bg-element {
  background-repeat: no-repeat;
}`
  },
  {
    name: "object-fit",
    category: "media",
    description: "Régit le comportement d'échelle d'un élément média direct (<img>, <video>) dans son cadre parent.",
    usage: "Utilisez object-fit: cover pour forcer des images de dimensions variables à cohabiter harmonieusement dans une grille sans être écrasées.",
    donts: "Ne pas l'appliquer sans spécifier de hauteur et largeur fixes sur l'élément multimédia en question.",
    codeSnippet: `.gallery-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}`
  },
  {
    name: "object-position",
    category: "media",
    description: "Définit l'alignement spatial du contenu d'un média direct à l'intérieur de sa boîte.",
    usage: "Sert à repositionner visiblement la tête d'un sujet sur une photo rognée par 'object-fit: cover'.",
    donts: "Ne s'applique qu'aux éléments de remplacement directs comme les images ou vidéos.",
    codeSnippet: `.avatar-header {
  object-position: center 20%;
}`
  },
  {
    name: "aspect-ratio",
    category: "media",
    description: "Définit un ratio d'aspect idéal pour un élément (ex: 16/9, 4/3, 1/1).",
    usage: "La façon moderne et élégante d'éviter les tressautements de mise en page au chargement en allouant un espace constant.",
    donts: "N'ajoutez pas de hauteurs écrasant le ratio si vous voulez préserver l'aspect géométrique dynamique.",
    codeSnippet: `.video-player {
  width: 100%;
  aspect-ratio: 16 / 9;
}`
  },
  {
    name: "opacity",
    category: "media",
    description: "Spécifie le degré d'opacité/translucidité globale d'un élément (de 0.0 totalement invisible à 1.0 pleinement opaque).",
    usage: "Très utilisé pour atténuer des icônes désactivées ou créer des effets de survol élégants.",
    donts: "Sachez que l'opacité s'applique aussi à tout le texte et aux images enfants. Si vous désirez uniquement un fond transparent, préférez une couleur rgba() ou hsla().",
    codeSnippet: `.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}`
  },
  {
    name: "visibility",
    category: "media",
    description: "Permet de masquer visuellement un composant sans pour autant invalider sa place dans la géométrie de la page.",
    usage: "La valeur 'hidden' masque l'élément, mais l'emplacement physique du vide est préservé (contrairement à display: none).",
    donts: "Ne l'utilisez pas à la place de display: none si vous souhaitez retirer l'élément de la grille d'agencement.",
    codeSnippet: `.place-holder-element {
  visibility: hidden;
}`
  },
  {
    name: "transform",
    category: "media",
    description: "Permet d'appliquer des transformations 2D ou 3D à un élément (rotation, échelle, translations d'axes).",
    usage: "Idéal pour centrer parfaitement un pop-up ou agrandir légèrement une icône au survol de bouton.",
    donts: "Attention, une transformation modifie l'axe de rendu mais ne déplace pas l'envergure normale du flux initial.",
    codeSnippet: `.scale-hover:hover {
  transform: scale(1.05) translateY(-2px);
}`
  },
  {
    name: "transform-origin",
    category: "media",
    description: "Définit le point pivot de référence à partir duquel la transformation de l'élément s'effectue.",
    usage: "Utilisez-le pour faire pivoter un élément depuis un point d'ancrage précis (par exemple le coin en haut à gauche).",
    donts: "La valeur par défaut est de 50% 50% (parfaitement au centre).",
    codeSnippet: `.rotating-gear {
  transform-origin: center center;
}`
  },
  {
    name: "transition",
    category: "media",
    description: "Propriété raccourcie permettant de créer de superbes transitions de valeurs au changement d'état (ex: au survol).",
    usage: "Combinez la propriété à surveiller, sa durée, et la courbe d'accélération (ex: transition: all 0.2s ease-out).",
    donts: "Ne définissez jamais de transition directe sur la classe d'état de survol (:hover). Elle doit être posée sur la classe de base pour s'effectuer proprement à l'aller ET au retour.",
    codeSnippet: `.interactive-btn {
  background-color: #4f46e5;
  transition: background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.interactive-btn:hover {
  background-color: #4338ca;
}`
  },
  {
    name: "transition-property",
    category: "media",
    description: "Indique précisément quelle propriété CSS spécifique doit être animée par la transition.",
    usage: "Spécifiez des propriétés ciblées (ex: 'color, transform') au lieu de 'all' pour de bien meilleures performances.",
    donts: "Il est déconseillé d'animer les propriétés qui forcent un recalcul mathématique complexe de la page (comme width, layout, margin).",
    codeSnippet: `.soft-card {
  transition-property: transform, box-shadow;
}`
  },
  {
    name: "transition-duration",
    category: "media",
    description: "Précise la durée de réalisation d'une transition interactive.",
    usage: "Utilisez des durées douces et instinctives de l'ordre de 150ms à 350ms.",
    donts: "Les animations trop longues ralentissent inutilement l'interaction avec l'application.",
    codeSnippet: `.fast-menu {
  transition-duration: 200ms;
}`
  },
  {
    name: "transition-timing-function",
    category: "media",
    description: "Régit la courbe de vitesse d'accélération et décélération de l'effet de transition.",
    usage: "Utilisez ease-in-out ou des courbes d'amorti cubic-bezier personnalisées pour plus de réalisme et d'élégance.",
    donts: "Évitez la courbe de transition par défaut 'linear' sur les éléments visuellement interactifs car elle semble trop rigide.",
    codeSnippet: `.slide-panel {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}`
  },
  {
    name: "transition-delay",
    category: "media",
    description: "Spécifie un temps d'attente initial avant le déclenchement de la transition.",
    usage: "Utile pour créer des apparitions en cascades complexes d'éléments d'une liste.",
    donts: "Ne l'utilisez pas sur les clics de boutons primaires pour ne pas altérer l'interactivité.",
    codeSnippet: `.cascade-delay-3 {
  transition-delay: 150ms;
}`
  },
  {
    name: "animation",
    category: "media",
    description: "Propriété raccourcie permettant d'attacher une chorégraphie complexe @keyframes à un élément.",
    usage: "Idéal pour concevoir des loaders en continu ou des pulsations douces en arrière-plan.",
    donts: "Désactivez ou limitez ces animations pour les utilisateurs ayant activé l'option d'accessibilité @media (prefers-reduced-motion) !",
    codeSnippet: `.loader-spinner {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}`
  },
  {
    name: "filter",
    category: "media",
    description: "Applique des effets visuels graphiques (flou, noir et blanc, contraste, teinte) sur un élément.",
    usage: "Pour flouter dynamiquement des décors d'arrière-plan ou ajuster des variations de couleur d'images au repos.",
    donts: "Ces filtres sont extrêmement gourmands en ressources de carte graphique pour le navigateur si appliqués sans retenue.",
    codeSnippet: `.grayscale-logo {
  filter: grayscale(100%);
  transition: filter 0.3s;
}
.grayscale-logo:hover {
  filter: grayscale(0%);
}`
  },
  {
    name: "backdrop-filter",
    category: "media",
    description: "Applique des filtres graphiques (comme le flou) à toute la zone située derrière l'élément.",
    usage: "La clé absolue de l'effet de verre dépoli ('Glassmorphism') moderne très élégant.",
    donts: "Ne fonctionnera pas si l'élément n'a pas à la fois une couleur d'arrière-plan translucide (rgba) et une opacité modérée.",
    codeSnippet: `.frosted-header {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
}`
  },
  {
    name: "mix-blend-mode",
    category: "media",
    description: "Régit la fusion de couleur entre un élément graphique et les décors empilés sous lui.",
    usage: "Très créatif pour incruster des écritures textuelles blanches sur des images contrastées ou inverser les teintes AU-DELÀ des limites classiques.",
    donts: "N'espérez pas un support homogène parfait sur de très vieux navigateurs obsolètes.",
    codeSnippet: `.blended-text {
  mix-blend-mode: difference;
}`
  },
  {
    name: "cursor",
    category: "interactive",
    description: "Spécifie la forme visuelle du pointeur de la souris lors du survol de l'élément.",
    usage: "Réglez-le sur 'pointer' pour signaler sans ambiguïté les éléments cliquables comme des listes ou des boutons personnalisés.",
    donts: "Évitez de changer arbitrairement le curseur en formes inhabituelles sur le corps de texte.",
    codeSnippet: `.clickable-row {
  cursor: pointer;
}`
  },
  {
    name: "pointer-events",
    category: "interactive",
    description: "Configure les circonstances d'interception des clics ou touchés sur l'élément (ex: none, auto).",
    usage: "Réglez-le sur 'none' pour rendre un icone ou un calque inerte vis-à-vis des clics afin que l'élément positionné dessous puisse être cliqué normalement.",
    donts: "N'oubliez pas d'utiliser 'none' sur les états d'attente de soumission pour prémunir votre formulaire de soumissions multiples accidentelles.",
    codeSnippet: `.inert-icon {
  pointer-events: none;
}`
  },
  {
    name: "user-select",
    category: "interactive",
    description: "Contrôle la capacité de l'utilisateur à surligner et copier du texte sur l'élément (none, text, all).",
    usage: "Sécurisez et facilitez l'interaction en posant user-select: none sur des icônes ou des boutons que les utilisateurs cliquent de manière répétée.",
    donts: "N'interdisez jamais la copie (none) sur de vrais articles d'apprentissage ou des codes, ce qui frustre inutilement l'utilisateur.",
    codeSnippet: `.tab-navigation-item {
  user-select: none;
}`
  },
  {
    name: "scroll-behavior",
    category: "interactive",
    description: "Configure le type de défilement fluide ou instantané lors de la navigation via des ancres ou des liens de défilement.",
    usage: "Mettez 'smooth' sur l'élément racine HTML pour obtenir des transitions de défilement magnifiques et gratuites sans Javascript.",
    donts: "Peut interférer avec le focus d'accessibilité sur certains anciens lecteurs d'écran.",
    codeSnippet: `html {
  scroll-behavior: smooth;
}`
  },
  {
    name: "outline",
    category: "interactive",
    description: "Dessine une ligne de délimitation extérieure tout autour d'un élément (très différent du border car il ne prend aucun espace géométrique).",
    usage: "Indispensable pour l'accessibilité ! L'outline par défaut au focus tabulaire signale où se trouve le focus de l'utilisateur.",
    donts: "Ne retirez JAMAIS l'outline de focus (:focus { outline: none; }) sans proposer d'alternative visuelle de focus équivalente à l'écran !",
    codeSnippet: `.custom-focus-element:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}`
  },
  {
    name: "outline-offset",
    category: "interactive",
    description: "Définit l'espacement physique vide entre la bordure d'un élément et son outline d'accessibilité de focus.",
    usage: "Idéal pour aérer l'indicateur de focus et donner un rendu résolument moderne aux boutons au clavier.",
    donts: "N'a d'effet que s'il y a un outline actif.",
    codeSnippet: `.accessible-link:focus {
  outline: 2px dashed #9333ea;
  outline-offset: 4px;
}`
  },
  {
    name: "text-overflow",
    category: "inline",
    description: "Contrôle le format d'abréviation visuelle des chaînes textuelles trop longues débordant de leur limites horizontales.",
    usage: "La valeur 'ellipsis' tronque élégamment le texte en ajoutant des points de suspension ('...').",
    donts: "Ne fonctionnera jamais si vous n'ajoutez pas simultanément l'overflow: hidden et le white-space: nowrap sur l'élément !",
    codeSnippet: `.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`
  },
  {
    name: "white-space",
    category: "inline",
    description: "Régit le retour à la ligne automatique des espaces vides visibles.",
    usage: "Utilisez 'nowrap' pour empêcher un texte court ou une étiquette de se couper inesthétiquement en deux.",
    donts: "Privilégiez le retour normal si la largeur de votre composant est restreinte.",
    codeSnippet: `.no-wrap-label {
  white-space: nowrap;
}`
  },
  {
    name: "word-break",
    category: "inline",
    description: "Spécifie les circonstances de césure forcée à l'intérieur des mots complexes.",
    usage: "Utilisez 'break-word' ou 'break-all' pour éviter l'explosion hors-gabarit de votre design causée par de longs liens URL non espacés.",
    donts: "Ne l'appliquez pas sur des textes littéraires traditionnels sous peine de rendre la compréhension difficile.",
    codeSnippet: `.comment-text {
  word-break: break-word;
}`
  },
  {
    name: "float",
    category: "inline",
    description: "Définit le flottement directionnel d'un élément à l'intérieur de son bloc parent.",
    usage: "Idéal pour poser une image d'illustration à droite ou à gauche de façon que le texte de lecture s'articule tout autour.",
    donts: "N'agencez jamais vos divisions globales d'interfaces ou colonnes avec les floats ! C'est une technique obsolète, utilisez flex et grid.",
    codeSnippet: `.decorative-illustration {
  float: right;
  margin-left: 16px;
}`
  },
  {
    name: "clear",
    category: "inline",
    description: "Interdit à un bloc d'habiter à côté d'éléments flottants (gauche, droite ou deux à la fois).",
    usage: "Sert à repositionner une signature ou un titre de séparation en dessous de photos flottantes pré-existantes.",
    donts: "Moins requis depuis l'essor des contextes de formatage modernes.",
    codeSnippet: `.separator-line {
  clear: both;
}`
  },
  {
    name: "vertical-align",
    category: "inline",
    description: "Aligne l'assise verticale des inline et inline-block vis-à-vis des lignes d'écritures.",
    usage: "Idéal pour réaligner un petit icône vectoriel à côté d'un texte d'en-tête via 'vertical-align: middle'.",
    donts: "N'essayez pas de l'employer sur des éléments en bloc ou flexbox, cela n'aura aucun impact.",
    codeSnippet: `.middle-icon {
  vertical-align: middle;
}`
  },
  {
    name: "resize",
    category: "interactive",
    description: "Contrôle les facultés d'étirement manuel offert à l'utilisateur sur une boîte (ex: zone de texte <textarea>).",
    usage: "Réglez-le sur 'vertical' pour autoriser l'utilisateur à dérouler en hauteur l'espace d'écriture sans altérer la largeur de votre formulaire.",
    donts: "Évitez de le désactiver complètement si l'utilisateur a de grands paragraphes à formuler.",
    codeSnippet: `textarea {
  resize: vertical;
}`
  },
  {
    name: "list-style",
    category: "inline",
    description: "Propriété raccourcie pour gérer la puce decorative de vos listes à puces.",
    usage: "Utilisez 'list-style: none' pour retirer le gros point noir classique des listes non-ordonnées de vos barres de menus.",
    donts: "Si vous supprimez les puces visuelles, assurez-vous de l'alignement de la marge intérieure gauche de vos items.",
    codeSnippet: `.clean-menu-list {
  list-style: none;
  padding-left: 0;
}`
  },
  {
    name: "border-collapse",
    category: "inline",
    description: "Indique si les bordures des cellules de tableaux fusionnent en une seule ligne ou restent séparées.",
    usage: "Réglez de fait sur 'collapse' pour dessiner de superbes grilles de tableaux de bord propres.",
    donts: "La valeur par défaut est 'separate', ce qui crée d'horribles doubles lignes de bordures.",
    codeSnippet: `table {
  border-collapse: collapse;
}`
  },
  {
    name: "accent-color",
    category: "interactive",
    description: "Permet de modifier instantanément la couleur thématique de focus des boutons radios, checkboxes ou sélecteurs natifs.",
    usage: "La façon moderne et élégante d'harmoniser ses cases à cocher aux couleurs de votre logo.",
    donts: "Ne requiert aucun hack complexe et est extrêmement compatible.",
    codeSnippet: `input[type="checkbox"] {
  accent-color: #9333ea;
}`
  },
  {
    name: "caret-color",
    category: "interactive",
    description: "Définit la couleur du curseur de texte clignotant dans vos saisies de formulaires.",
    usage: "Pour harmoniser l'immersion visuelle lors de la saisie utilisateur.",
    donts: "Assurez-vous qu'elle reste contrastée par rapport au fond d'écriture.",
    codeSnippet: `.search-input-fancy {
  caret-color: #4f46e5;
}`
  },
  {
    name: "scroll-padding",
    category: "interactive",
    description: "Alloue une marge d'espacement de défilement protectrice tout en haut ou sur les côtés de la zone de scroll.",
    usage: "Idéal pour éviter que les ancres HTML automatiques ne cachent la moitié du titre d'intitulé sous une barre de navigation collante.",
    donts: "Doit être configuré sur le conteneur de défilement (ex: html).",
    codeSnippet: `html {
  scroll-padding-top: 80px; /* Laisse de la place pour le header fixe */
}`
  },
  {
    name: "will-change",
    category: "media",
    description: "Informe par avance le moteur du navigateur des futures propriétés qui vont subir de lourdes transformations accélérées matériellement.",
    usage: "Permet d'éliminer les micro-saccades de rendu graphique sur de complexes animations 3D.",
    donts: "Ne l'utilisez jamais de manière préventive ou sur trop d'éléments, cela dégraderait gravement les ressources système CPU/GPU !",
    codeSnippet: `.heavy-3d-card {
  will-change: transform, opacity;
}`
  },
  {
    name: "top",
    category: "structure",
    description: "Définit le décalage vertical supérieur pour les éléments positionnés (relative, absolute, fixed, sticky).",
    usage: "Utilisez top: 0 pour coller un en-tête fixe en haut de la fenêtre utilisateur.",
    donts: "N'a aucun effet sur les éléments dont la valeur de position est 'static' (comportement par défaut).",
    codeSnippet: `.sticky-top-bar {
  position: sticky;
  top: 0;
}`
  },
  {
    name: "left",
    category: "structure",
    description: "Définit le décalage horizontal gauche appliqué aux éléments positionnés.",
    usage: "Pour cadrer et positionner précisément des volets coulissants latéraux à gauche de l'écran.",
    donts: "N'a aucun effet s'il est utilisé sur un élément de position par défaut statique.",
    codeSnippet: `.sidebar-absolute {
  position: absolute;
  left: 0;
  width: 280px;
}`
  },
  {
    name: "bottom",
    category: "structure",
    description: "Définit le décalage vertical inférieur requis pour le positionnement d'autres éléments.",
    usage: "Idéal pour verrouiller un élément de copyright ou bouton d'assistance flottant tout en bas.",
    donts: "Vérifiez que le parent de référence direct de l'élément absolu est muni d'une position 'relative'.",
    codeSnippet: `.live-chat-bubble {
  position: fixed;
  bottom: 24px;
  right: 24px;
}`
  },
  {
    name: "right",
    category: "structure",
    description: "Configure le décalage horizontal droit alloué aux éléments positionnés.",
    usage: "Sert à déporter des éléments d'icônes de fermetures de panneaux modales dans le coin supérieur opposé.",
    donts: "Assurez-vous de ne pas confondre avec le positionnement normal de texte.",
    codeSnippet: `.close-button-top {
  position: absolute;
  top: 16px;
  right: 16px;
}`
  },
  {
    name: "overflow-x",
    category: "structure",
    description: "Contrôle précisément le débordement de contenu uniquement sur l'axe horizontal.",
    usage: "Mettez 'auto' sur un conteneur de tableau pour l'autoriser à glisser horizontalement sur mobile sans déformer le reste du site.",
    donts: "Évitez la valeur 'hidden' si elle risque de tronquer sauvagement des données utiles de formulaires complexes.",
    codeSnippet: `.table-responsive-wrapper {
  overflow-x: auto;
}`
  },
  {
    name: "overflow-y",
    category: "structure",
    description: "Spécifie précisément le débordement de contenu uniquement sur l'axe vertical.",
    usage: "Idéal pour limiter la hauteur d'un journal de modifications ou liste de chats et y forcer un scroll interne fluide.",
    donts: "Évitez d'avoir deux barres de défilement imbriquées l'une dans l'autre (ex: body scroll + card scroll), peu ergonomiques.",
    codeSnippet: `.notifications-dropdown-list {
  max-height: 400px;
  overflow-y: auto;
}`
  },
  {
    name: "max-height",
    category: "structure",
    description: "Définit la hauteur physique maximale limite qu'un conteneur peut atteindre.",
    usage: "Utile pour concevoir des volets d'accordéons pliables qui s'étendent dynamiquement.",
    donts: "Évitez d'utiliser des pourcentages instables si le parent n'a pas de dimensions verticales fixes et déclarées.",
    codeSnippet: `.accordion-content-box {
  max-height: 500px;
  overflow: hidden;
}`
  },
  {
    name: "min-height",
    category: "structure",
    description: "Définit la hauteur minimale garantie applicable aux boîtes structurelles.",
    usage: "Idéal sur le conteneur principal afin que votre footer ne remonte pas inesthétiquement au milieu de l'écran sur les pages vides.",
    donts: "Préférable à 'height' sur les boîtes d'informations éditables afin d'éviter les débordements de textes.",
    codeSnippet: `.main-page-wrapper {
  min-height: 100vh;
}`
  },
  {
    name: "margin-top",
    category: "structure",
    description: "Configure l'épaisseur de la marge extérieure de dégagement située au-dessus de l'élément.",
    usage: "Permet d'ajouter une distance d'air supérieure propre.",
    donts: "Soyez attentif au phénomène de 'fusion des marges' verticales (margin collapse) natif en CSS entre frères.",
    codeSnippet: `.sub-block {
  margin-top: 32px;
}`
  },
  {
    name: "margin-bottom",
    category: "structure",
    description: "Spécifie l'espace extérieur de dégagement libre sous l'élément ciblé.",
    usage: "Idéal pour distancer proprement des paragraphes consécutifs de lecture.",
    donts: "Remplacez par le 'gap' d'un parent flex/grid si c'est pour l'agencement d'éléments d'une liste régulière.",
    codeSnippet: `.paragraph-spacing {
  margin-bottom: 1.5rem;
}`
  },
  {
    name: "padding-top",
    category: "structure",
    description: "Définit l'espacement intérieur supérieur de l'élément.",
    usage: "Pour créer une zone de respiration interne élégante en haut d'une section.",
    donts: "Ne l'utilisez pas à la place de margin-top pour distancer deux éléments indépendants.",
    codeSnippet: `.hero-content-padding {
  padding-top: 64px;
}`
  },
  {
    name: "padding-bottom",
    category: "structure",
    description: "Définit l'espacement intérieur inférieur de l'élément.",
    usage: "Idéal pour aérer le bas d'un bloc de contenu ou d'une carte.",
    donts: "Assurez-vous d'avoir configuré le box-sizing sur border-box pour simplifier le calcul des dimensions globales.",
    codeSnippet: `.card-footer-padding {
  padding-bottom: 24px;
}`
  },
  {
    name: "border-width",
    category: "content",
    description: "Définit l'épaisseur géométrique des bordures périphériques.",
    usage: "Utilisez de fines épaisseurs de 1px ou 2px pour un aspect raffiné.",
    donts: "N'a d'effet visuel réel que si un style de bordure (border-style) a été déclaré.",
    codeSnippet: `.subtle-border {
  border-width: 1px;
  border-style: solid;
}`
  },
  {
    name: "border-style",
    category: "content",
    description: "Spécifie le type de tracé pour les bordures (none, solid, dashed, dotted, double).",
    usage: "Utilisez 'dashed' pour suggérer des zones de glisser-déposer de fichiers ou des coupons à découper.",
    donts: "La valeur par défaut est 'none', ce qui invisibilise toute bordure par défaut.",
    codeSnippet: `.dropzone-area {
  border-style: dashed;
  border-width: 2px;
}`
  },
  {
    name: "border-color",
    category: "content",
    description: "Définit la couleur ou la teinte thématique des bordures périphériques.",
    usage: "Permet de modifier dynamiquement la couleur de focus ou d'erreur sur un champ textuel.",
    donts: "Vérifiez la cohérence esthétique et ergonomique avec la palette graphique de votre projet.",
    codeSnippet: `.input-error {
  border-color: #ef4444; /* Rouge d'alerte */
}`
  },
  {
    name: "border-top",
    category: "content",
    description: "Propriété raccourcie pour déclarer la bordure supérieure uniquement (style, épaisseur, teinte).",
    usage: "Idéal pour dessiner une fine ligne de séparation élégante tout en haut d'un pied de page ou bloc d'auteur.",
    donts: "Ne s'applique qu'au bord supérieur de la boîte d'affichage.",
    codeSnippet: `.footer-block {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}`
  },
  {
    name: "border-bottom",
    category: "content",
    description: "Propriété raccourcie dessinant la bordure inférieure uniquement.",
    usage: "Idéal pour des liens de navigation élégamment soulignés au survol ou des entêtes de tableaux de bord.",
    donts: "Évitez d'encombrer chaque ligne de texte avec des bordures trop voyantes.",
    codeSnippet: `.table-header {
  border-bottom: 2px solid #e2e8f0;
}`
  },
  {
    name: "text-indent",
    category: "inline",
    description: "Définit le retrait ou l'alinéa de la première ligne d'un texte littéraire.",
    usage: "Pour créer des mises en page de textes éditoriaux élégants très soignés.",
    donts: "Évitez sur les listes à puces ou les textes d'interfaces simples.",
    codeSnippet: `.book-text {
  text-indent: 1.5rem;
}`
  },
  {
    name: "word-spacing",
    category: "inline",
    description: "Ajuste l'espacement horizontal situé spécifiquement entre deux mots consécutifs.",
    usage: "Permet d'ouvrir la respiration d'une grande ligne d'accroche de page d'accueil.",
    donts: "Ne l'augmentez pas trop pour ne pas déséquilibrer la lecture fluide de l'œil.",
    codeSnippet: `.wide-text-hero {
      word-spacing: 0.15em;
}`
  },
  {
    name: "column-count",
    category: "inline",
    description: "Divise automatiquement le contenu textuel d'un parent en plusieurs colonnes de lecture continues parallèles.",
    usage: "Parfait pour concevoir des articles de presse, des guides ou des listes d'index denses sans devoir faire de découpes géométriques compliquées.",
    donts: "Faites attention à ce que la hauteur des colonnes reste confortable pour la lecture sur mobile.",
    codeSnippet: `.news-article-columns {
  column-count: 3;
  column-gap: 32px;
}`
  },
  {
    name: "column-gap",
    category: "inline",
    description: "Contrôle la distance de gouttière séparatrice située entre deux colonnes d'écriture créées par column-count.",
    usage: "Pour aérer l'espace blanc de division typographique interne.",
    donts: "N'a d'effet que s'il y a un contexte multi-colonnes ou grid.",
    codeSnippet: `.index-columns {
  column-count: 2;
  column-gap: 24px;
}`
  },
  {
    name: "font-variant",
    category: "content",
    description: "Permet d'activer l'affichage des petites capitales de la police de caractères sémantique (small-caps).",
    usage: "Idéal pour formater des étiquettes ou des titres secondaires au parfum éditorial chic de style roman.",
    donts: "Toutes les polices d'écriture n'intègrent pas nativement de véritables glyphes de petites capitales.",
    codeSnippet: `.editorial-label {
  font-variant: small-caps;
  font-weight: 600;
}`
  },
  {
    name: "text-decoration-line",
    category: "content",
    description: "Nature géométrique spécifique de ligne décorative à dessiner (underline, line-through, overline).",
    usage: "Très utilisé pour tracer des lignes barrées de prix cassés dans les modules de commerce en ligne (line-through).",
    donts: "Vérifiez que la signification reste claire pour tous les types d'utilisateurs.",
    codeSnippet: `.discounted-price {
  text-decoration-line: line-through;
  color: #94a3b8;
}`
  },
  {
    name: "background-attachment",
    category: "media",
    description: "Configure l'animation d'arrière-plan de l'image (scroll classique ou fixe de type effet parallaxe).",
    usage: "Réglez-le sur 'fixed' pour immobiliser l'image de fond et générer d'élégants décrochés graphiques lors du défilement.",
    donts: "Cette valeur 'fixed' pose de sérieux problèmes de freeze de rendu et de batterie sur les navigateurs mobiles Android et iOS.",
    codeSnippet: `.parallax-section {
  background-image: url('/assets/pattern.png');
  background-attachment: fixed;
}`
  },
  {
    name: "clip-path",
    category: "media",
    description: "Permet de découper visuellement une enveloppe de forme géométrique fermée créative autour d'un bloc parent (cercles, polygones).",
    usage: "Idéal pour créer de superbes découpes en biseau ou vagues asymétriques en bas de bannières.",
    donts: "Faites attention à ce que les éléments intérieurs coupés ne soient pas tronqués de manière illisible.",
    codeSnippet: `.slanted-banner {
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}`
  },
  {
    name: "scroll-snap-type",
    category: "interactive",
    description: "Force le glissement d'un conteneur de défilement à s'aimanter de manière rigide.",
    usage: "Réglez 'x mandatory' pour créer de superbes carrousels horizontaux ou galeries de cartes s'alignant d'un seul glissement fluide.",
    donts: "N'a d'impact que si les enfants directs possèdent à leur tour un attribut scroll-snap-align compatible.",
    codeSnippet: `.carousel-snap-container {
  overflow-x: auto;
  display: flex;
  scroll-snap-type: x mandatory;
}`
  },
  {
    name: "scroll-snap-align",
    category: "interactive",
    description: "Point d'alignement physique aimanté à forcer lors du défilement assisté (start, center, end).",
    usage: "Réglez sur 'center' sur vos cartes de galeries pour qu'elles se cadrent au parfait milieu de l'écran.",
    donts: "N'a aucun effet de verrouillage si le parent n'est pas configuré en scroll-snap-type.",
    codeSnippet: `.carousel-slide-item {
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 80%;
}`
  },
  {
    name: "animation-name",
    category: "media",
    description: "Indique le nom de l'instruction d'animation @keyframes déclarée d'autorité.",
    usage: "Permet de dissocier les définitions d'animations de leur assignation.",
    donts: "Prenez garde à ce que l'orthographe corresponde exactement aux @keyframes déclarées.",
    codeSnippet: `.pulse-indicator {
  animation-name: soft-glow;
  animation-duration: 2s;
  animation-iteration-count: infinite;
}`
  },
  {
    name: "animation-duration",
    category: "media",
    description: "Définit la longueur temporelle d'exécution d'un cycle complet de l'animation chorégraphique.",
    usage: "S'exprime en secondes (s) ou millisecondes (ms), par exemple '1.2s' ou '800ms'.",
    donts: "Si la valeur est omise ou réglée à 0s, aucune animation ne se déclenchera.",
    codeSnippet: `.slow-reveal {
  animation-name: fadeIn;
  animation-duration: 1.5s;
}`
  },
  {
    name: "animation-timing-function",
    category: "media",
    description: "Régit la courbe de vélocité temporelle de l'animation keyframes.",
    usage: "Utilisez 'cubic-bezier' pour plus de naturel et d'élasticité graphique sur vos designs.",
    donts: "Bannissez les courbes saccadées inadaptées au rythme de lecture globale.",
    codeSnippet: `.slide-in-alert {
  animation-name: slideFromLeft;
  animation-duration: 500ms;
  animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}`
  },
  {
    name: "animation-delay",
    category: "media",
    description: "Temps d'attente imposé à l'élément avant que son animation ne démarre effectivement.",
    usage: "Idéal pour orchestrer des apparitions successives rythmées sans charger le javascript de timers complexe.",
    donts: "Ne l'élevez pas trop sur les éléments de navigation critiques pour l'utilisateur.",
    codeSnippet: `.delayed-item-2 {
  animation-name: popIn;
  animation-duration: 400ms;
  animation-delay: 200ms;
  animation-fill-mode: backwards;
}`
  },
  {
    name: "animation-iteration-count",
    category: "media",
    description: "Définit le nombre d'itérations ou répétitions de l'animation (nombre fixe, fraction, ou infini).",
    usage: "Utilisez le mot-clé 'infinite' pour animer des spinners de chargement sans fin.",
    donts: "Surveillez la consommation de ressources CPU par le navigateur sur les boucles infinies.",
    codeSnippet: `.rotating-loader {
  animation-name: spin;
  animation-duration: 800ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}`
  },
  {
    name: "animation-fill-mode",
    category: "media",
    description: "Définit les styles appliqués à l'élément avant que l'animation ne commence et après qu'elle se soit terminée (none, forwards, backwards, both).",
    usage: "La valeur 'forwards' est reine ! Elle force l'élément à retenir les styles de la dernière étape @keyframes de l'animation à la fin de celle-ci, lui évitant un saut visuel inesthétique de retour.",
    donts: "Utilisez 'backwards' pour propager les styles de départ de l'animation pendant la durée d'attente du delay.",
    codeSnippet: `.fading-toast {
  animation: slideFadeUp 400ms ease-out forwards;
}`
  },
  {
    name: "justify-self",
    category: "structure",
    description: "Aligne individuellement et localement l'élément lui-même sur l'axe horizontal (axe des colonnes) d'une grille.",
    usage: "Permet d'outrepasser l'alignement par défaut défini au niveau du conteneur grid (justify-items).",
    donts: "N'a aucun effet dans les conteneurs Flexbox traditionnels (utilisez des marges auto pour décaler un élément flex).",
    codeSnippet: `.badge-status-right {
  justify-self: end;
}`
  },
  {
    name: "align-self",
    category: "structure",
    description: "Configure l'alignement individuel vertical de l'élément cible le long de l'axe secondaire du parent Flexbox ou Grid.",
    usage: "Idéal pour forcer un bouton à rester aligné en bas d'une carte Flexbox au contenu étirable sans perturber le reste de la ligne.",
    donts: "Ne pas confondre avec align-items qui régit l'alignement global applicable de manière homogène à tous les enfants.",
    codeSnippet: `.bottom-fixed-button {
  align-self: flex-end;
}`
  }
];

export const JS_CONCEPTS: SemanticTag[] = JS_CONCEPTS_LIST;


export const PYTHON_CONCEPTS: SemanticTag[] = PYTHON_CONCEPTS_LIST;

export const PHP_CONCEPTS: SemanticTag[] = PHP_CONCEPTS_LIST;
