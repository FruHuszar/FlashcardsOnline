export default class Mode {
  static ESEMENYEK = {
    VALASZ: "mod:valasz",
  };

  #kartya = {};
  #lista = [];

  constructor(kartya, lista, szuloElem) {
    this.#kartya = kartya;
    this.#lista = lista;
    this.szuloElem = szuloElem;
  }

  get kartya() {
    return this.#kartya;
  }

  get lista() {
    return this.#lista;
  }

  megjelenit() {}

  esemenyeketFigyel() {}

  lezar() {}

  ellenorzes(valasz) {
    return this.#egyszerusit(valasz) === this.#egyszerusit(this.#kartya.answer);
  }

  kiertekel(helyes) {
    this.szuloElem.dispatchEvent(
      new CustomEvent(Mode.ESEMENYEK.VALASZ, {
        detail: { helyes, helyesValasz: this.#kartya.answer },
        bubbles: true,
      })
    );
  }

  veletlenKartya() {
    const maradek = this.#lista.filter(
      (obj) => Number(obj.id) !== Number(this.#kartya.id)
    );

    if (maradek.length === 0) {
      return this.#kartya;
    }

    return maradek[Math.floor(Math.random() * maradek.length)];
  }

  biztonsagos(szoveg) {
    const elem = document.createElement("div");
    elem.textContent = szoveg ?? "";
    return elem.innerHTML;
  }

  #egyszerusit(szoveg) {
    return String(szoveg ?? "").toLowerCase().trim();
  }
}
