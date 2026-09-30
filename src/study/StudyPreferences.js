export default class StudyPreferences {
  static ALAP_DARAB = 5;
  static MIN_DARAB = 1;
  static MAX_DARAB = 30;

  #store = null;

  constructor(store) {
    this.#store = store;
  }

  olvas(kulcsok) {
    const nyers = this.#store.olvas();

    return kulcsok.reduce(
      (gyujto, kulcs) => ({ ...gyujto, [kulcs]: StudyPreferences.#tisztit(nyers?.[kulcs]) }),
      {}
    );
  }

  ment(allapot) {
    return this.#store.irCsendben(allapot);
  }

  static #tisztit(obj) {
    return {
      aktiv: typeof obj?.aktiv === "boolean" ? obj.aktiv : true,
      darab: StudyPreferences.#darab(obj?.darab),
    };
  }

  static #darab(ertek) {
    const szam = Math.floor(Number(ertek));

    if (!Number.isFinite(szam) || szam < StudyPreferences.MIN_DARAB) {
      return StudyPreferences.ALAP_DARAB;
    }

    return Math.min(szam, StudyPreferences.MAX_DARAB);
  }
}
