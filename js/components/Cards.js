import Card from "./Card.js";
import Modal from "./Modal.js";
import Stats from "./Stats.js";

export default class Cards {
  #service = null;
  #modal = null;
  #stats = null;
  #study = null;
  #lista = [];
  #kartyak = [];
  #kereses = "";
  #temakor = "";

  constructor(service, modal, stats, study, szuloElem) {
    this.#service = service;
    this.#modal = modal;
    this.#stats = stats;
    this.#study = study;
    this.szuloElem = szuloElem;
    this.esemenyeketFigyel();
    this.betolt();
  }

  esemenyeketFigyel() {
    this.szuloElem.querySelector("#btn-open-modal").addEventListener("click", () => {
      this.#modal.megnyit();
    });

    this.szuloElem.addEventListener(Card.ESEMENYEK.SZERKESZTES, (esemeny) => {
      this.#szerkesztes(esemeny.detail);
    });

    this.szuloElem.addEventListener(Card.ESEMENYEK.TORLES, (esemeny) => {
      this.#torles(esemeny.detail);
    });

    this.szuloElem.addEventListener(Card.ESEMENYEK.TANULAS, (esemeny) => {
      this.#tanulas(esemeny.detail);
    });

    this.#modal.elem.addEventListener(Modal.ESEMENYEK.MENTES, (esemeny) => {
      this.#mentes(esemeny.detail);
    });

    this.#stats.szuloElem.addEventListener(Stats.ESEMENYEK.SZURES, (esemeny) => {
      this.#szures(esemeny.detail);
    });

    this.#stats.szuloElem.addEventListener(Stats.ESEMENYEK.TANULAS, () => {
      this.#study.indit(this.#szurtLista());
    });
  }

  betolt() {
    return this.#service
      .lekerdez()
      .then((lista) => this.#adatokFrissites(lista))
      .catch((hiba) => this.#uzenet(hiba.message, true));
  }

  megjelenit() {
    this.#tartalomTorles();
    this.#kartyak = this.#szurtLista().map((obj) => new Card(obj, this.szuloElem));

    if (this.#kartyak.length === 0) {
      this.#uzenet(
        this.#lista.length === 0
          ? "Még nincs kártyád. Hozd létre az elsőt a plusz gombbal!"
          : "Nincs a szűrésnek megfelelő kártya."
      );
    }
  }

  #adatokFrissites(lista) {
    this.#lista = lista;
    this.#stats.frissit(this.#lista);
    this.megjelenit();
  }

  #szures(obj) {
    this.#kereses = obj.kereses.toLowerCase().trim();
    this.#temakor = obj.temakor;
    this.megjelenit();
  }

  #szurtLista() {
    return this.#lista.filter((obj) => this.#egyezik(obj));
  }

  #egyezik(obj) {
    const szoveg = `${obj.topic} ${obj.question} ${obj.answer}`.toLowerCase();
    const temakorOk = this.#temakor === "" || obj.topic === this.#temakor;
    return temakorOk && szoveg.includes(this.#kereses);
  }

  #mentes(obj) {
    const adatok = { topic: obj.topic, question: obj.question, answer: obj.answer };
    const keres = obj.id
      ? this.#service.modosit(obj.id, adatok)
      : this.#service.letrehoz(adatok);

    keres
      .then(() => {
        this.#modal.bezar();
        return this.betolt();
      })
      .catch((hiba) => this.#modal.hibaMegjelenit(hiba.message));
  }

  #szerkesztes(obj) {
    const kartya = this.#kartyaKereses(obj.id);

    if (kartya) {
      this.#modal.megnyit(kartya.adatok);
    }
  }

  #torles(obj) {
    if (!window.confirm("Biztosan törlöd ezt a kártyát?")) {
      return;
    }

    this.#service
      .torol(obj.id)
      .then(() => this.betolt())
      .catch((hiba) => window.alert(hiba.message));
  }

  #tanulas(obj) {
    this.#service
      .modosit(obj.id, { is_learned: obj.tanult ? 1 : 0 })
      .then((adatok) => {
        this.#kartyaKereses(obj.id)?.frissit(adatok);
        this.#listaFrissites(adatok);
        this.#stats.frissit(this.#lista);
      })
      .catch((hiba) => window.alert(hiba.message));
  }

  #listaFrissites(adatok) {
    this.#lista = this.#lista.map((obj) =>
      Number(obj.id) === Number(adatok.id) ? adatok : obj
    );
  }

  #kartyaKereses(id) {
    return this.#kartyak.find((kartya) => kartya.azonosito === id);
  }

  #tartalomTorles() {
    this.szuloElem.querySelectorAll(".flip-card, .grid-message").forEach((elem) => elem.remove());
  }

  #uzenet(szoveg, hiba = false) {
    this.#tartalomTorles();
    const osztaly = hiba ? "grid-message grid-message--error" : "grid-message";
    this.szuloElem.insertAdjacentHTML("beforeend", `<p class="${osztaly}">${szoveg}</p>`);
  }
}
