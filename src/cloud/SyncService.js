import CardRepository from "../services/CardRepository.js";

export default class SyncService {
  #auth = null;
  #drive = null;
  #repo = null;

  constructor(auth, drive, repo) {
    this.#auth = auth;
    this.#drive = drive;
    this.#repo = repo;
  }

  get auth() {
    return this.#auth;
  }

  mentes() {
    const dokumentum = this.#repo.pillanatkep();

    return this.#drive
      .feltolt({ ...dokumentum, syncedAt: new Date().toISOString() })
      .then(() => ({ darab: dokumentum.cards.length }));
  }

  letoltes() {
    return this.#drive.letolt().then((eredmeny) => {
      if (!eredmeny) {
        throw new Error("Még nincs mentésed a felhőben.");
      }

      const lista = this.#lista(eredmeny.tartalom);
      const csucs = eredmeny.tartalom?.highScore ?? 0;

      return this.#repo
        .felulir(lista, csucs)
        .then((kartyak) => ({ darab: kartyak.length }));
    });
  }

  #lista(tartalom) {
    if (Array.isArray(tartalom)) {
      return tartalom;
    }

    if (Array.isArray(tartalom?.cards)) {
      return tartalom.cards;
    }

    throw new Error("A felhőben lévő fájl nem a várt formátumú.");
  }

  get helyiDarab() {
    return this.#repo instanceof CardRepository ? this.#repo.darab : 0;
  }
}
