import { SemanticTag } from "../types";

export interface ConcreteUseCase {
  title: string;
  description: string;
}

const HTML_USE_CASES: Record<string, ConcreteUseCase[]> = {
  "<main>": [
    {
      title: "Zone de contenu d'un article de blog",
      description: "Idéal pour envelopper l'article principal, son corps de texte de lecture et ses images illustratives sur une page dédiée."
    },
    {
      title: "Page de profil utilisateur d'une application",
      description: "Utilisé pour délimiter le formulaire central contenant les données de compte et les préférences modifiables de l'utilisateur."
    }
  ],
  "<header>": [
    {
      title: "En-tête global de site internet",
      description: "Regroupe le logo de votre entreprise, le bandeau d'introduction, et le menu d'accès aux différentes rubriques principales."
    },
    {
      title: "En-tête d'introduction d'un article",
      description: "Contient le titre principal, les étiquettes de catégories, le nom du rédacteur et le temps estimé de lecture de l'article."
    }
  ],
  "<nav>": [
    {
      title: "Menu principal de navigation (Header Nav)",
      description: "Permet de guider les visiteurs entre l'Accueil, la liste des tutoriels, les prix des offres et le formulaire de contact."
    },
    {
      title: "Fil d'Ariane d'accessibilité (Breadcrumbs)",
      description: "Indique le chemin d'arborescence hiérarchique actuel de l'utilisateur pour l'aider à remonter d'un niveau (ex: Boutique > Électronique > Téléphones)."
    }
  ],
  "<section>": [
    {
      title: "Zone de témoignages clients satisfaits",
      description: "Regroupe et thématise plusieurs avis d'utilisateurs sur votre outil avec son propre titre d'en-tête (ex: 'Ce que pensent nos clients')."
    },
    {
      title: "Présentation des fonctionnalités d'un SaaS",
      description: "Isole chaque bloc de promesse ergonomique ou technique du site au sein d'une page vitrine."
    }
  ],
  "<article>": [
    {
      title: "Carte de produit e-commerce",
      description: "Idéal pour envelopper chaque produit d'une grille e-commerce, permettant à la carte d'être copiée ou distribuée de manière autonome."
    },
    {
      title: "Commentaire d'utilisateur ou avis de forum",
      description: "Chaque réponse utilisateur sous un post possède sa propre autonomie éditoriale et sémantique."
    }
  ],
  "<aside>": [
    {
      title: "Barre de suggestions d'articles connexes",
      description: "Placée sur le flanc droit d'un blog de lecture, à côté du contenu principal de l'article, pour proposer des lectures similaires."
    },
    {
      title: "Encadré lexical ou lexique terminologique",
      description: "Met de côté une définition d'un acronyme complexe utilisé dans le texte principal sans couper le fil de la lecture."
    }
  ],
  "<footer>": [
    {
      title: "Pied de page institutionnel de site (Global Footer)",
      description: "Contient les liens vers la politique de confidentialité, les mentions légales du développeur, et les boutons de réseaux sociaux."
    },
    {
      title: "Pied d'un volet d'évaluation d'un article",
      description: "Ferme une carte de blog en affichant l'âge de l'article, le nombre de likes d'abonnés et le bouton d'inscription à l'infolettre."
    }
  ],
  "<figure> & <figcaption>": [
    {
      title: "Image explicative avec descriptif",
      description: "Associe une infographie ou un schéma d'architecture logicielle avec sa légende de description technique placée directement au-dessous d'elle."
    },
    {
      title: "Code source illustratif dans un cours",
      description: "Enveloppe le morceau de code source et utilise le figcaption pour labelliser sa fonction (ex: 'Exemple 1.2 : Configuration d'un port d'écoute Express')."
    }
  ],
  "<time>": [
    {
      title: "Date d'une mise à jour de document",
      description: "Indique de façon machine-lisible l'instant exact de validation afin d'aider les robots de moteurs de recherche à indexer la fraîcheur de l'article."
    },
    {
      title: "Date et lieu d'un événement d'agenda",
      description: "Permet d'encoder proprement chaque créneau horaire dans un calendrier ou planificateur hebdomadaire."
    }
  ],
  "<mark>": [
    {
      title: "Mise en avant des termes de recherche",
      description: "Surligne en couleur les lettres et mots recherchés par l'utilisateur lorsqu'il filtre dynamiquement un tableau."
    },
    {
      title: "Ressortir un avertissement capital",
      description: "Attire l'attention de l'œil sur une phrase directive clé dans de longs termes juridiques de vente."
    }
  ],
  "<details> & <summary>": [
    {
      title: "Foire Aux Questions extensible (FAQ Accordion)",
      description: "Affiche une question claire dans le sommaire et le texte complet de réponse à l'intérieur du détails, masqué tant que l'utilisateur ne clique pas."
    },
    {
      title: "Rapports d'alertes détaillés de débogage",
      description: "Masque l'impressionnante liste de logs bruts d'erreurs d'un serveur sous un en-tête épuré et rassurant pour le grand public."
    }
  ],
  "<dialog>": [
    {
      title: "Fenêtre modale d'alerte de déconnexion",
      description: "Ouvre un pop-up d'invitation central assombrissant le fond pour valider si oui ou non l'on souhaite quitter le tableau de bord."
    },
    {
      title: "Formulaire d'inscription instantané",
      description: "S'affiche au milieu de la navigation sans nécessiter de redirection d'adresse de page web pour l'utilisateur."
    }
  ],
  "<progress>": [
    {
      title: "Jauge de progression d'une inscription multi-étapes",
      description: "Aide visuellement l'utilisateur à savoir qu'il a franchi '60% du formulaire' d'abonnement au service de formation."
    },
    {
      title: "Analyse d'espace de stockage consommé",
      description: "Affiche le remplissage ou d'occupation matérielle d'un disque système sur un outil d'administration de serveurs."
    }
  ]
};

