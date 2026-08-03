export default class Service {
  #vegpont = "";

  constructor(vegpont) {
    this.#vegpont = vegpont;
  }

  lekerdez() {
    return fetch(this.#vegpont)
      .then((valasz) => this.#feldolgoz(valasz))
      .then((eredmeny) => eredmeny.data);
  }

  letrehoz(obj) {
    return fetch(this.#vegpont, this.#beallitasok("POST", obj))
      .then((valasz) => this.#feldolgoz(valasz))
      .then((eredmeny) => eredmeny.data);
  }

  modosit(id, obj) {
    return fetch(`${this.#vegpont}?id=${id}`, this.#beallitasok("PUT", obj))
      .then((valasz) => this.#feldolgoz(valasz))
      .then((eredmeny) => eredmeny.data);
  }

  torol(id) {
    return fetch(`${this.#vegpont}?id=${id}`, { method: "DELETE" }).then((valasz) =>
      this.#feldolgoz(valasz)
    );
  }

  #beallitasok(metodus, obj) {
    return {
      method: metodus,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    };
  }

  #feldolgoz(valasz) {
    return valasz
      .json()
      .catch(() => null)
      .then((tartalom) => {
        if (!valasz.ok || tartalom?.status === "error") {
          throw new Error(tartalom?.message ?? "Hiba történt a szerverrel való kommunikáció során.");
        }
        return tartalom;
      });
  }
}
