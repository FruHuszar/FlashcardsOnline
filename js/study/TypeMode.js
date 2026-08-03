import Mode from "./Mode.js";

export default class TypeMode extends Mode {
  #ertekelt = false;

  constructor(kartya, lista, szuloElem) {
    super(kartya, lista, szuloElem);
    this.megjelenit();
    this.esemenyeketFigyel();
  }

  megjelenit() {
    this.szuloElem.innerHTML = `
      <div class="type">
        <span class="topic">${this.biztonsagos(this.kartya.topic)}</span>
        <h3 class="type-question">${this.biztonsagos(this.kartya.question)}</h3>
        <input type="text" class="type-input" placeholder="Írd be a választ" autocomplete="off" />
        <button type="button" class="type-check">Ellenőrzés</button>
        <div class="type-result" hidden>
          <p class="type-verdict"></p>
          <p class="type-correct"></p>
          <button type="button" class="type-next">Tovább</button>
        </div>
      </div>
    `;

    this.beviteliElem = this.szuloElem.querySelector(".type-input");
    this.eredmenyElem = this.szuloElem.querySelector(".type-result");
    this.beviteliElem.focus();
  }

  esemenyeketFigyel() {
    this.szuloElem.querySelector(".type-check").addEventListener("click", () => this.#ertekel());
    this.szuloElem.querySelector(".type-next").addEventListener("click", () => this.#tovabb());

    this.beviteliElem.addEventListener("keydown", (esemeny) => {
      if (esemeny.key === "Enter") {
        this.#ertekel();
      }
    });
  }

  #ertekel() {
    if (this.#ertekelt) {
      return;
    }
    this.#ertekelt = true;

    this.helyes = this.ellenorzes(this.beviteliElem.value);
    this.beviteliElem.disabled = true;
    this.beviteliElem.classList.add(this.helyes ? "helyes" : "helytelen");
    this.szuloElem.querySelector(".type-check").hidden = true;

    this.eredmenyElem.hidden = false;
    this.eredmenyElem.querySelector(".type-verdict").textContent = this.helyes
      ? "Helyes válasz!"
      : "Nem talált.";
    this.eredmenyElem.querySelector(".type-correct").textContent = `A pontos válasz: ${this.kartya.answer}`;
    this.szuloElem.querySelector(".type-next").focus();
  }

  #tovabb() {
    if (!this.#ertekelt) {
      return;
    }
    this.kiertekel(this.helyes);
  }
}