const CSS_USE_CASES_SPECIFIC: Record<string, ConcreteUseCase[]> = {
  "display": [
    {
      title: "Structure de barre de menus fluide",
      description: "Configurer 'display: flex' pour aligner côte à côte les liens d'onglets de votre en-tête horizontalement et uniformément."
    },
    {
      title: "Menu de profil escamotable",
      description: "Appliquer 'display: none' par défaut, puis le changer en 'display: block' en JavaScript pour révéler le menu quand l'utilisateur clique."
    }
  ],
  "position": [
    {
      title: "Indicateur rouge de messages en attente",
      description: "Positionner un petit badge en 'absolute' dans le coin supérieur droit d'une icône de messagerie qui est réglée en 'relative'."
    },
    {
      title: "En-tête de page figé lors du scroll",
      description: "Déclarer 'position: fixed' (ou sticky) sur l'en-tête du site afin qu'il reste ancré aux yeux de l'internaute lorsqu'il descend sur la page."
    }
  ],
  "flex": [
    {
      title: "Zone d'écriture de formulaire extensible",
      description: "Donner la valeur 'flex: 1' à l'élément de texte à côté d'un bouton fixe pour lui ordonner d'occuper tout l'espace d'écran disponible."
    },
    {
      title: "Grille de cartes de blog élastiques",
      description: "Utiliser 'flex: 1 1 300px' pour que vos résumés d'articles de blog s'allongent équitablement sur chaque bande horizontale."
    }
  ],
  "grid": [
    {
      title: "Conception de galerie de photos (Bento Grid)",
      description: "Bâtir des cellules asymétriques d'images de différentes dimensions alignées sur 3 colonnes horizontales et verticales complexes."
    },
    {
      title: "Tableau de bord multi-widgets moderne",
      description: "Configurer des aires d'affichage étiquetées de widgets de statistiques et graphiques qui se réorganisent intuitivement selon les écrans."
    }
  ],
  "gap": [
    {
      title: "Espacement uniforme de boutons d'action",
      description: "Ajouter 'gap: 12px' sur le conteneur flex de boutons (Annuler, Valider) pour obtenir d'un coup un écart parfait sans marge dissymétrique."
    },
    {
      title: "Grille d'images aérée",
      description: "Plutôt que d'appliquer des marges à chaque illustration, régler 'gap: 16px' dans la grille CSS parent pour gérer l'aération de manière isolée."
    }
  ],
  "margin": [
    {
      title: "Centrer horizontalement une boîte de connexion",
      description: "Indiquer une largeur fixe de carte et lui poser 'margin-left: auto; margin-right: auto;' pour la caler proprement au centre de la page."
    },
    {
      title: "Éviter les collisions de texte",
      description: "Appliquer 'margin-bottom: 24px' sous chaque titre d'article pour laisser respirer la première phrase du lecteur."
    }
  ],
  "padding": [
    {
      title: "Zone de clic confortable pour boutons",
      description: "Donner 'padding: 12px 24px' à un bouton pour augmenter sa surface tactile réactive, ce qui facilite grandement l'interaction sur mobile."
    },
    {
      title: "Créer une marge interne d'écriture",
      description: "Définir 'padding: 16px' à l'intérieur d'un encart de documentation pour que le texte ne se rapproche pas des rebords."
    }
  ],
  "width": [
    {
      title: "Champs de formulaires étirés à 100%",
      description: "Forcer les cadres de saisie d'adresses e-mail à s'adapter sans défaut à l'entière largeur disponible du formulaire sur tablette."
    }
  ],
  "height": [
    {
      title: "Page d'intro ensorcelante (Full Screen)",
      description: "Fixer 'height: 100vh' ou 'min-height: 100vh' sur votre bannière d'ouverture pour qu'elle enveloppe entièrement l'écran d'affichage."
    }
  ],
  "max-width": [
    {
      title: "Garantir le responsive des images du site",
      description: "Poser 'max-width: 100%' et 'height: auto' globalement pour empêcher vos visuels HD d'excéder des dimensions du smartphone."
    },
    {
      title: "Limiter la longueur de lecture de texte",
      description: "Configurer 'max-width: 65ch' sur vos articles de blog, car les yeux ont des difficultés à lire des lignes d'écriture trop larges."
    }
  ],
  "min-width": [
    {
      title: "Éviter qu'un bouton d'action ne s'écrase",
      description: "Régler 'min-width: 140px' sur un bouton de validation pour qu'il conserve un aspect visuel majestueux même si son libellé est court."
    }
  ],
  "box-sizing": [
    {
      title: "Calcul dimensionnel universel sans tracas",
      description: "Appliquer 'box-sizing: border-box' sur tous les éléments (*) pour inclure le padding et les bordures dans l'épaisseur globale configurée."
    }
  ],
  "z-index": [
    {
      title: "Maintenir le menu par-dessus des galeries",
      description: "Donner un 'z-index: 50' à votre barre de navigation sticky pour s'assurer que les visuels animés de la page ne glissent pas par-dessus elle."
    },
    {
      title: "Écran de chargement d'application au premier plan",
      description: "Créer un panneau opaque monté d'un spinner réglé à 'z-index: 9999' pour interdire toute interaction sur le site lors du rechargement."
    }
  ],
  "overflow": [
    {
      title: "Défiler des tableaux de données volumineux",
      description: "Intégrer le tableau dans un calque réglé en 'overflow-x: auto' pour permettre son glissement latéral fluide sur mobile sans distordre le site."
    },
    {
      title: "Masquer les effets de découpe géométrique",
      description: "Définir 'overflow: hidden' sur un bloc parent pour masquer tout élément décoratif d'arrière-plan sortant des limites de la courbe d'arrondi."
    }
  ],
  "border-radius": [
    {
      title: "Créer un badge rond d'utilisateur",
      description: "Sur une photo de dimension carrée parfaite (1:1), assigner 'border-radius: 9999px' pour la transformer en un cercle instantanément."
    }
  ],
  "box-shadow": [
    {
      title: "Sensation d'élévation sur les boutons",
      description: "Créer un ombrage subtil et très transparent 'box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05)' pour donner du relief tactile à vos fiches."
    }
  ],
  "transition": [
    {
      title: "Survol ultra-doux de boutons",
      description: "Configurer 'transition: background-color 0.2s ease-out' pour estomper gracieusement le changement de couleur au survol de la souris."
    }
  ],
  "cursor": [
    {
      title: "Confirmer la nature cliquable d'une carte",
      description: "Appliquer 'cursor: pointer' sur de larges fiches de témoignages interactives pour annoncer qu'un clic ouvrira un panneau d'évaluation."
    }
  ]
};

