import ThemeRegistry from "./ThemeRegistry.js";
import ThemeAssets from "./ThemeAssets.js";

export default class ThemeService {
  static FONT_LINK_ID = "theme-font";
  static MAX_ELOKESZITES = 4000;
  static MINTA_SZOVEG = "Aa őű";

  static MAX_INTRO_VARAKOZAS = 2500;

  static #linkBetoltes = Promise.resolve();
  static #dekodolasok = new Map();

  #store = null;

  constructor(store) {
    this.#store = store;
  }

  get aktualis() {
    return ThemeRegistry.keres(this.#store.olvas())?.kulcs ?? ThemeRegistry.ALAP;
  }

  valt(kulcs) {
    const tema = ThemeRegistry.keres(kulcs);

    if (!tema) {
      return this.aktualis;
    }

    this.#store.irCsendben(tema.kulcs);
    return tema.kulcs;
  }

  alkalmaz(kulcs) {
    const gyoker = document.documentElement;
    gyoker.dataset.theme = kulcs;
    ThemeService.#betutipus(ThemeRegistry.keres(kulcs)?.fontok ?? null);

    const szin = window.getComputedStyle(gyoker).getPropertyValue("--color-accent").trim();

    if (szin !== "") {
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", szin);
    }
  }

  elokeszit(kulcs) {
    const kepek = ThemeRegistry.kepek(kulcs).map((forras) => ThemeService.#dekodol(forras));

    const betuk = ThemeService.#linkBetoltes.then(() =>
      Promise.all(
        (ThemeRegistry.keres(kulcs)?.betuk ?? []).map((spec) =>
          document.fonts.load(spec, ThemeService.MINTA_SZOVEG)
        )
      )
    );

    return Promise.race([
      Promise.allSettled([...kepek, ThemeService.#temaKepek(kulcs), betuk]),
      ThemeService.#varakozas(ThemeService.MAX_ELOKESZITES),
    ]);
  }

  introElokeszit(kulcs) {
    return Promise.race([
      ThemeService.#temaKepek(kulcs),
      ThemeService.#varakozas(ThemeService.MAX_INTRO_VARAKOZAS),
    ]);
  }

  static #temaKepek(kulcs) {
    return Promise.allSettled(ThemeAssets.osszes(kulcs).map((forras) => ThemeService.#dekodol(forras)));
  }

  static #dekodol(forras) {
    if (!ThemeService.#dekodolasok.has(forras)) {
      const kep = new Image();
      kep.src = forras;
      ThemeService.#dekodolasok.set(forras, kep.decode());
    }

    return ThemeService.#dekodolasok.get(forras);
  }

  static #varakozas(ido) {
    return new Promise((megold) => window.setTimeout(megold, ido));
  }

  static #betutipus(url) {
    let link = document.getElementById(ThemeService.FONT_LINK_ID);

    if (!url) {
      link?.remove();
      ThemeService.#linkBetoltes = Promise.resolve();
      return;
    }

    if (!link) {
      link = document.createElement("link");
      link.id = ThemeService.FONT_LINK_ID;
      link.rel = "stylesheet";
      document.head.append(link);
    }

    if (link.getAttribute("href") === url) {
      return;
    }

    const elem = link;
    ThemeService.#linkBetoltes = new Promise((megold) => {
      elem.addEventListener("load", megold, { once: true });
      elem.addEventListener("error", megold, { once: true });
    });
    elem.setAttribute("href", url);
  }
}
