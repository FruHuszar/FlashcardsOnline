import Mode from "./Mode.js";

export default class FanMatch extends Mode {
  static DARAB = 10;

  #hibazott = false;

  constructor(kartya, lista, szuloElem) {
    super(kartya, lista, szuloElem);
    this.megjelenit();
    this.esemenyeketFigyel();
  }

  megjelenit() {
    this.szuloElem.innerHTML = `
      <div class="fan">
        <div class="fan-question">
          <span class="topic">${this.biztonsagos(this.kartya.topic)}</span>
          <h3>${this.biztonsagos(this.kartya.question)}</h3>
          <p class="fan-hint">Kattints arra a válaszra, amelyik ehhez a kérdéshez tartozik.</p>
        </div>
        <div class="fan-stage">
          <div class="fan-wheel">${this.#kartyakKod()}</div>
        </div>
      </div>
    `;
  }

  esemenyeketFigyel() {
    this.szuloElem.querySelectorAll(".fan-card").forEach((elem) => {
      elem.addEventListener("click", () => this.#valasztas(elem));
    });
  }

  #kartyakKod() {
    const szog = 360 / FanMatch.DARAB;

    return this.#lehetosegek()
      .map(
        (obj, index) => `
        <button type="button" class="fan-card" style="--szog: ${index * szog}deg" data-helyes="${obj.helyes}">
          <span class="fan-inner">
            <span class="fan-face fan-face--valasz">${this.biztonsagos(obj.kartya.answer)}</span>
            <span class="fan-face fan-face--kerdes">${this.biztonsagos(obj.kartya.question)}</span>
          </span>
        </button>
      `
      )
      .join("");
  }

  #lehetosegek() {
    const lehetosegek = [{ kartya: this.kartya, helyes: true }];

    while (lehetosegek.length < FanMatch.DARAB) {
      lehetosegek.push({ kartya: this.veletlenKartya(), helyes: false });
    }

    return lehetosegek.sort(() => Math.random() - 0.5);
  }

  #valasztas(elem) {
    if (elem.classList.contains("is-flipped")) {
      return;
    }

    elem.classList.add("is-flipped");

    if (elem.dataset.helyes === "true") {
      elem.classList.add("helyes");
      this.kiertekel(!this.#hibazott);
      return;
    }

    this.#hibazott = true;
    elem.classList.add("helytelen");
  }
}
