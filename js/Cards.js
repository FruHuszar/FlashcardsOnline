import Card from "./Card.js";
import Modal from "./Modal.js";

export default class Cards {
  #service = null;
  #modal = null;
  #kartyak = [];

  constructor(service, modal, szuloElem) {
    this.#service = service;
    this.#modal = modal;
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
  }

  betolt() {
    return this.#service
      .lekerdez()
      .then((lista) => this.megjelenit(lista))
      .catch((hiba) => this.#uzenet(hiba.message, true));
  }

  megjelenit(lista) {
    this.#tartalomTorles();
    this.#kartyak = lista.map((obj) => new Card(obj, this.szuloElem));

    if (this.#kartyak.length === 0) {
      this.#uzenet("Még nincs kártyád. Hozd létre az elsőt a plusz gombbal!");
    }
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
      .then((adatok) => this.#kartyaKereses(obj.id)?.frissit(adatok))
      .catch((hiba) => window.alert(hiba.message));
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
