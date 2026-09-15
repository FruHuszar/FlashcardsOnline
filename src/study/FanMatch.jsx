import { useMemo, useState } from "react";
import { kever } from "./modUtils.js";

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

function kulcs(obj) {
  return String(obj?.answer ?? "").toLowerCase().trim();
}

export default function FanMatch({ kartya, lista, onValasz }) {
  const [hibak, setHibak] = useState(0);
  const [lezarva, setLezarva] = useState(false);
  const [forditott, setForditott] = useState([]);

  const lehetosegek = useMemo(() => {
    const latott = new Set([kulcs(kartya)]);
    const hibasak = [];

    kever(lista).forEach((obj) => {
      const sajat = kulcs(obj);

      if (latott.has(sajat) || hibasak.length >= DARAB - 1) {
        return;
      }

      latott.add(sajat);
      hibasak.push({ kartya: obj, helyes: false });
    });

    return kever([{ kartya, helyes: true }, ...hibasak]);
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
              key={obj.kartya.id}
              type="button"
              className={osztaly(index, obj)}
              style={{
                "--szog": `${index * szog}deg`,
                "--betu": betumeret(obj.kartya.answer),
              }}
              data-helyes={String(obj.helyes)}
              onClick={() => valasztas(index, obj.helyes)}
            >
              <span className="fan-inner">
                <span className="fan-face fan-face--valasz">{obj.kartya.answer}</span>
                <span className="fan-face fan-face--kerdes">{obj.kartya.question}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
