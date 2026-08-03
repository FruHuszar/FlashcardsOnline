export default class StudySettings {
  static ESEMENYEK = {
    KESZ: "beallitas:kesz",
  };

  #modok = {};

  constructor(szuloElem, modok) {
    this.szuloElem = szuloElem;
    this.#modok = modok;
    this.megjelenit();
    this.esemenyeketFigyel();
  }

  megjelenit() {
    this.szuloElem.innerHTML = `
      <div class="settings">
        <h2 class="settings-title">Tanuló mód</h2>
        <p class="settings-lead">Válaszd ki a játékmódokat és a kérdések számát.</p>
        <div class="settings-list">${this.#modokKod()}</div>
        <p class="settings-error" hidden></p>
        <button type="button" class="settings-start">Indítás</button>
      </div>
    `;

    this.hibaElem = this.szuloElem.querySelector(".settings-error");
  }

  esemenyeketFigyel() {
    this.szuloElem.querySelector(".settings-start").addEventListener("click", () => this.#kesz());
  }

  #modokKod() {
    return Object.keys(this.#modok)
      .map(
        (kulcs) => `
        <div class="settings-item">
          <label class="settings-name">
            <input type="checkbox" class="settings-check" data-kulcs="${kulcs}" checked />
            <span>${this.#modok[kulcs].nev}</span>
          </label>
          <input type="number" class="settings-db" data-kulcs="${kulcs}" min="1" max="30" value="5" />
        </div>
      `
      )
      .join("");
  }

  #kesz() {
    const modok = this.#kivalasztottak();

    if (modok.length === 0) {
      this.#hiba("Válassz ki legalább egy játékmódot.");
      return;
    }

    this.szuloElem.dispatchEvent(
      new CustomEvent(StudySettings.ESEMENYEK.KESZ, {
        detail: { modok },
        bubbles: true,
      })
    );
  }

  #kivalasztottak() {
    return [...this.szuloElem.querySelectorAll(".settings-check")]
      .filter((elem) => elem.checked)
      .map((elem) => ({
        kulcs: elem.dataset.kulcs,
        darab: this.#darab(elem.dataset.kulcs),
      }));
  }

  #darab(kulcs) {
    const elem = this.szuloElem.querySelector(`.settings-db[data-kulcs="${kulcs}"]`);
    const ertek = Number(elem.value);
    return ertek > 0 ? ertek : 1;
  }

  #hiba(uzenet) {
    this.hibaElem.textContent = uzenet;
    this.hibaElem.hidden = false;
  }
}
