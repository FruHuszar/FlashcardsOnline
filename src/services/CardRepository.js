import Repository from "./Repository.js";
import CardEntity from "../model/CardEntity.js";

export default class CardRepository extends Repository {
  static VERZIO = 1;

  #store = null;
  #dokumentum = null;

  constructor(store) {
    super();
    this.#store = store;
    this.#dokumentum = this.#betolt();
  }

  lekerdez() {
    return Promise.resolve(this.#masolat(this.#dokumentum.cards));
  }

  letrehoz(obj) {
    const kartya = CardEntity.letrehoz(obj, this.#dokumentum.nextId);

    if (!kartya) {
      return Promise.reject(new Error("Hiányos vagy érvénytelen kártyaadat."));
    }

    this.#dokumentum.nextId++;
    this.#dokumentum.cards.push(kartya);
    return this.#ment().then(() => ({ ...kartya }));
  }

  modosit(id, valtozas) {
    const index = this.#index(id);

    if (index === -1) {
      return Promise.reject(new Error("A megadott kártya nem található."));
    }

    const kartya = CardEntity.modosit(this.#dokumentum.cards[index], valtozas);

    if (!kartya) {
      return Promise.reject(new Error("Hiányos vagy érvénytelen kártyaadat."));
    }

    this.#dokumentum.cards[index] = kartya;
    return this.#ment().then(() => ({ ...kartya }));
  }

  torol(id) {
    const index = this.#index(id);

    if (index === -1) {
      return Promise.reject(new Error("A megadott kártya nem található."));
    }

    this.#dokumentum.cards.splice(index, 1);
    return this.#ment();
  }

  hozzafuz(lista, duplikatumKihagyas = true) {
    const meglevo = new Set(this.#dokumentum.cards.map((obj) => CardEntity.kulcs(obj)));
    let hozzaadva = 0;
    let kihagyva = 0;

    lista.forEach((nyers) => {
      const kartya = CardEntity.letrehoz(nyers, this.#dokumentum.nextId);

      if (!kartya) {
        kihagyva++;
        return;
      }

      const kulcs = CardEntity.kulcs(kartya);

      if (duplikatumKihagyas && meglevo.has(kulcs)) {
        kihagyva++;
        return;
      }

      meglevo.add(kulcs);
      this.#dokumentum.nextId++;
      this.#dokumentum.cards.push(kartya);
      hozzaadva++;
    });

    return this.#ment().then(() => ({ hozzaadva, kihagyva }));
  }

  felulir(lista, csucs = 0) {
    let kovetkezoId = 1;

    this.#dokumentum.cards = lista
      .map((nyers) => CardEntity.letrehoz(nyers, kovetkezoId++))
      .filter(Boolean);

    this.#dokumentum.nextId = this.#dokumentum.cards.length + 1;
    this.#dokumentum.highScore = CardRepository.#pont(csucs);
    return this.#ment().then(() => this.#masolat(this.#dokumentum.cards));
  }

  get csucs() {
    return this.#dokumentum.highScore;
  }

  csucsMentes(pont) {
    const ertek = CardRepository.#pont(pont);

    if (ertek <= this.#dokumentum.highScore) {
      return Promise.resolve(this.#dokumentum.highScore);
    }

    this.#dokumentum.highScore = ertek;
    return this.#ment().then(() => this.#dokumentum.highScore);
  }

  static #pont(ertek) {
    const szam = Math.floor(Number(ertek));
    return Number.isFinite(szam) && szam > 0 ? szam : 0;
  }

  pillanatkep() {
    return {
      version: CardRepository.VERZIO,
      updatedAt: this.#dokumentum.updatedAt,
      highScore: this.#dokumentum.highScore,
      cards: this.#masolat(this.#dokumentum.cards),
    };
  }

  get darab() {
    return this.#dokumentum.cards.length;
  }

  #index(id) {
    return this.#dokumentum.cards.findIndex((obj) => Number(obj.id) === Number(id));
  }

  #masolat(lista) {
    return lista.map((obj) => ({ ...obj }));
  }

  #ment() {
    try {
      this.#dokumentum.updatedAt = new Date().toISOString();
      this.#store.ir(this.#dokumentum);
      return Promise.resolve();
    } catch (hiba) {
      return Promise.reject(hiba);
    }
  }

  #betolt() {
    const nyers = this.#store.olvas();
    const lista = Array.isArray(nyers?.cards) ? nyers.cards : [];
    const hasznaltIdk = new Set();
    let kovetkezoId = 1;

    const cards = lista
      .map((obj) => {
        const sajatId = Number(obj?.id);
        const egyedi = sajatId > 0 && !hasznaltIdk.has(sajatId);

        while (!egyedi && hasznaltIdk.has(kovetkezoId)) {
          kovetkezoId++;
        }

        const id = egyedi ? sajatId : kovetkezoId++;
        hasznaltIdk.add(id);
        return CardEntity.letrehoz(obj, id);
      })
      .filter(Boolean);

    const maxId = cards.reduce((max, obj) => Math.max(max, Number(obj.id)), 0);

    return {
      version: CardRepository.VERZIO,
      nextId: Math.max(Number(nyers?.nextId) || 0, maxId + 1),
      updatedAt: nyers?.updatedAt ?? new Date().toISOString(),
      highScore: CardRepository.#pont(nyers?.highScore),
      cards,
    };
  }
}
