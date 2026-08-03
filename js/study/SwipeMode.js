import Mode from "./Mode.js";

export default class SwipeMode extends Mode {
  static HUZAS_HATAR = 110;

  #valasz = "";
  #dontott = false;
  #kezdoX = 0;
  #eltolas = 0;
  #huzas = false;
  #billentyu = null;

  constructor(kartya, lista, szuloElem) {
    super(kartya, lista, szuloElem);
    this.#valasz = Math.random() < 0.5 ? kartya.answer : this.veletlenKartya().answer;
    this.megjelenit();
    this.esemenyeketFigyel();
  }

  megjelenit() {
    this.szuloElem.innerHTML = `
      <div class="swipe">
        <div class="swipe-stage">
          <article class="swipe-card">
            <span class="topic">${this.biztonsagos(this.kartya.topic)}</span>
            <h3 class="swipe-question">${this.biztonsagos(this.kartya.question)}</h3>
            <p class="swipe-answer">${this.biztonsagos(this.#valasz)}</p>
          </article>
        </div>
        <div class="swipe-actions">
          <button type="button" class="swipe-nem">✕ Helytelen</button>
          <button type="button" class="swipe-igen">✓ Helyes</button>
        </div>
        <p class="swipe-hint">Húzd a kártyát, kattints, vagy használd a nyilakat.</p>
      </div>
    `;

    this.kartyaElem = this.szuloElem.querySelector(".swipe-card");
  }

  esemenyeketFigyel() {
    this.szuloElem.querySelector(".swipe-igen").addEventListener("click", () => this.#dontes(true));
    this.szuloElem.querySelector(".swipe-nem").addEventListener("click", () => this.#dontes(false));

    this.kartyaElem.addEventListener("pointerdown", (esemeny) => this.#huzasKezdes(esemeny));
    this.kartyaElem.addEventListener("pointermove", (esemeny) => this.#huzasKozben(esemeny));
    this.kartyaElem.addEventListener("pointerup", () => this.#huzasVege());
    this.kartyaElem.addEventListener("pointercancel", () => this.#huzasVege());

    this.#billentyu = (esemeny) => this.#billentyuKezeles(esemeny);
    document.addEventListener("keydown", this.#billentyu);
  }

  lezar() {
    document.removeEventListener("keydown", this.#billentyu);
  }

  #billentyuKezeles(esemeny) {
    if (esemeny.key === "ArrowRight") {
      this.#dontes(true);
    }
    if (esemeny.key === "ArrowLeft") {
      this.#dontes(false);
    }
  }

  #huzasKezdes(esemeny) {
    if (this.#dontott) {
      return;
    }
    this.#huzas = true;
    this.#kezdoX = esemeny.clientX;
    this.kartyaElem.setPointerCapture(esemeny.pointerId);
    this.kartyaElem.classList.add("is-dragging");
  }

  #huzasKozben(esemeny) {
    if (!this.#huzas) {
      return;
    }
    this.#eltolas = esemeny.clientX - this.#kezdoX;
    this.kartyaElem.style.transform = `translateX(${this.#eltolas}px) rotate(${
      this.#eltolas / 18
    }deg)`;
  }

  #huzasVege() {
    if (!this.#huzas) {
      return;
    }
    this.#huzas = false;
    this.kartyaElem.classList.remove("is-dragging");

    if (Math.abs(this.#eltolas) > SwipeMode.HUZAS_HATAR) {
      this.#dontes(this.#eltolas > 0);
      return;
    }

    this.kartyaElem.style.transform = "";
    this.#eltolas = 0;
  }

  #dontes(igen) {
    if (this.#dontott) {
      return;
    }
    this.#dontott = true;

    const helyes = igen === this.ellenorzes(this.#valasz);
    this.kartyaElem.classList.add(helyes ? "helyes" : "helytelen");
    this.kartyaElem.style.transform = `translateX(${igen ? 420 : -420}px) rotate(${
      igen ? 18 : -18
    }deg)`;

    this.kiertekel(helyes);
  }
}
