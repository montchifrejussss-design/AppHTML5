import { SemanticTag } from "./types";

export const PHP_CONCEPTS_LIST: SemanticTag[] = [
  {
    name: "Variables & Variables variables ($$)",
    category: "structure",
    description: "Structure de déclaration de conteneurs de variables standard ($var) et de variables dynamiques ($$var).",
    usage: "Pour stocker des données simples ou charger dynamiquement des variables dont le nom dépend d'un calcul.",
    donts: "N'utilisez pas de variables dynamiques ($$) de manière excessive, car cela rend le débogage et l'analyse statique de code extrêmement ardus.",
    codeSnippet: `<?php
$role = "admin";
$$role = "Sarah"; // Équivaut à $admin = "Sarah";

echo $admin; // "Sarah"`
  },
  {
    name: "Strict Types (declare)",
    category: "structure",
    description: "Directive contraignante exigeant que les types fournis correspondent de façon stricte aux signatures déclarées.",
    usage: "À placer obligatoirement en tout début de fichier PHP pour garantir un code sûr et sans conversions implicites saugrenues.",
    donts: "N'omettez pas cette directive dans vos projets modernes car PHP a tendance à convertir silencieusement les chaînes en nombres par défaut.",
    codeSnippet: `<?php
declare(strict_types=1);

def calculer_total(int $quantite, float $prix): float {
    return $quantite * $prix;
}`
  },
  {
    name: "Constructor Property Promotion",
    category: "structure",
    description: "Fonctionnalité fantastique (PHP 8) permettant de déclarer et d'initialiser les attributs de classe directement dans les paramètres du constructeur.",
    usage: "Simplifie considérablement l'écriture de vos objets d'enregistrements (DTOs) en une seule ligne.",
    donts: "Bannissez les lourdes déclarations d'attributs privés répétées 3 fois (propriété, paramètre, assignation) à l'ancienne.",
    codeSnippet: `<?php
class Utilisateur {
    // PHP instancie automatiquement l'attribut privé $nom et le protège
    public function __construct(
        private string $nom,
        private string $email,
        private int $points = 0
    ) {}
}`
  },
  {
    name: "Match Expression (PHP 8)",
    category: "inline",
    description: "Alternative moderne, sûre et performante au switch. Compare de manière stricte (===) et retourne directement une valeur.",
    usage: "Idéal pour associer un code d'erreur HTTP ou un rôle à un texte de description.",
    donts: "Le match doit être exhaustif. Si un cas n'est pas géré, une exception 'UnhandledMatchError' sera jetée; mettez toujours un 'default'.",
    codeSnippet: `<?php
$status = 404;
$message = match ($status) {
    200, 201 => 'Succès',
    400 => 'Recherche incorrecte',
    404 => 'Contenu introuvable',
    default => 'Erreur inconnue',
};`
  },
  {
    name: "Nullsafe Operator (?->)",
    category: "inline",
    description: "Permet de chaîner les accès aux méthodes ou attributs d'objets sans risquer d'erreur fatale si l'un d'eux est nul.",
    usage: "Idéal lors de manipulations d'enregistrements imbriqués récupérés depuis une base de données.",
    donts: "Ne l'utilisez pas partout aveuglément; si un objet est obligatoirement requis, laissez PHP planter explicitement pour repérer le bug.",
    codeSnippet: `<?php
// Si l'utilisateur ou son profil sont nuls, retourne null sans lever d'erreur
$ville = $utilisateur?->getProfil()?->getAdresse()?->ville;`
  },
  {
    name: "Named Arguments",
    category: "structure",
    description: "Possibilité de passer des valeurs aux paramètres d'une fonction en spécifiant le nom de l'argument d'appel.",
    usage: "Indispensable pour documenter la nature des arguments lors d'appels à de volumineuses méthodes dotées de multiples valeurs par défaut.",
    donts: "Ne modifiez pas sans précaution les noms de paramètres de fonctions dans vos librairies, car cela casserait les appels nommés en aval.",
    codeSnippet: `<?php
// Permet de sauter des paramètres facultatifs sans effort
setcookie(
    name: 'session_token',
    value: 'xyz55',
    secure: true,
    httponly: true
);`
  },
  {
    name: "PDO (PHP Data Objects)",
    category: "interactive",
    description: "Interface d'accès unifiée et sécurisée pour interroger n'importe quelle base de données (SQL, Postgres, SQLite).",
    usage: "Utilisez systématiquement des requêtes préparées (prepare et execute) pour anéantir tout risque de failles d'injections SQL.",
    donts: "N'injectez jamais de variable utilisateur directement dans une requête SQL par simple concaténation de texte ($query = 'SELECT * FROM ...').",
    codeSnippet: `<?php
$stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email');
$stmt->execute(['email' => $saisieUtilisateur]);
$user = $stmt->fetch();`
  },
  {
    name: "Namespaces & Autoloading (PSR-4)",
    category: "structure",
    description: "Mécanique d'isolation logique des fichiers PHP limitant les collisions de classes, soutenue par le chargeur automatique de Composer.",
    usage: "Pour structurer de grandes architectures logicielles modulaires configurées.",
    donts: "N'insérez pas des commandes de chargements manuels du type 'require' partout dans vos controllers.",
    codeSnippet: `<?php
namespace App\\Services\\Payment;

class StripeProcessor {
    public function traiter(): void {}
}`
  },
  {
    name: "Composer (Package Manager)",
    category: "interactive",
    description: "Le gestionnaire de dépendances universel incontournable pour récupérer et orchestrer vos bibliothèques tierces.",
    usage: "Sert à importer d'immenses solutions déjà écrites (ex: PHPUnit, Monolog, Carbon) dans votre projet.",
    donts: "Ne soumettez pas les librairies du dossier 'vendor/' dans votre historique de versions Git.",
    codeSnippet: `# Installation de package utile de manipulation de dates
composer require nesbot/carbon

# Intégration du chargeur automatique de Composer en tête de script
require __DIR__ . '/vendor/autoload.php';`
  },
  {
    name: "Sessions & Cookies ($__SESSION)",
    category: "interactive",
    description: "Enregistrement permanent de l'identité ou de l'état d'un internaute d'une page à l'autre au sein de l'application.",
    usage: "Indispensable pour maintenir un utilisateur de façon authentifiée de page en page durant sa visite.",
    donts: "N'enregistrez jamais d'informations hautement confidentielles dans les cookies de l'utilisateur, car modifiables de son côté.",
    codeSnippet: `<?php
session_start();
// Attribution sécurisée
$_SESSION['id_compte'] = 45;
// Récupération
$id = $_SESSION['id_compte'] ?? null;`
  },
  {
    name: "Superglobaux ($__GET & $__POST)",
    category: "interactive",
    description: "Tableaux associatifs de collecte de paramètres de requêtes d'adresses (GET) ou de transmissions de formulaires (POST).",
    usage: "Sert à déceler les choix de critères filtrés par l'utilisateur ou enregistrer ses formulaires d'inscriptions.",
    donts: "Traitez toujours les valeurs reçues via filter_input ou htmlspecialchars avant de les afficher, par précaution contre les failles XSS.",
    codeSnippet: `<?php
// Récupération sécurisée
$recherche = htmlspecialchars($_GET['q'] ?? '', ENT_QUOTES, 'UTF-8');`
  },
  {
    name: "Arrays (associatifs vs indexés)",
    category: "content",
    description: "Structure de données hybride de PHP, pouvant agir comme une simple liste ou un dictionnaire à clés nommées.",
    usage: "Structure passe-partout du langage pour représenter vos listes d'options.",
    donts: "Donnez des noms de clés clairs et cohérents pour éviter de pénibles fautes de frappes en manipulant l'indexation.",
    codeSnippet: `<?php
$listColors = ["Bleu", "Jaune"]; // Indexé
$parameters = ["theme" => "Sombre", "port" => 3000]; // Associatif`
  },
  {
    name: "array_map()",
    category: "content",
    description: "Applique un traitement callback sur chaque case d'un tableau et retourne un tableau de résultats transformé.",
    usage: "Idéal pour normaliser des chaînes existantes ou appliquer un taux multiplicatif à une grille tarifaire.",
    donts: "Sachez que l'ordre des arguments de array_map place la fonction callback en premier, contrairement à array_filter !",
    codeSnippet: `<?php
$prix_ht = [10, 50, 100];
$prix_ttc = array_map(fn($p) => $p * 1.20, $prix_ht);`
  },
  {
    name: "array_filter()",
    category: "content",
    description: "Génère un tableau épuré ne retenant que les éléments validant un filtrage de retour booléen.",
    usage: "Idéal pour éliminer d'un coup les valeurs vides ou exclure des comptes inactifs du listing.",
    donts: "Le filtrage préserve les clés associatives d'origines. Pour réinitialiser l'indexation, enchaînez avec array_values().",
    codeSnippet: `<?php
$notes = [15, 8, 12, 5];
$notes_valides = array_filter($notes, fn($n) => $n >= 10);
// Résultat: [15, 12]`
  },
  {
    name: "array_reduce()",
    category: "content",
    description: "Réduit les valeurs associées d'un tableau à une unique variable de cumul ou de rapport final.",
    usage: "Parfait pour additionner les montants totaux de factures paniers d'abonnés.",
    donts: "Mettre systématiquement le troisième paramètre d'initialisation de valeur pour s'épargner d'inattendus retours.",
    codeSnippet: `<?php
$panier = [['article' => 'Livre', 'prix' => 15], ['article' => 'Stylo', 'prix' => 3]];
$total = array_reduce($panier, fn($acc, $item) => $acc + $item['prix'], 0);`
  },
  {
    name: "json_encode() & json_decode()",
    category: "content",
    description: "Méthodes de sérialisations et lectures réciproques de formats universels JSON.",
    usage: "Incontournable pour répondre sous forme d'API REST structurée à des applications de types React ou d'autres applications clientes.",
    donts: "Activez toujours l'option JSON_THROW_ON_ERROR pour intercepter immédiatement d'éventuels échecs d'encodages de caractères.",
    codeSnippet: `<?php
$data = ['connecte' => true];
// Objet PHP -> Chaîne standard JSON
$json_string = json_encode($data, JSON_THROW_ON_ERROR);`
  },
  {
    name: "Type Declarations (type hinting)",
    category: "structure",
    description: "Spécification explicite des types d'arguments ou de retours attendus par vos classes ou méthodes de calculs.",
    usage: "Rend votre document d'implémentation clair et guide immédiatement le débogage.",
    donts: "N'utilisez pas le type lourd 'mixed' que si vous n'avez absolument aucune autre idée de la nature de la variable.",
    codeSnippet: `<?php
class Service {
    public function valider(array $config, string $label): bool {
        return true;
    }
}`
  },
  {
    name: "Anonymous Classes",
    category: "structure",
    description: "Création à la volée de petites classes éphémères sans nécessiter de nommer ou d'isoler un fichier physique.",
    usage: "Extrêmement commode dans des scénarios de tests unitaires pour mocker de petites interfaces d'affichages.",
    donts: "Ne l'utilisez pas pour de grands piliers d'architectures objets métiers qui doivent rester réutilisables.",
    codeSnippet: `<?php
$logger_temporaire = new class {
    public function log(string $msg) {
        echo $msg;
    }
};`
  },
  {
    name: "Traits",
    category: "structure",
    description: "Mécanique d'importation de morceaux de codes partagés pour contourner la contrainte d'héritage simple de PHP.",
    usage: "Idéal pour équiper plusieurs classes indépendantes d'une fonctionnalité identique d'historique de trackers d'actions.",
    donts: "Évitez leur prolifération abusive car cela complique la traçabilité de l'origine exacte d'une méthode de calcul.",
    codeSnippet: `<?php
trait Loggables {
    public function imprimerDate(): void {
        echo date('H:i');
    }
}

class Serveur {
    use Loggables;
}`
  },
  {
    name: "Interfaces & Abstract Classes",
    category: "structure",
    description: "Déclaration de contrats d'architectures que les classes dérivées ont l'obligation stricte d'importer.",
    usage: "Indispensable pour bâtir de solides applications où l'on souhaite pouvoir remplacer un service de paiement Stripe par un autre PayPal.",
    donts: "Une interface ne doit contenir aucune écriture d'algorithme concret de méthode; elle n'énonce que la signature attendue.",
    codeSnippet: `<?php
interface PasserellePaiement {
    public function payer(float $montant): bool;
}`
  },
  {
    name: "Exceptions (try catch)",
    category: "interactive",
    description: "Encadrement et remédiations d'incidents d'écritures ou de connexions réseaux critiques.",
    usage: "Pour isoler un échec d'accès sur une passerelle externe sans paralyser le chargement général du site web.",
    donts: "Ne masquez jamais silencieusement les exceptions interceptées sans en garder une alerte de traces de logs.",
    codeSnippet: `<?php
try {
    $service->envoyerMail();
} catch (MailException $e) {
    error_log("Incident d'envoi de mail : " . $e->getMessage());
}`
  },
  {
    name: "Attributes (PHP 8 Metadata)",
    category: "structure",
    description: "Annotation officielle et structurée de métadonnées directement écrites en code natif, remplaçant les docblocks textuels PHPDoc.",
    usage: "Idéal pour configurer de manière ultra-moderne les chemins d'accès de routes d'API ou les mappings de bases de données ORM.",
    donts: "N'abusez pas d'écritures inutiles de métadonnées de documentation si le typage PHP natif est déjà suffisant.",
    codeSnippet: `<?php
class MonController {
    #[Route('/profil', methods: ['GET'])]
    public function afficher(): void {}
}`
  },
  {
    name: "Arrow Functions (fn =>)",
    category: "structure",
    description: "Syntaxe condensée de fonctions anonymes capturant de façon automatique et par valeur les variables environnantes.",
    usage: "Idéal pour rédiger de courtes équations de filtres de tableaux au sein des méthodes array_map ou array_filter.",
    donts: "Ces fonctions ne peuvent contenir qu'une UNIQUE expression et ne gèrent pas d'écritures multilignes de traitements complexes.",
    codeSnippet: `<?php
$valeur_fiscale = 1.15;
// Capture automatique de $valeur_fiscale sans avoir à coder d'instruction 'use'
$prix_charges = array_map(fn($p) => $p * $valeur_fiscale, [10, 20]);`
  },
  {
    name: "Union Types & Intersection Types",
    category: "structure",
    description: "Possibilité de combiner de multiples types acceptables au sein d'une seule et même signature de variable.",
    usage: "Pour assouplir proprement de petites méthodes pouvant accepter un nombre entier OU un float de décimales.",
    donts: "Ne multipliez pas indéfiniment les associations de types d'un même argument au risque de perdre l'intérêt même d'un fort typage.",
    codeSnippet: `<?php
// PHP 8 Union Type
function valider_nombre(int|float $valeur): void {}`
  },
  {
    name: "Null Coalescing Operator (??)",
    category: "inline",
    description: "Opérateur retournant la valeur de droite uniquement si celle d'origine à gauche s'avère nulle ou inexistante.",
    usage: "L'astuce suprême pour attribuer des valeurs de configurations de repli par retours par défaut.",
    donts: "N'utilisez pas de lourds enchaînements d'expressions de type isset() ternaires complexes d'anciennes versions d'écritures.",
    codeSnippet: `<?php
// Récupère l'option ou rétrograde sur 'fr' par défaut
$langue = $_GET['language'] ?? 'fr';`
  },
  {
    name: "Generators (yield)",
    category: "structure",
    description: "Fonctions spéciales itérables retournant des valeurs à la volée via le mécanisme d'évaluation paresseuse.",
    usage: "Incontournable pour lire d'épais fichiers logs ou de volumineux tableurs de comptes sans saturer la RAM de la machine.",
    donts: "N'y passez pas de simples collections de données légères que de traditionnels tableaux savent traiter directement.",
    codeSnippet: `<?php
function compter_lignes($chemin) {
    $f = fopen($chemin, 'r');
    while (($ligne = fgets($f)) !== false) {
        yield $ligne;
    }
    fclose($f);
}`
  },
  {
    name: "Securing against XSS",
    category: "interactive",
    description: "Mesure de salubrité publique protégeant vos internautes de l'intégration illicite de codes JavaScript pirates.",
    usage: "Echappez obligatoirement chaque donnée issue de l'utilisateur final en appelant la fonction htmlspecialchars().",
    donts: "Ne faites jamais d'instructions 'echo $input' brutes sans en avoir neutralisé le HTML en amont.",
    codeSnippet: `<?php
$saisie = '<script>danger();</script>';
echo htmlspecialchars($saisie, ENT_QUOTES, 'UTF-8');
// Sortie sécurisée neutre : &lt;script&gt;danger();&lt;/script&gt;`
  },
  {
    name: "Securing Password Hashing",
    category: "interactive",
    description: "Moteur de chiffrement hautement sécurisé pour enregistrer l'empreinte cryptographique des mots de passe.",
    usage: "Appelez password_hash() combiné au filtre dynamique moderne PASSWORD_DEFAULT.",
    donts: "Bannissez formellement et définitivement l'usage de vieux algorithmes obsolètes et friables comme md5() ou sha1() !",
    codeSnippet: `<?php
$hash = password_hash('motdepasse123', PASSWORD_DEFAULT);

// Vérification de validité de saisie de mot de passe à l'authentification :
if (password_verify('compte_saisie', $hash)) {
    // Authentifié
}`
  },
  {
    name: "Password Verify (sécurité)",
    category: "interactive",
    description: "Méthode d'audit validant de façon asymétrique l'empreinte de passe cryptographique.",
    usage: "Idéal pour de robustes formulaires de connexions de comptes clients.",
    donts: "Ne récrivez pas de fonctions d'analyses d'empreintes personnalisées.",
    codeSnippet: `<?php
$motdepasse = "azerty";
$db_hash = "hash_from_db_123xyz";
$access = password_verify($motdepasse, $db_hash);`
  },
  {
    name: "Predefined Constants",
    category: "inline",
    description: "Constantes système internes fournissant des indications sur l'environnement d'exécution (ex: __DIR__, __FILE__).",
    usage: "Indispensable pour calculer des chemins absolus de fichiers d'inclusions.",
    donts: "Ne pas y coder en dur des adresses absolues spécifiques d'un serveur local qui casseraient sur l'environnement de production.",
    codeSnippet: `<?php
// Calcule toujours l'accès exact vers le dossier de configurations
require_once __DIR__ . '/config/database.php';`
  }
];
