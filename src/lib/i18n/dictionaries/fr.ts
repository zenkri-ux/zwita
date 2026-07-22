import type { Dictionary } from "./types";

// French UI chrome. Secondary language; station/heritage content stays Arabic
// until validated translations exist (see KNOWN_LIMITATIONS).
export const fr: Dictionary = {
  appName: "ZWITA",
  splash: {
    loading: "Préparation…",
  },
  welcome: {
    toZwita: "Bienvenue sur ZWITA",
    toMill: "Une exploration du moulin à huile d'olive traditionnel de Djerba",
    tagline: "Suivez les énigmes, scannez les codes et percez les secrets du moulin",
    start: "Commencer",
  },
  setup: {
    title: "Présentez-vous",
    nicknameLabel: "Votre nom de jeu",
    nicknamePlaceholder: "Entrez un nom",
    avatarLabel: "Choisissez un symbole",
    languageLabel: "Langue",
    continue: "Continuer",
  },
  languages: {
    ar: "العربية",
    fr: "Français",
    en: "English",
  },
  rules: {
    title: "Comment jouer",
    intro: "Trois étapes simples pour explorer le moulin :",
    steps: [
      {
        title: "1. Lisez l'énigme",
        body: "Lisez l'énigme et cherchez la station qu'elle décrit dans le moulin.",
      },
      {
        title: "2. Scannez le code",
        body: "À la station, scannez le code QR situé près du panneau d'information.",
      },
      {
        title: "3. Découvrez et avancez",
        body: "Si c'est la bonne station, vous découvrez des informations et l'énigme suivante s'ouvre.",
      },
    ],
    safety: "Déplacez-vous calmement et attention aux marches — nul besoin de courir.",
    start: "Commencer l'aventure",
  },
  mission: {
    stepLabel: "Station",
    of: "sur",
    scan: "Scannez le code de la station",
    openScanner: "Ouvrir la caméra",
    manualEntry: "Saisir le code manuellement",
    manualLabel: "Code de la station",
    manualPlaceholder: "P6H2ZC",
    submit: "Vérifier",
    next: "Station suivante",
    close: "Fermer",
  },
  feedback: {
    tryAgain: "Réessayer",
    correctTitle: "Bravo ! Vous l'avez trouvée",
    wrongTitle: "Ce n'est pas cette station",
    wrongBody: "Pas de souci, essayez une autre station à proximité.",
    alreadyTitle: "Déjà découverte",
    alreadyBody: "Cherchez votre station actuelle.",
    unknownTitle: "Code inconnu",
    unknownBody: "Vérifiez que vous scannez le bon code du moulin.",
    malformedTitle: "Lecture du code impossible",
    malformedBody: "Réessayez ou saisissez le code manuellement.",
  },
  scanner: {
    title: "Scanner le code de la station",
    hint: "Visez le code QR situé près du panneau",
    cameraError: "Impossible d'activer la caméra",
    permissionDenied: "Accès caméra refusé. Vous pouvez saisir le code manuellement.",
    noCamera: "Aucune caméra disponible. Utilisez la saisie manuelle.",
    insecure: "La caméra nécessite une connexion sécurisée. Utilisez la saisie manuelle.",
    unsupported: "Caméra non prise en charge ici. Utilisez la saisie manuelle.",
    simulateHint: "Mode simulation (développement)",
    close: "Fermer la caméra",
  },
  discovery: {
    funFactLabel: "Le saviez-vous",
    safetyLabel: "Attention",
    continue: "Énigme suivante",
  },
  progressOverview: {
    title: "Votre parcours",
    done: "Découverte",
    current: "Station actuelle",
    upcoming: "Pas encore atteinte",
  },
  complete: {
    title: "Parcours terminé !",
    subtitle: "Merci d'avoir exploré le moulin",
    scoreLabel: "Vos points",
    finalTitle: "Votre titre",
    restart: "Recommencer",
    levelLabel: "Niveau",
    badgeLabel: "Badge",
  },
  titles: {
    expert: "Expert du moulin",
    skilled: "Explorateur chevronné",
    curious: "Visiteur curieux",
  },
  reset: {
    action: "Réinitialiser",
    confirmTitle: "Recommencer depuis le début ?",
    confirmBody: "Votre progression actuelle sera effacée.",
    confirm: "Oui, réinitialiser",
    cancel: "Annuler",
  },
  offline: {
    title: "Vous êtes hors ligne",
    body: "Vous pouvez continuer à jouer — votre progression est enregistrée sur votre téléphone.",
    banner: "Vous êtes hors ligne — vous pouvez continuer à jouer.",
  },
};
