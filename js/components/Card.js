export default class Card {
  static ESEMENYEK = {
    SZERKESZTES: "kartya:szerkesztes",
    TORLES: "kartya:torles",
    TANULAS: "kartya:tanulas",
  };

  #obj = {};

  constructor(obj = { id, topic, question, answer, is_learned }, szuloElem) {
    this.#obj = obj;
    this.szuloElem = szuloElem;
    this.megjelenit();
    this.esemenyeketFigyel();
  }

  get azonosito() {
    return Number(this.#obj.id);
  }

  get adatok() {
    return { ...this.#obj };
  }

  megjelenit() {
    this.szuloElem.insertAdjacentHTML("beforeend", this.#kod());
    this.elem = this.szuloElem.lastElementChild;
  }

  esemenyeketFigyel() {
    this.elem.querySelector(".flip-card-inner").addEventListener("click", (esemeny) => {
      this.#forgat(esemeny);
    });

    this.elem.querySelector(".btn-edit").addEventListener("click", () => {
      this.#esemenyKuldes(Card.ESEMENYEK.SZERKESZTES);
    });

    this.elem.querySelector(".btn-delete").addEventListener("click", () => {
      this.#esemenyKuldes(Card.ESEMENYEK.TORLES);
    });

    this.elem.querySelector(".btn-learned").addEventListener("click", () => {
      this.#esemenyKuldes(Card.ESEMENYEK.TANULAS, { tanult: !this.#tanult() });
    });
  }

  frissit(obj) {
    this.#obj = obj;
    this.elem.classList.toggle("is-learned", this.#tanult());
    this.elem.querySelector(".btn-learned").textContent = this.#gombFelirat();
  }

  #kod() {
    return `
      <article class="flip-card${this.#tanult() ? " is-learned" : ""}" data-id="${this.azonosito}">
        <div class="flip-card-inner">
          <div class="face face--front">
            <header class="card-header">
              <span class="topic">${this.#biztonsagos(this.#obj.topic)}</span>
              <span class="card-actions">
                <button type="button" class="btn-icon btn-edit" aria-label="Kártya szerkesztése" title="Szerkesztés">✎</button>
                <button type="button" class="btn-icon btn-delete" aria-label="Kártya törlése" title="Törlés">✕</button>
              </span>
            </header>
            <p class="question">${this.#biztonsagos(this.#obj.question)}</p>
            <span class="flip-hint">Kattints a válaszért</span>
          </div>
          <div class="face face--back">
            <header class="card-header">
              <span class="topic">${this.#biztonsagos(this.#obj.topic)}</span>
            </header>
            <p class="answer">${this.#biztonsagos(this.#obj.answer)}</p>
            <button type="button" class="btn-learned">${this.#gombFelirat()}</button>
          </div>
        </div>
      </article>
    `;
  }

  #forgat(esemeny) {
    if (esemeny.target.closest("button")) {
      return;
    }
    this.elem.classList.toggle("is-flipped");
  }

  #esemenyKuldes(nev, tovabbiAdat = {}) {
    this.elem.dispatchEvent(
      new CustomEvent(nev, {
        detail: { id: this.azonosito, ...tovabbiAdat },
        bubbles: true,
      })
    );
  }

  #tanult() {
    return Boolean(Number(this.#obj.is_learned));
  }

  #gombFelirat() {
    return this.#tanult() ? "Megtanulva ✓" : "Megtanultam!";
  }

  #biztonsagos(szoveg) {
    const elem = document.createElement("div");
    elem.textContent = szoveg ?? "";
    return elem.innerHTML;
  }
}
