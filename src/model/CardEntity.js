import { CONFIG } from "../config.js";
import { ALAP_IKON, ervenyesIkon } from "../design/ikonKeszlet.js";

export default class CardEntity {
  static MEZOK = ["id", "topic", "question", "answer", "icon", "is_learned", "created_at"];

  static ALIASOK = {
    topic: ["topic", "temakor", "tema", "category", "kategoria", "deck", "tag"],
    question: ["question", "kerdes", "q", "front", "eleje", "term"],
    answer: ["answer", "valasz", "a", "back", "hatulja", "definition", "def"],
    is_learned: ["is_learned", "learned", "tanult", "megtanulva", "known"],
    icon: ["icon", "ikon", "symbol", "jel"],
  };

  static letrehoz(nyers, id) {
    if (!CardEntity.#objektum(nyers)) {
      return null;
    }

    const topic = CardEntity.#mezo(nyers, "topic", CONFIG.TEMAKOR_MAX_HOSSZ);
    const question = CardEntity.#mezo(nyers, "question", CONFIG.MEZO_MAX_HOSSZ);
    const answer = CardEntity.#mezo(nyers, "answer", CONFIG.MEZO_MAX_HOSSZ);

    if (question === "" || answer === "") {
      return null;
    }

    return {
      id: Number(id),
      topic: topic === "" ? "Általános" : topic,
      question,
      answer,
      icon: CardEntity.#ikon(nyers),
      is_learned: CardEntity.#tanult(nyers) ? 1 : 0,
      created_at: CardEntity.#datum(nyers),
    };
  }

  static modosit(eredeti, valtozas) {
    const uj = CardEntity.letrehoz({ ...eredeti, ...valtozas }, eredeti.id);
    if (!uj) {
      return null;
    }
    uj.created_at = eredeti.created_at;
    return uj;
  }

  static kulcs(obj) {
    return [obj.topic, obj.question, obj.answer]
      .map((szoveg) => String(szoveg).toLowerCase().trim())
      .join("\u0000");
  }

  static #objektum(ertek) {
    return Boolean(ertek) && typeof ertek === "object" && !Array.isArray(ertek);
  }

  static #mezo(nyers, nev, maxHossz) {
    const nevek = CardEntity.ALIASOK[nev] ?? [nev];
    const talalt = nevek.find((kulcs) => CardEntity.#sajat(nyers, kulcs));
    return CardEntity.#tisztit(talalt ? nyers[talalt] : "", maxHossz);
  }

  static #sajat(nyers, kulcs) {
    return Object.prototype.hasOwnProperty.call(nyers, kulcs);
  }

  static #tisztit(ertek, maxHossz) {
    if (typeof ertek === "number" || typeof ertek === "boolean") {
      ertek = String(ertek);
    }

    if (typeof ertek !== "string") {
      return "";
    }

    return ertek

      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/\r\n?/g, "\n")
      .trim()
      .slice(0, maxHossz);
  }

  static #ikon(nyers) {
    const nevek = CardEntity.ALIASOK.icon;
    const talalt = nevek.find((kulcs) => CardEntity.#sajat(nyers, kulcs));

    if (!talalt) {
      return ALAP_IKON;
    }

    return ervenyesIkon(CardEntity.#tisztit(nyers[talalt], 40));
  }

  static #tanult(nyers) {
    const nevek = CardEntity.ALIASOK.is_learned;
    const talalt = nevek.find((kulcs) => CardEntity.#sajat(nyers, kulcs));
    const ertek = talalt ? nyers[talalt] : 0;

    if (typeof ertek === "string") {
      return ["1", "true", "igen", "yes"].includes(ertek.toLowerCase().trim());
    }

    return Boolean(Number(ertek));
  }

  static #datum(nyers) {
    const ertek = CardEntity.#sajat(nyers, "created_at") ? nyers.created_at : null;
    const datum = ertek ? new Date(ertek) : new Date();
    return Number.isNaN(datum.getTime())
      ? new Date().toISOString()
      : datum.toISOString();
  }
}
