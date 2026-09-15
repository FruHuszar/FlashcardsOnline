import { CONFIG } from "../config.js";
import CardEntity from "../model/CardEntity.js";

export default class JsonImporter {
  static LISTA_KULCSOK = ["cards", "kartyak", "data", "items", "flashcards"];

  static elemez(szoveg) {
    const nyers = JsonImporter.#parse(szoveg);
    const lista = JsonImporter.#lista(nyers);

    if (lista.length === 0) {
      throw new Error("A JSON nem tartalmaz kártyákat.");
    }

    if (lista.length > CONFIG.IMPORT_MAX_DARAB) {
      throw new Error(
        `Egyszerre legfeljebb ${CONFIG.IMPORT_MAX_DARAB} kártya importálható. (Kaptunk: ${lista.length})`
      );
    }

    const ellenorzott = lista.map((obj) => CardEntity.letrehoz(obj, 0));
    const jo = ellenorzott.filter(Boolean);

    if (jo.length === 0) {
      throw new Error(
        "Egyetlen érvényes kártya sincs a JSON-ban. Minden kártyához kell kérdés és válasz."
      );
    }

    return { lista: jo, ervenytelen: ellenorzott.length - jo.length };
  }

  static minta() {
    return JSON.stringify(
      [
        {
          topic: "HTTP",
          question: "Mit jelent a 404-es státuszkód?",
          answer: "Not Found – a kért erőforrás nem található.",
        },
        {
          topic: "SQL",
          question: "Mire való a GROUP BY?",
          answer: "Sorok csoportosítására aggregáló függvényekhez.",
          is_learned: 1,
        },
      ],
      null,
      2
    );
  }

  static #parse(szoveg) {
    const tisztitott = String(szoveg ?? "").trim();

    if (tisztitott === "") {
      throw new Error("Illessz be JSON tartalmat, vagy válassz ki egy fájlt.");
    }

    try {
      return JSON.parse(tisztitott);
    } catch (hiba) {
      throw new Error(`Hibás JSON formátum: ${hiba.message}`);
    }
  }

  static #lista(nyers) {
    if (Array.isArray(nyers)) {
      return nyers;
    }

    if (!nyers || typeof nyers !== "object") {
      throw new Error("A JSON gyökere nem tömb és nem objektum.");
    }

    const kulcs = JsonImporter.LISTA_KULCSOK.find((nev) =>
      Array.isArray(nyers[nev])
    );

    if (!kulcs) {
      throw new Error(
        'A JSON-nak tömbnek kell lennie, vagy tartalmaznia kell egy "cards" tömböt.'
      );
    }

    return nyers[kulcs];
  }
}
