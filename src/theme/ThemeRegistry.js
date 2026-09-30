const GOOGLE_FONTS = "https://fonts.googleapis.com/css2?display=swap&";

export default class ThemeRegistry {
  static KEPEK_SZAMA = 3;

  static #TEMAK = Object.freeze(
    [
      {
        kulcs: "book-classic",
        nev: "Book classic",
        fontok: `${GOOGLE_FONTS}family=Noto+Serif+Display:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500;600`,
        betuk: ['500 1em "Noto Serif Display"', '300 1em "Jost"', '400 1em "Jost"'],
      },
      {
        kulcs: "manga",
        nev: "Manga",
        fontok: `${GOOGLE_FONTS}family=Dela+Gothic+One&family=M+PLUS+1p:wght@400;500;700`,
        betuk: ['400 1em "Dela Gothic One"', '400 1em "M PLUS 1p"', '700 1em "M PLUS 1p"'],
      },
      {
        kulcs: "golden",
        nev: "Golden",
        fontok: `${GOOGLE_FONTS}family=Tenor+Sans&family=Jost:wght@300;400;500`,
        betuk: ['400 1em "Tenor Sans"', '300 1em "Jost"', '400 1em "Jost"'],
      },
      {
        kulcs: "tk",
        nev: "Tk",
        fontok: `${GOOGLE_FONTS}family=Manrope:wght@200;300;400;500`,
        betuk: ['200 1em "Manrope"', '300 1em "Manrope"', '400 1em "Manrope"'],
      },
      {
        kulcs: "sky-garden",
        nev: "Sky garden",
        fontok: `${GOOGLE_FONTS}family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Quicksand:wght@400;500;600`,
        betuk: ['500 1em "Cormorant Garamond"', 'italic 500 1em "Cormorant Garamond"', '500 1em "Quicksand"'],
      },
      {
        kulcs: "riso",
        nev: "Riso",
        fontok: `${GOOGLE_FONTS}family=Bricolage+Grotesque:opsz,wght@12..96,400..800`,
        betuk: ['800 1em "Bricolage Grotesque"', '400 1em "Bricolage Grotesque"'],
      },
      {
        kulcs: "gallery",
        nev: "Art gallery",
        fontok: `${GOOGLE_FONTS}family=Marcellus&family=Figtree:wght@300;400;500`,
        betuk: ['400 1em "Marcellus"', '300 1em "Figtree"', '400 1em "Figtree"'],
        dekor: { kepek: ["pearl.webp", "pearl-baroque.webp"], darab: 18, min: 12, max: 34 },
      },
    ].map((obj) =>
      Object.freeze({
        ...obj,
        betuk: Object.freeze(obj.betuk),
        dekor: obj.dekor ? Object.freeze(obj.dekor) : null,
      })
    )
  );

  static get ALAP() {
    return ThemeRegistry.#TEMAK[0].kulcs;
  }

  static osszes() {
    return [...ThemeRegistry.#TEMAK];
  }

  static keres(kulcs) {
    return ThemeRegistry.#TEMAK.find((obj) => obj.kulcs === kulcs) ?? null;
  }

  static kepek(kulcs) {
    return Array.from(
      { length: ThemeRegistry.KEPEK_SZAMA },
      (nincs, i) => `${import.meta.env.BASE_URL}themes/${kulcs}-${i + 1}.webp`
    );
  }
}
