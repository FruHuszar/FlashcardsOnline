import { useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import CardEntity from "../model/CardEntity.js";
import { idegenValaszok, kever, kulcsok } from "./modUtils.js";

const MIN_LEHETOSEG = 4;
const SOK_LEHETOSEG = 6;

function lehetosegekKeszit(kartya, lista) {
  const helyesek = CardEntity.helyesek(kartya);
  const sajat = CardEntity.opciok(kartya);
  const hibasak =
    sajat.length > 0
      ? sajat
      : idegenValaszok(
          lista,
          kartya,
          Math.max(1, MIN_LEHETOSEG - helyesek.length),
          kulcsok(helyesek)
        ).map((obj) => obj.szoveg);

  return kever([
    ...helyesek.map((szoveg) => ({ szoveg, helyes: true })),
    ...hibasak.map((szoveg) => ({ szoveg, helyes: false })),
  ]);
}

function allapot(obj, jelolt) {
  if (obj.helyes) {
    return jelolt ? "helyes" : "kimaradt";
  }

  return jelolt ? "helytelen" : "";
}

export default function ChoiceMode({ kartya, lista, onValasz }) {
  const lehetosegek = useMemo(() => lehetosegekKeszit(kartya, lista), [kartya, lista]);
  const [kijelolt, setKijelolt] = useState([]);
  const [eredmeny, setEredmeny] = useState(null);
  const kuldve = useRef(false);
  const helyesDarab = CardEntity.helyesek(kartya).length;
  const kiertekelve = eredmeny !== null;

  const valt = (index) => {
    if (kiertekelve) {
      return;
    }

    setKijelolt((elozo) =>
      elozo.includes(index) ? elozo.filter((obj) => obj !== index) : [...elozo, index]
    );
  };

  const ellenoriz = () => {
    if (kiertekelve || kijelolt.length === 0) {
      return;
    }

    setEredmeny(lehetosegek.every((obj, index) => obj.helyes === kijelolt.includes(index)));
  };

  const tovabb = () => {
    if (kuldve.current) {
      return;
    }

    kuldve.current = true;
    onValasz(eredmeny);
  };

  const osztaly = (obj, index) => {
    const jelolt = kijelolt.includes(index);

    return [
      "choice-option",
      jelolt ? "is-selected" : "",
      kiertekelve ? allapot(obj, jelolt) : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="choice">
      <span className="topic">{kartya.topic}</span>
      <h3 className="choice-question">{kartya.question}</h3>

      <p className="choice-hint">
        {helyesDarab > 1
          ? `${helyesDarab} helyes válasz van, jelöld be mindet.`
          : "Jelöld be a helyes választ."}
      </p>

      <div
        className={
          lehetosegek.length > SOK_LEHETOSEG ? "choice-grid choice-grid--sok" : "choice-grid"
        }
      >
        {lehetosegek.map((obj, index) => (
          <button
            key={index}
            type="button"
            className={osztaly(obj, index)}
            aria-pressed={kijelolt.includes(index)}
            aria-disabled={kiertekelve}
            onClick={() => valt(index)}
          >
            <span className="choice-text">{obj.szoveg}</span>
            {kiertekelve && obj.helyes && (
              <Check className="choice-icon" size={18} strokeWidth={2} aria-hidden="true" />
            )}
            {kiertekelve && !obj.helyes && kijelolt.includes(index) && (
              <X className="choice-icon" size={18} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      {kiertekelve ? (
        <div className="choice-result">
          <p className="choice-verdict">{eredmeny ? "Helyes válasz!" : "Nem talált."}</p>
          <button type="button" className="type-next" autoFocus onClick={tovabb}>
            Tovább
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="type-check"
          disabled={kijelolt.length === 0}
          onClick={ellenoriz}
        >
          Ellenőrzés
        </button>
      )}
    </div>
  );
}
