import Mode from "./Mode.js";
import StudySettings from "./StudySettings.js";
import FanMatch from "./FanMatch.js";
import SwipeMode from "./SwipeMode.js";
import TypeMode from "./TypeMode.js";

export default class Study {
  static MODOK = {
    fan: { nev: "Legyezős párkereső", osztaly: FanMatch, szin: "var(--color-accent)" },
    swipe: { nev: "Gyors döntés", osztaly: SwipeMode, szin: "var(--color-success)" },
    type: { nev: "Gépelős kvíz", osztaly: TypeMode, szin: "var(--color-accent-strong)" },
  };

  #lista = [];
  #sor = [];
  #eredmenyek = [];
  #index = 0;
  #pontok = 0;
  #utolsoKulcs = "";
  #aktualisMod = null;
  #idozito = 0;

  constructor(elem) {
    this.elem = elem;
    this.megjelenit();
    this.esemenyeketFigyel();
  }

  megjelenit() {
    this.elem.innerHTML = `
      <div class="study">
        <header class="study-head">
          <p class="study-progress"></p>
          <p class="study-score"></p>
          <button type="button" class="study-close" aria-label="Bezárás">✕</button>
        </header>
        <div class="study-body"></div>
        <div class="study-intro" hidden><h2></h2></div>
      </div>
    `;

    this.testElem = this.elem.querySelector(".study-body");
    this.introElem = this.elem.querySelector(".study-intro");
  }

  esemenyeketFigyel() {
    this.elem.querySelector(".study-close").addEventListener("click", () => this.bezar());
    this.elem.addEventListener("close", () => this.#takaritas());

    this.elem.addEventListener(StudySettings.ESEMENYEK.KESZ, (esemeny) => {
      this.#sessionIndul(esemeny.detail);
    });

    this.elem.addEventListener(Mode.ESEMENYEK.VALASZ, (esemeny) => {
      this.#valasz(esemeny.detail);
    });
  }

  indit(lista) {
    if (lista.length === 0) {
      window.alert("Előbb hozz létre kártyákat a tanuláshoz.");
      return;
    }

    this.#lista = lista;
    this.#beallitas();
    this.elem.showModal();
  }

  bezar() {
    this.elem.close();
  }

  #takaritas() {
    window.clearTimeout(this.#idozito);
    this.#modLezaras();
    this.introElem.hidden = true;
  }

  #beallitas() {
    this.#modLezaras();
    this.#sor = [];
    this.#eredmenyek = [];
    this.#index = 0;
    this.#pontok = 0;
    this.#utolsoKulcs = "";
    this.#fejlecFrissites();
    new StudySettings(this.testElem, Study.MODOK);
  }

  #sessionIndul(obj) {
    this.#sor = obj.modok.flatMap((mod) =>
      this.#kartyakValasztas(mod.darab).map((kartya) => ({ kulcs: mod.kulcs, kartya }))
    );
    this.#kovetkezo();
  }

  #kovetkezo() {
    if (this.#index >= this.#sor.length) {
      this.#eredmeny();
      return;
    }

    const elem = this.#sor[this.#index];
    this.#fejlecFrissites();

    if (elem.kulcs !== this.#utolsoKulcs) {
      this.#utolsoKulcs = elem.kulcs;
      this.#intro(elem.kulcs, () => this.#modInditas(elem));
      return;
    }

    this.#modInditas(elem);
  }

  #intro(kulcs, kesz) {
    const mod = Study.MODOK[kulcs];
    this.introElem.style.background = mod.szin;
    this.introElem.querySelector("h2").textContent = mod.nev;
    this.introElem.hidden = false;

    this.#idozit(() => {
      this.introElem.hidden = true;
      kesz();
    }, 1600);
  }

  #modInditas(elem) {
    this.#modLezaras();
    const mod = Study.MODOK[elem.kulcs];
    this.#aktualisMod = new mod.osztaly(elem.kartya, this.#lista, this.testElem);
  }

  #valasz(obj) {
    if (!this.#aktualisMod) {
      return;
    }

    this.#eredmenyek.push({ kulcs: this.#utolsoKulcs, helyes: obj.helyes });
    this.#modLezaras();

    if (obj.helyes) {
      this.#pontok++;
    }

    this.#index++;
    this.#fejlecFrissites();
    this.#idozit(() => this.#kovetkezo(), 700);
  }

  #eredmeny() {
    this.#modLezaras();
    this.#utolsoKulcs = "";

    this.testElem.innerHTML = `
      <div class="result">
        <h2 class="result-title">Session vége</h2>
        <p class="result-score">${this.#pontok} / ${this.#eredmenyek.length} pont</p>
        <ul class="result-list">${this.#osszesitesKod()}</ul>
        <div class="result-actions">
          <button type="button" class="result-again">Új session</button>
          <button type="button" class="result-close">Bezárás</button>
        </div>
      </div>
    `;

    this.testElem.querySelector(".result-again").addEventListener("click", () => this.#beallitas());
    this.testElem.querySelector(".result-close").addEventListener("click", () => this.bezar());
  }

  #osszesitesKod() {
    return Object.keys(Study.MODOK)
      .map((kulcs) => ({
        nev: Study.MODOK[kulcs].nev,
        sajat: this.#eredmenyek.filter((obj) => obj.kulcs === kulcs),
      }))
      .filter((obj) => obj.sajat.length > 0)
      .map(
        (obj) =>
          `<li><span>${obj.nev}</span><span>${
            obj.sajat.filter((elem) => elem.helyes).length
          } / ${obj.sajat.length}</span></li>`
      )
      .join("");
  }

  #kartyakValasztas(darab) {
    const valasztott = [];
    let keszlet = [];

    for (let i = 0; i < darab; i++) {
      if (keszlet.length === 0) {
        keszlet = this.#kevert();
      }
      valasztott.push(keszlet.pop());
    }

    return valasztott;
  }

  #kevert() {
    return [...this.#lista].sort(() => Math.random() - 0.5);
  }

  #modLezaras() {
    this.#aktualisMod?.lezar();
    this.#aktualisMod = null;
  }

  #fejlecFrissites() {
    const osszes = this.#sor.length;
    this.elem.querySelector(".study-progress").textContent =
      osszes === 0 ? "" : `${Math.min(this.#index + 1, osszes)} / ${osszes}`;
    this.elem.querySelector(".study-score").textContent =
      osszes === 0 ? "" : `${this.#pontok} pont`;
  }

  #idozit(fuggveny, ido) {
    window.clearTimeout(this.#idozito);
    this.#idozito = window.setTimeout(fuggveny, ido);
  }
}
