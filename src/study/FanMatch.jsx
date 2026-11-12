import { useMemo, useState } from "react";
import CardEntity from "../model/CardEntity.js";
import { idegenValaszok, kever, kulcsok, veletlenElem } from "./modUtils.js";

const DARAB = 8;
const MAX_HIBA = 2;

const MERETEK = [
  { hossz: 40, betu: "0.85rem" },
  { hossz: 70, betu: "0.76rem" },
  { hossz: 110, betu: "0.68rem" },
  { hossz: 160, betu: "0.63rem" },
];

const MIN_BETU = "0.58rem";

function betumeret(szoveg) {
  const hossz = String(szoveg ?? "").length;
  return MERETEK.find((obj) => hossz <= obj.hossz)?.betu ?? MIN_BETU;
}

export default function FanMatch({ kartya, lista, onValasz }) {
  const [hibak, setHibak] = useState(0);
  const [lezarva, setLezarva] = useState(false);
  const [forditott, setForditott] = useState([]);

  const lehetosegek = useMemo(() => {
    const helyesek = CardEntity.helyesek(kartya);
    const sajat = kever(CardEntity.opciok(kartya)).slice(0, DARAB - 1);
    const idegen = idegenValaszok(
      lista,
      kartya,
      DARAB - 1 - sajat.length,
      kulcsok([...helyesek, ...sajat])
    );

    return kever([
      { szoveg: veletlenElem(helyesek), hatulja: kartya.question, helyes: true },
      ...sajat.map((szoveg) => ({ szoveg, hatulja: szoveg, helyes: false })),
      ...idegen.map((obj) => ({
        szoveg: obj.szoveg,
        hatulja: obj.kartya.question,
        helyes: false,
      })),
    ]);
  }, [kartya, lista]);

  const szog = 360 / lehetosegek.length;

  const valasztas = (index, helyes) => {
    if (lezarva || forditott.includes(index)) {
      return;
    }

    setForditott((elozo) => [...elozo, index]);

    if (helyes) {
      setLezarva(true);
      onValasz(hibak === 0);
      return;
    }

    const ujHibak = hibak + 1;
    setHibak(ujHibak);

    if (ujHibak >= MAX_HIBA) {
      setLezarva(true);
      setForditott((elozo) => [
        ...elozo,
        lehetosegek.findIndex((obj) => obj.helyes),
      ]);
      onValasz(false);
    }
  };

  const osztaly = (index, obj) => {
    const nevek = ["fan-card"];

    if (forditott.includes(index)) {
      nevek.push("is-flipped", obj.helyes ? "helyes" : "helytelen");
    }

    return nevek.join(" ");
  };

  return (
    <div className="fan">
      <div className="fan-question">
        <span className="topic">{kartya.topic}</span>
        <h3>{kartya.question}</h3>
        <p className="fan-hint">Kattints arra a válaszra, amelyik ehhez a kérdéshez tartozik.</p>
      </div>

      <div className="fan-stage">
        <div className="fan-wheel">
          {lehetosegek.map((obj, index) => (
            <button
              key={index}
              type="button"
              className={osztaly(index, obj)}
              style={{
                "--szog": `${index * szog}deg`,
                "--betu": betumeret(obj.szoveg),
              }}
              data-helyes={String(obj.helyes)}
              onClick={() => valasztas(index, obj.helyes)}
            >
              <span className="fan-inner">
                <span className="fan-face fan-face--valasz">{obj.szoveg}</span>
                <span className="fan-face fan-face--kerdes">{obj.hatulja}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
