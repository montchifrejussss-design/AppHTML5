import { SemanticTag } from "./types";

export const PYTHON_CONCEPTS_LIST: SemanticTag[] = [
  {
    name: "def & return",
    category: "structure",
    description: "Méthode standard de déclaration de fonctions réutilisables.",
    usage: "Pour découper votre logique en modules autonomes et renvoyer proprement des résultats.",
    donts: "N'oubliez pas que l'indentation de 4 espaces est obligatoire sous peine de générer un IndentationError.",
    codeSnippet: `def calculer_tva(prix_ht, taux=0.20):
    return prix_ht * (1 + taux)

prix_ttc = calculer_tva(100)`
  },
  {
    name: "List Comprehension",
    category: "content",
    description: "Écriture condensée pour instancier des listes à la volée de façon performante et lisible.",
    usage: "Idéal pour filtrer ou modifier une collection d'un seul geste.",
    donts: "N'écrivez pas de list comprehensions trop longues avec de nombreuses conditions imbriquées; cela nuit à la lisibilité.",
    codeSnippet: `nombres = [1, 2, 3, 4, 5]
carres_pairs = [x**2 for x in nombres if x % 2 == 0]
# Résultat: [4, 16]`
  },
  {
    name: "Dict Comprehension",
    category: "content",
    description: "Génération rapide et optimisée d'un dictionnaire à partir d'itérables.",
    usage: "Parfait pour mapper des clés de configurations ou inverser un dictionnaire [clé: valeur].",
    donts: "Évitez les effets de bord au cours de la création des paires clés-valeurs.",
    codeSnippet: `produits = ["PC", "Clavier", "Souris"]
stocks = {p: 0 for p in produits}
# Résultat: {'PC': 0, 'Clavier': 0, 'Souris': 0}`
  },
  {
    name: "Lambda Functions",
    category: "structure",
    description: "Petites fonctions anonymes définies sur une seule ligne.",
    usage: "Très commodes lorsqu'il s'agit de passer un tri rapide ou un filtre court à un composant tiers.",
    donts: "N'assignez pas une lambda à un nom permanent (ex: f = lambda x: x); préférez 'def' pour les fonctions nommées.",
    codeSnippet: `points = [(1, 2), (3, 1), (5, 10)]
# Tri basé sur le deuxième élément du tuple
points_tries = sorted(points, key=lambda p: p[1])`
  },
  {
    name: "Decorators (@decorator)",
    category: "structure",
    description: "Mécanique élégante permettant d'envelopper une fonction pour modifier ou enrichir son comportement sans réécrire son code interne.",
    usage: "Idéal pour valider des droits d'accès, mesurer le temps d'exécution, ou mettre en cache des valeurs de fonctions.",
    donts: "Pensez à appeler functools.wraps pour préserver les métadonnées (le nom et la docstring) de la fonction d'origine.",
    codeSnippet: `def logger(fonction):
    def wrapper(*args, **kwargs):
        print(f"Exécution de : {fonction.__name__}")
        return fonction(*args, **kwargs)
    return wrapper

@logger
def demarrer_serveur():
    pass`
  },
  {
    name: "Context Managers (with)",
    category: "interactive",
    description: "Garantit la libération automatique des ressources système (fichiers, bases de données, verrous) quoi qu'il arrive.",
    usage: "La seule syntaxe acceptable pour ouvrir, modifier et fermer des fichiers sans risque de fuite de descripteurs.",
    donts: "Ne manipulez jamais de fichiers avec open() sans y apposer de bloc 'with'.",
    codeSnippet: `with open("rapport.txt", "w", encoding="utf-8") as f:
    f.write("Analyse complétée avec succès.")
# Le fichier est automatiquement fermé ici`
  },
  {
    name: "f-Strings (Formatted Strings)",
    category: "content",
    description: "Interpolation dynamique, rapide et extrêmement lisible de variables directement dans du texte.",
    usage: "Prend en charge les calculs directs, les formatages de décimales (ex: .2f) et l'exécution de méthodes à la volée.",
    donts: "N'utilisez plus la vieille méthode de concaténation '%' ou l'appel '.format()' dépassés.",
    codeSnippet: `taux = 0.7456
message = f"Progression : {taux * 100:.1f}%"
# Résultat: "Progression : 74.6%"`
  },
  {
    name: "Slicing ([start:stop:step])",
    category: "inline",
    description: "API de coupe surpuissante applicable aux listes, tuples et chaînes de caractères.",
    usage: "Inverser une chaîne en une ligne, obtenir les 3 éléments du début d'une liste ou défiler de deux en deux.",
    donts: "Ne spécifiez pas d'indices hors limites complexes à relire si de simples slices font l'affaire.",
    codeSnippet: `texte = "Python"
inverse = texte[::-1] # "nohtyP"
premiers = texte[:3] # "Pyt"`
  },
  {
    name: "Generators (yield)",
    category: "structure",
    description: "Fonctions spéciales produisant des flux de données un par un à la demande (évaluation paresseuse), sans charger la RAM.",
    usage: "Parfait pour lire d'interminables fichiers de logs de plusieurs giga-octets sans saturer la mémoire vive du PC.",
    donts: "Ne convertissez pas aveuglément un générateur en liste 'list(mon_generateur)' si vous souhaitez préserver la légèreté en RAM.",
    codeSnippet: `def generer_nombres(max_val):
    n = 0
    while n < max_val:
        yield n
        n += 1`
  },
  {
    name: "*args and **kwargs",
    category: "structure",
    description: "Permet de passer une quantité variable d'arguments positionnels (*args) ou nommés (**kwargs) à une fonction.",
    usage: "Indispensable pour créer des décorateurs génériques ou faire de la délégation de paramètres vers une classe de base.",
    donts: "N me pas abuser de leur présence si vous pouvez expliciter directement les paramètres attendus par soucis de clarté.",
    codeSnippet: `def afficher_config(*args, **kwargs):
    print("Arguments :", args)
    print("Options :", kwargs)

afficher_config("admin", volume=80, theme="dark")`
  },
  {
    name: "Dict (get, setdefault)",
    category: "structure",
    description: "Structure de paires clés-valeurs clés du langage.",
    usage: "Appelez 'dictionnaire.get(cle, defaut)' pour éviter de crasher avec une KeyError si la clé n'existe pas.",
    donts: "Ne faites pas d'accès directs 'config[\"port\"]' sur des sources utilisateur sans vérifier par 'in' ou sans get().",
    codeSnippet: `config = {"langue": "fr"}
# Évite une KeyError si 'theme' est manquant
theme = config.get("theme", "standard-light")`
  },
  {
    name: "Sets & Frozensets",
    category: "inline",
    description: "Collections non ordonnées d'éléments uniques, prenant en charge les puissants calculs d'intersections et d'unions.",
    usage: "Pour dédoubler un tableau en une ligne ou vérifier instantanément des correspondances géométriques de listes.",
    donts: "Sachez que les éléments d'un set doivent impérativement être hachables (les listes ne peuvent y figurer).",
    codeSnippet: `utilisateurs = {"Alice", "Bob", "Charlie"}
visiteurs = {"Bob", "David"}

communs = utilisateurs.intersection(visiteurs) # {"Bob"}`
  },
  {
    name: "Try ... Except ... Else ... Finally",
    category: "interactive",
    description: "Traitement complet et modulaire d'interrogations et d'erreurs (exceptions).",
    usage: "La clause 'else' s'exécute si aucune exception n'a lieu, et 'finally' s'exécute quoi qu'il arrive (idéal pour nettoyer).",
    donts: "N'écrivez jamais de clause 'except:' vide, car elle capturera aussi les signaux système critiques comme le Ctrl+C (KeyboardInterrupt).",
    codeSnippet: `try:
    valeur = int(entree)
except ValueError:
    print("Format invalide")
else:
    print("Conversion réussie !")
finally:
    print("Fin d'évaluation")`
  },
  {
    name: "Classes & Inheritance",
    category: "structure",
    description: "Moteur de programmation orientée objet (POO) en Python.",
    usage: "Modéliser vos entités applicatives ou hériter de comportements de classes parents via 'super()'.",
    donts: "N'oubliez pas d'indiquer de façon explicite le paramètre d'auto-référencement 'self' en tête de chaque méthode.",
    codeSnippet: `class Robot:
    def __init__(self, nom):
        self.nom = nom
    
    def parler(self):
        return f"Bip, je suis {self.nom}"`
  },
  {
    name: "Dunder Methods (__init__, __str__)",
    category: "structure",
    description: "Méthodes dites 'magiques' (double underscore) permettant d'intégrer vos objets aux opérateurs natifs du langage.",
    usage: "Personnaliser le constructeur de vos objets (__init__) ou leur représentation textuelle lisible (__str__).",
    donts: "N'inventez pas de dunder methods customisées; restreignez-vous rigoureusement à celles soutenues par Python.",
    codeSnippet: `class Livre:
    def __init__(self, titre):
        self.titre = titre
    
    def __str__(self):
        return f"Livre : {self.titre}"`
  },
  {
    name: "Type Hinting (Annotations)",
    category: "structure",
    description: "Ajout d'indications de types de variables et fonctions facilitant grandement l'analyse statique.",
    usage: "Idéal pour que les éditeurs de codes modernes découvrent les erreurs d'incompatibilité de données avant l'exécution.",
    donts: "Le moteur d'exécution de Python n'impose pas ces types par défaut (ils sont purement décoratifs en temps d'exécution).",
    codeSnippet: `def saluer(nom: str) -> str:
    return f"Bonjour {nom}"`
  },
  {
    name: "Enumerate",
    category: "inline",
    description: "Génère un compteur d'itérations lors du parcours d'une liste.",
    usage: "Idéal pour obtenir à la fois l'indice d'indexation et la valeur d'une liste sans tenir de compteur manuel.",
    donts: "N'utilisez pas 'range(len(liste))' suivi d'accès par index, méthode lourde et peu pythonique.",
    codeSnippet: `couleurs = ["rouge", "vert", "bleu"]
for index, couleur in enumerate(couleurs):
    print(f"Numéro {index} : {couleur}")`
  },
  {
    name: "Zip Function",
    category: "inline",
    description: "Associe les éléments de plusieurs listes de manière parallèle.",
    usage: "Pratique pour fusionner ou combiner de manière synchronisée des listes de noms et d'âges correspondants.",
    donts: "Si les listes ont des formats inégaux, zip s'arrête par défaut au plus court (utilisez zip_longest d'itertools si besoin).",
    codeSnippet: `noms = ["Alice", "Bob"]
scores = [95, 88]
associes = list(zip(noms, scores))
# [('Alice', 95), ('Bob', 88)]`
  },
  {
    name: "Unpacking (Déballage)",
    category: "inline",
    description: "Extraction propre de valeurs de tuples ou de listes directement vers des variables nommées.",
    usage: "Pour assigner des variables d'une traite ou échanger deux variables de position en une seule instruction.",
    donts: "Le nombre de variables d'accueil doit correspondre précisément au nombre d'éléments présents (sinon utilisez l'opérateur *).",
    codeSnippet: `a, b = 10, 20
a, b = b, a # Échange de variables instantané d'une ligne`
  },
  {
    name: "Any & All",
    category: "inline",
    description: "Vérifications de conditions booléennes collectives.",
    usage: "all() renvoie True si tous les éléments sont vrais; any() renvoie True s'il y en a au moins un d'évalué valide.",
    donts: "Ne faites pas d'interminables boucles d'évaluation de drapeaux booléens imbriqués.",
    codeSnippet: `scores = [12, 18, 15, 8]
tous_valides = all(x >= 10 for x in scores) # False
au_moins_un = any(x >= 10 for x in scores) # True`
  },
  {
    name: "Walrus Operator (:=)",
    category: "inline",
    description: "Opérateur spécial permettant d'attribuer une valeur à une variable au sein même d'une expression conditionnelle.",
    usage: "Fort utile pour économiser une ligne de calcul ou simplifier des boucles d'analyses et de matches complexes.",
    donts: "N'en parsemez pas l'entièreté de votre code, car cela peut rendre de simples conditions dures à relire.",
    codeSnippet: `if (n := len("Python")) > 5:
    print(f"Grand nom de {n} lettres")`
  },
  {
    name: "Virtual Environments (venv)",
    category: "structure",
    description: "Isole localement l'entièreté de vos paquets et librairies externes téléchargés par projet.",
    usage: "Crucial pour empêcher les conflits invisibles entre multiples outils ou versions d'une version Python de système globale.",
    donts: "N'uploadez jamais le dossier d'environnement (ex: venv/) au sein de vos dépôts de versions Git.",
    codeSnippet: `# Création
python -m venv .venv
# Activation (Unix)
source .venv/bin/activate`
  },
  {
    name: "PIP (Package Manager)",
    category: "interactive",
    description: "Gestionnaire de paquets officiel pour Python, facilitant l'installation d'outils et de bibliothèques tierces.",
    usage: "Pour récupérer instantanément des packages utiles ou consigner vos dépendances de projets.",
    donts: "Ne lancez pas pip install sans configurer de fichier requirements.txt de référence.",
    codeSnippet: `# Installation
pip install requests
# Enregistrer les dépendances installées
pip freeze > requirements.txt`
  },
  {
    name: "Modules & Packages (import)",
    category: "structure",
    description: "Système officiel de découpage de vos fichiers algorithmiques par importation de namespaces.",
    usage: "Isolez vos calculs, puis importez-les dans votre fichier de démarrage central.",
    donts: "Évitez à tout prix les importations de type 'from excel_helper import *' qui polluent le namespace courant.",
    codeSnippet: `import math
from datetime import datetime

heure = datetime.now()`
  },
  {
    name: "Map & Filter Built-ins",
    category: "inline",
    description: "Fonctions d'itérations natives permettant d'appliquer de la logique de transformation ou de filtre.",
    usage: "En combinaison avec des expressions lambda d'une ligne.",
    donts: "La communauté Python préfère souvent les list comprehensions, jugées plus directes à déchiffrer.",
    codeSnippet: `prix = [10, 20, 30]
taxes = map(lambda p: p * 1.2, prix)
# Résultat: un objet map itérable`
  },
  {
    name: "Sorted Function",
    category: "inline",
    description: "Renvoie une nouvelle liste ordonnée issue d'un itérable sans toucher au conteneur initial.",
    usage: "Pour trier des fiches d'objets, des listes d'élèves ou des dictionnaires selon une clé définie.",
    donts: "Ne confondez pas avec la méthode '.sort()' qui trie et détruit la liste d'origine de manière définitive.",
    codeSnippet: `notes = [15, 12, 19]
notes_triees = sorted(notes) # notes reste intacte`
  },
  {
    name: "Is vs ==",
    category: "inline",
    description: "Opérateurs de comparaison d'identités (is) par opposition aux valeurs d'équivalence (==).",
    usage: "Utilisez obligatoirement 'is' pour comparer à l'état de référence 'None'.",
    donts: "N'utilisez jamais 'is' pour évaluer des concordances de types Number ou String, car cela évalue l'adresse mémoire.",
    codeSnippet: `a = [1, 2]
b = [1, 2]
print(a == b) # True (valeurs identiques)
print(a is b) # False (objets distincts stockés en mémoire)`
  },
  {
    name: "None & Optionals",
    category: "inline",
    description: "Type spécial servant à matérialiser l'absence voulue ou par défaut d'une valeur.",
    usage: "Régler None par défaut aux paramètres pour débloquer de futures instanciations.",
    donts: "Pour de grands volumes, préférez vérifier 'if variable is None:' à 'if not variable:'.",
    codeSnippet: `def initialiser_connexion(hote=None):
    if hote is None:
        hote = "localhost"
    return hote`
  },
  {
    name: "JSON Module",
    category: "content",
    description: "Module utilitaire standard encodant ou décodant des données au format JSON.",
    usage: "Idéal pour configurer, sauvegarder des scores de jeux ou communiquer avec des requêtes API tierces.",
    donts: "JSON ne gère pas nativement de types plus fins comme les classes complexes de dates.",
    codeSnippet: `import json

donnees = {"invite": True}
# Objet Python -> Chaîne JSON
flux = json.dumps(donnees)
# Chaîne JSON -> Objet Python
donnees_charges = json.loads(flux)`
  },
  {
    name: "Itertools Module",
    category: "structure",
    description: "Bibliothèque système fournissant une série d'opérateurs d'itérations performants.",
    usage: "Pour créer d'interminables cycles d'affichage ou des associations de combinatoires cartésiennes complexes.",
    donts: "Une mauvaise configuration de chain d'itertools peut entraîner des blocages machine.",
    codeSnippet: `import itertools

# Génère toutes les combinaisons de paires de taille 2
lettres = ["A", "B", "C"]
combi = list(itertools.combinations(lettres, 2))
# [('A', 'B'), ('A', 'C'), ('B', 'C')]`
  },
  {
    name: "Collections Module (Counter, defaultdict)",
    category: "structure",
    description: "Structures de conteneurs spécialisées étendant celles nativement intégrées de base.",
    usage: "Counter() automatise le décompte des mots de textes et defaultdict évite de surveiller l'absence de clés.",
    donts: "N'écrivez pas d'algorithmes complexes de décomptes que Counter fait déjà en une ligne.",
    codeSnippet: `from collections import Counter

mots = ["pc", "souris", "pc", "clavier"]
stats = Counter(mots)
print(stats["pc"]) # 2`
  },
  {
    name: "Pathlib Module",
    category: "interactive",
    description: "Approche orientée objet moderne pour manipuler des chemins d'accès de fichiers.",
    usage: "Unifie et résout proprement les barres obliques de dossiers Windows (\\\\) vis-à-vis d'Unix (/).",
    donts: "Bannissez l'usage complexe de l'ancien module textuel os.path qui est verbeux.",
    codeSnippet: `from pathlib import Path

repertoire = Path("documents")
fichier = repertoire / "rapport.txt"
if fichier.exists():
    text_content = fichier.read_text()`
  },
  {
    name: "Scope & LEGB Rule",
    category: "structure",
    description: "Règle de résolution des portées de variables de Python (Local, Enclosing, Global, Built-in).",
    usage: "Permet de comprendre comment une sous-fonction recherche et trouve ses variables environnantes.",
    donts: "Évitez le mot-clé 'global' pour injecter des valeurs; favorisez le passage explicite de paramètres d'appels.",
    codeSnippet: `x = "Global"

def externe():
    x = "Enclosing"
    def interne():
        x = "Local"
        print(x)
    interne()`
  }
];
