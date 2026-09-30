const FAJLOK = import.meta.glob("../assets/themes/*/*.{webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
});

export default class ThemeAssets {
  static #csoportok = ThemeAssets.#csoportosit();

  static osszes(kulcs) {
    return [...(ThemeAssets.#csoportok.get(kulcs)?.values() ?? [])];
  }

  static egy(kulcs, nev) {
    return ThemeAssets.#csoportok.get(kulcs)?.get(nev) ?? null;
  }

  static #csoportosit() {
    const csoportok = new Map();

    Object.entries(FAJLOK).forEach(([ut, url]) => {
      const [mappa, nev] = ut.split("/").slice(-2);

      if (!csoportok.has(mappa)) {
        csoportok.set(mappa, new Map());
      }

      csoportok.get(mappa).set(nev, url);
    });

    return csoportok;
  }
}
