import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import CardEntity from "../model/CardEntity.js";
import { ertekeles } from "./answerCheck.js";
import TypePractice from "./TypePractice.jsx";

export default function TypeMode({ kartya, onValasz }) {
  const beviteli = useRef(null);
  const [ertek, setErtek] = useState("");
  const [eredmeny, setEredmeny] = useState(null);
  const [gyakorlasKesz, setGyakorlasKesz] = useState(false);
  const helyesValasz = CardEntity.valaszSzoveg(kartya);

  useEffect(() => {
    beviteli.current?.focus();
  }, []);

  const ertekel = () => {
    if (eredmeny !== null) {
      return;
    }

    flushSync(() => setEredmeny(ertekeles(ertek, helyesValasz)));
  };

  const helyes = eredmeny?.helyes ?? false;

  return (
    <div className="type">
      <span className="topic">{kartya.topic}</span>
      <h3 className="type-question">{kartya.question}</h3>

      <input
        type="text"
        className={
          eredmeny === null ? "type-input" : `type-input ${helyes ? "helyes" : "helytelen"}`
        }
        placeholder="Írd be a választ"
        autoComplete="off"
        ref={beviteli}
        value={ertek}
        disabled={eredmeny !== null}
        onChange={(ok) => setErtek(ok.target.value)}
        onKeyDown={(ok) => ok.key === "Enter" && ertekel()}
      />

      <button type="button" className="type-check" hidden={eredmeny !== null} onClick={ertekel}>
        Ellenőrzés
      </button>

      <p className="type-hint" hidden={eredmeny !== null}>
        Nem kell szó szerint: elég a lényeg. A kis- és nagybetű nem számít.
      </p>

      <div className="type-result" hidden={eredmeny === null}>
        <p className="type-verdict">{helyes ? "Helyes válasz!" : "Nem talált."}</p>
        {eredmeny && (
          <p className="type-score">
            {eredmeny.talalt} / {eredmeny.kell} kulcsszó · {Math.round(eredmeny.szazalek * 100)}%
            egyezés
          </p>
        )}

        {eredmeny !== null && !helyes ? (
          <TypePractice szoveg={helyesValasz} onKesz={() => setGyakorlasKesz(true)} />
        ) : (
          <p className="type-correct">A pontos válasz: {helyesValasz}</p>
        )}

        <button
          type="button"
          className="type-next"
          onClick={() => onValasz(helyes || gyakorlasKesz)}
        >
          Tovább
        </button>
      </div>
    </div>
  );
}