export function getConcreteUseCases(tag: SemanticTag, selectedLanguage: string): ConcreteUseCase[] {
  const tagName = tag.name.toLowerCase().trim();

  // 1. Try language-specific mappings
  if (selectedLanguage === "HTML5" && HTML_USE_CASES[tag.name]) {
    return HTML_USE_CASES[tag.name];
  }

  // 2. Try clean matching of exact properties
  if (selectedLanguage === "CSS") {
    // Check direct match
    if (CSS_USE_CASES_SPECIFIC[tagName]) {
      return CSS_USE_CASES_SPECIFIC[tagName];
    }
    // Check partial contains match
    const foundKey = Object.keys(CSS_USE_CASES_SPECIFIC).find(key => tagName.includes(key));
    if (foundKey && CSS_USE_CASES_SPECIFIC[foundKey]) {
      return CSS_USE_CASES_SPECIFIC[foundKey];
    }
  }

  // 3. Robust Category-based smart fallback generators
  const baseName = tag.name.replace(/[<>]/g, "");
  
  if (selectedLanguage === "JavaScript" || selectedLanguage === "Python" || selectedLanguage === "PHP") {
    return [
      {
        title: `Résolution pratique avec "${baseName}"`,
        description: `Indispensable pour structurer vos algorithmes de production, manipuler les flux de données dynamiques ou optimiser la logique générale de votre projet en ${selectedLanguage}.`
      },
      {
        title: `Règle de l'art et architecture propre`,
        description: `Assure la maintenabilité, évite les effets de bord indésirables et favorise un code asynchrone hautement performant en exploitant "${baseName}".`
      }
    ];
  }

  if (selectedLanguage === "HTML5") {
    return [
      {
        title: `Structurer un composant de type "${baseName}"`,
        description: `Permet de baliser de façon sémantique et propre vos éléments de catégorie "${tag.category}" pour un meilleur référencement SEO.`
      },
      {
        title: `Améliorer l'accessibilité écran (A11y)`,
        description: `Aide les logiciels de synthèses vocales pour malvoyants à localiser immédiatement le rôle fonctionnel de votre bloc "${baseName}".`
      }
    ];
  }

  // CSS structure or concepts fallbacks
  if (tag.category === "structure") {
    return [
      {
        title: `Mise en page fluide de type "${baseName}"`,
        description: `Sert à agencer les boîtes, ajuster la réactivité ou calibrer les écarts géométriques réactifs de vos blocs parents de site.`
      },
      {
        title: `Aération et alignements sur écran mobile`,
        description: `Garantit que la disposition des sections s'adapte sans encombre de manière esthétique sur les écrans étroits de smartphones.`
      }
    ];
  } else if (tag.category === "content" || tag.category === "inline") {
    return [
      {
        title: `Ajustement visuel de l'élément "${baseName}"`,
        description: `Permet d'harmoniser le design thématique de votre texte ou arrière-plan pour un niveau de lecture à la fois clair et engageant.`
      },
      {
        title: "Optimisation de la hiérarchie optique",
        description: `Accompagne l'utilisateur en orientant son regard vers les données essentielles de vos blocs de cartes.`
      }
    ];
  } else if (tag.category === "media") {
    return [
      {
        title: `Habillage graphique de type "${baseName}"`,
        description: `Donne du relief aux visuels clés, gère l'image de marque ou ajoute des filtres élégants d'immersion visuelle.`
      },
      {
        title: "Animations et douceur de transition",
        description: `Assure une excellente transition de valeurs lors des variations interactives déclenchées par l'internaute.`
      }
    ];
  } else {
    // Interactive or anything else
    return [
      {
        title: `Guidage d'utilisation sur la propriété "${baseName}"`,
        description: `Participe activement à guider l'action de l'utilisateur final en fournissant une perception claire de rétroaction de clic.`
      },
      {
        title: "Personnalisation fonctionnelle de l'interface",
        description: "Aligne l'expérience d'utilisation native aux codes de couleurs de votre charte graphique informatique."
      }
    ];
  }
}
