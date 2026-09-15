import { CONFIG } from "../config.js";

export default class GoogleAuth {
  static GIS_URL = "https://accounts.google.com/gsi/client";

  #kliensId = "";
  #tokenKliens = null;
  #token = "";
  #lejarat = 0;
  #betoltes = null;
  #kesz = null;
  #hiba = null;

  constructor() {
    this.#kliensId = GoogleAuth.kliensId();
  }

  static kliensId() {
    return (CONFIG.GOOGLE_CLIENT_ID || "").trim();
  }

  get beallitva() {
    return GoogleAuth.kliensId() !== "";
  }

  get bejelentkezve() {
    return this.#token !== "" && Date.now() < this.#lejarat;
  }

  bejelentkezes(csendes = false) {
    if (this.bejelentkezve) {
      return Promise.resolve(this.#token);
    }

    return this.#klienst()
      .then((kliens) => this.#tokenKeres(kliens, csendes));
  }

  kijelentkezes() {
    const token = this.#token;
    this.#token = "";
    this.#lejarat = 0;

    if (!token || !window.google?.accounts?.oauth2?.revoke) {
      return Promise.resolve();
    }

    return new Promise((kesz) => {
      window.google.accounts.oauth2.revoke(token, () => kesz());
    });
  }

  token() {
    return this.bejelentkezve ? Promise.resolve(this.#token) : this.bejelentkezes();
  }

  tokenElvetes() {
    this.#token = "";
    this.#lejarat = 0;
  }

  #tokenKeres(kliens, csendes) {
    return new Promise((kesz, hiba) => {
      this.#kesz = kesz;
      this.#hiba = hiba;
      kliens.requestAccessToken({ prompt: csendes ? "" : "consent" });
    });
  }

  #klienst() {
    this.#kliensId = GoogleAuth.kliensId();

    if (this.#kliensId === "") {
      return Promise.reject(
        new Error("Nincs beállítva a Google Client ID a js/config.js fájlban.")
      );
    }

    return this.#gisBetoltes().then(() => {
      if (this.#tokenKliens && this.#tokenKliens.__kliensId === this.#kliensId) {
        return this.#tokenKliens;
      }

      this.#tokenKliens = window.google.accounts.oauth2.initTokenClient({
        client_id: this.#kliensId,
        scope: CONFIG.DRIVE_SCOPE,
        callback: (valasz) => this.#valasz(valasz),
        error_callback: (esemeny) => this.#hibaKezeles(esemeny),
      });

      this.#tokenKliens.__kliensId = this.#kliensId;
      return this.#tokenKliens;
    });
  }

  #valasz(valasz) {
    if (!valasz?.access_token) {
      this.#hibaKezeles(valasz);
      return;
    }

    this.#token = valasz.access_token;
    this.#lejarat = Date.now() + (Number(valasz.expires_in) || 3600) * 1000 - 60000;
    this.#kesz?.(this.#token);
    this.#kesz = null;
    this.#hiba = null;
  }

  #hibaKezeles(esemeny) {
    const tipus = esemeny?.type ?? esemeny?.error ?? "ismeretlen hiba";
    const uzenet =
      tipus === "popup_closed"
        ? "A bejelentkezést megszakítottad."
        : `A Google bejelentkezés nem sikerült (${tipus}).`;

    this.#hiba?.(new Error(uzenet));
    this.#kesz = null;
    this.#hiba = null;
  }

  #gisBetoltes() {
    if (window.google?.accounts?.oauth2) {
      return Promise.resolve();
    }

    if (this.#betoltes) {
      return this.#betoltes;
    }

    this.#betoltes = new Promise((kesz, hiba) => {
      const elem = document.createElement("script");
      elem.src = GoogleAuth.GIS_URL;
      elem.async = true;
      elem.defer = true;
      elem.addEventListener("load", () => kesz());
      elem.addEventListener("error", () => {
        this.#betoltes = null;
        hiba(new Error("A Google bejelentkezés nem érhető el (offline vagy blokkolva)."));
      });
      document.head.appendChild(elem);
    });

    return this.#betoltes;
  }
}
