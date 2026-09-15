export const CONFIG = {
  TAROLO_KULCS: "flashcards:v1",

  GOOGLE_CLIENT_ID: (import.meta.env?.VITE_GOOGLE_CLIENT_ID ?? "").trim(),

  DRIVE_FAJL: "flashcards-backup.json",

  DRIVE_SCOPE: "https://www.googleapis.com/auth/drive.appdata",

  IMPORT_MAX_DARAB: 5000,
  MEZO_MAX_HOSSZ: 5000,
  TEMAKOR_MAX_HOSSZ: 50,
};
