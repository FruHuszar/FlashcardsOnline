export default class LocalStore {
  #kulcs = "";

  constructor(kulcs) {
    this.#kulcs = kulcs;
  }

  olvas() {
    try {
      const szoveg = window.localStorage.getItem(this.#kulcs);
      return szoveg ? JSON.parse(szoveg) : null;
    } catch (hiba) {
      console.warn("A tárolt adat sérült, üres állapottal indulunk.", hiba);
      return null;
    }
  }

  ir(dokumentum) {
    try {
      window.localStorage.setItem(this.#kulcs, JSON.stringify(dokumentum));
      return true;
    } catch (hiba) {
      throw new Error(
        hiba?.name === "QuotaExceededError"
          ? "Megtelt a böngésző tárhelye. Törölj kártyákat, vagy ments a felhőbe."
          : "Nem sikerült menteni a böngésző tárolójába."
      );
    }
  }

  torol() {
    window.localStorage.removeItem(this.#kulcs);
  }
}
