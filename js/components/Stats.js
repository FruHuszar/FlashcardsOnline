export default class Stats {
  static ESEMENYEK = {
    SZURES: "stats:szures",
    TANULAS: "stats:tanulas",
  };

  #lista = [];
  #kereses = "";
  #temakor = "";

  constructor(szuloElem) {
    this.szuloElem = szuloElem;
    this.megjelenit();
    this.esemenyeketFigyel();
  }

  megjelenit() {
    this.szuloElem.innerHTML = `
      <div class="stats-panel">
        <div class="stats-progress"><span class="stats-bar"></span></div>
        <div class="stats-row">
          <p class="stats-numbers">
            <span class="stats-learned">0</span> / <span class="stats-total">0</span> megtanulva
            <span class="stats-percent">0%</span>
          </p>
          <div class="stats-tools">
            <input type="search" class="stats-search" placeholder="Keresés a kártyák között" />
            <button type="button" class="stats-start">Indítás: Tanuló Mód</button>
          </div>
        </div>
        <div class="stats-topics"></div>
      </div>
    `;

    this.barElem = this.szuloElem.querySelector(".stats-bar");
    this.temakorElem = this.szuloElem.querySelector(".stats-topics");
  }

  esemenyeketFigyel() {
    this.szuloElem.querySelector(".stats-search").addEventListener("input", (esemeny) => {
      this.#kereses = esemeny.target.value;
      this.#szuresKuldes();
    });

    this.temakorElem.addEventListener("click", (esemeny) => {
      const gomb = esemeny.target.closest(".stats-topic");
      if (!gomb) {
        return;
      }
      this.#temakor = gomb.dataset.temakor;
      this.#temakorokFrissites();
      this.#szuresKuldes();
    });

    this.szuloElem.querySelector(".stats-start").addEventListener("click", () => {
      this.szuloElem.dispatchEvent(new CustomEvent(Stats.ESEMENYEK.TANULAS, { detail: {} }));
    });
  }

  frissit(lista) {
    this.#lista = lista;
    this.#szamlalokFrissites();
    this.#temakorokFrissites();
  }

  #szamlalokFrissites() {
    const osszes = this.#lista.length;
    const tanult = this.#lista.filter((obj) => Number(obj.is_learned) === 1).length;
    const szazalek = osszes === 0 ? 0 : Math.round((tanult / osszes) * 100);

    this.szuloElem.querySelector(".stats-total").textContent = osszes;
    this.szuloElem.querySelector(".stats-learned").textContent = tanult;
    this.szuloElem.querySelector(".stats-percent").textContent = `${szazalek}%`;
    this.barElem.style.width = `${szazalek}%`;
  }

  #temakorokFrissites() {
    const temakorok = [...new Set(this.#lista.map((obj) => obj.topic))].sort();
    const elveszett = this.#temakor !== "" && !temakorok.includes(this.#temakor);

    if (elveszett) {
      this.#temakor = "";
    }

    this.temakorElem.innerHTML = "";
    ["", ...temakorok].forEach((temakor) => this.#temakorGomb(temakor));

    if (elveszett) {
      this.#szuresKuldes();
    }
  }

  #temakorGomb(temakor) {
    const gomb = document.createElement("button");
    gomb.type = "button";
    gomb.className = temakor === this.#temakor ? "stats-topic is-active" : "stats-topic";
    gomb.dataset.temakor = temakor;
    gomb.textContent = temakor === "" ? "Összes" : temakor;
    this.temakorElem.appendChild(gomb);
  }

  #szuresKuldes() {
    this.szuloElem.dispatchEvent(
      new CustomEvent(Stats.ESEMENYEK.SZURES, {
        detail: { kereses: this.#kereses, temakor: this.#temakor },
      })
    );
  }
}
