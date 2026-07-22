import type { Dictionary } from "./types";

// English UI chrome. Secondary language; station/heritage content stays Arabic
// until validated translations exist (see KNOWN_LIMITATIONS).
export const en: Dictionary = {
  appName: "ZWITA",
  welcome: {
    toZwita: "Welcome to ZWITA",
    toMill: "An exploration of Djerba's traditional olive-oil mill",
    tagline: "Follow the clues, scan the codes, and uncover the mill's secrets",
    start: "Start",
  },
  setup: {
    title: "Introduce yourself",
    nicknameLabel: "Your game name",
    nicknamePlaceholder: "Enter a name",
    avatarLabel: "Choose a symbol",
    languageLabel: "Language",
    continue: "Continue",
  },
  languages: {
    ar: "العربية",
    fr: "Français",
    en: "English",
  },
  rules: {
    title: "How to play",
    intro: "Three simple steps to explore the mill:",
    steps: [
      {
        title: "1. Read the clue",
        body: "Read the clue and look for the station it describes inside the mill.",
      },
      {
        title: "2. Scan the code",
        body: "At the station, scan the QR code next to its information panel.",
      },
      {
        title: "3. Discover and advance",
        body: "If it's the right station, you unlock new facts and the next clue.",
      },
    ],
    safety: "Move calmly and mind the steps — there's no need to run.",
    start: "Start the journey",
  },
  mission: {
    stepLabel: "Station",
    of: "of",
    scan: "Scan the station code",
    openScanner: "Open the camera",
    manualEntry: "Enter the code manually",
    manualLabel: "Station code",
    manualPlaceholder: "P6H2ZC",
    submit: "Check",
    next: "Next station",
    close: "Close",
  },
  feedback: {
    correctTitle: "Well done! You found it",
    wrongTitle: "Not this station",
    wrongBody: "No worries, try another nearby station.",
    alreadyTitle: "Already discovered",
    alreadyBody: "Look for your current station.",
    unknownTitle: "Unknown code",
    unknownBody: "Make sure you're scanning the correct mill code.",
    malformedTitle: "Couldn't read the code",
    malformedBody: "Try again or enter the code manually.",
  },
  scanner: {
    cameraError: "Couldn't start the camera",
    permissionDenied: "Camera access denied. You can enter the code manually.",
    noCamera: "No camera available. Use manual entry.",
    insecure: "The camera needs a secure connection. Use manual entry.",
    unsupported: "Camera not supported here. Use manual entry.",
    simulateHint: "Simulation mode (development)",
    close: "Close the camera",
  },
  discovery: {
    funFactLabel: "Did you know",
    safetyLabel: "Note",
    continue: "Continue",
  },
  complete: {
    title: "Journey complete!",
    subtitle: "Thanks for exploring the mill",
    scoreLabel: "Your points",
    finalTitle: "Your title",
    restart: "Start again",
  },
  titles: {
    expert: "Mill Expert",
    skilled: "Skilled Explorer",
    curious: "Curious Visitor",
  },
  reset: {
    action: "Reset",
    confirmTitle: "Start over from the beginning?",
    confirmBody: "Your current progress will be erased.",
    confirm: "Yes, reset",
    cancel: "Cancel",
  },
  offline: {
    banner: "You're offline — you can keep playing.",
  },
};
