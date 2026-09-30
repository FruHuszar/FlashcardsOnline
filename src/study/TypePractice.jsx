import { useLayoutEffect, useRef, useState } from "react";
import { ekezetNelkul } from "./answerCheck.js";

const RESZINKRON_HOSSZ = 4;

function egyezik(beirt, vart) {
  if (beirt === undefined || vart === undefined) {
    return false;
  }

  if (/\s/.test(vart) && /\s/.test(beirt)) {
    return true;
  }

  return ekezetNelkul(beirt) === ekezetNelkul(vart);
}

function igazodik(szoveg, hossz, puffer) {
  return puffer.every((betu, i) => egyezik(betu, szoveg[hossz + 1 + i]));
}

function reszinkron(szoveg, hossz, puffer) {
  return puffer.length >= RESZINKRON_HOSSZ || hossz + 1 + puffer.length >= szoveg.length;
}

export default function TypePractice({ szoveg, onKesz }) {
  const beviteli = useRef(null);
  const puffer = useRef([]);
  const [hossz, setHossz] = useState(0);
  const [hiba, setHiba] = useState(false);
  const [elirtak, setElirtak] = useState([]);

  useLayoutEffect(() => {
    puffer.current = [];
    setHossz(0);
    setHiba(false);
    setElirtak([]);
    beviteli.current?.focus();
  }, [szoveg]);

  const kesz = hossz >= szoveg.length;

  const lep = (ujHossz) => {
    setHossz(ujHossz);

    if (ujHossz >= szoveg.length) {
      onKesz?.();
    }
  };

  const tovabb = (ujHossz) => {
    puffer.current = [];
    setHiba(false);
    setElirtak((elozo) => [...elozo, hossz]);
    lep(Math.min(ujHossz, szoveg.length));
  };

  const hibasBetu = (betu, javitas) => {
    if (javitas && puffer.current.length === 0) {
      tovabb(hossz + 1);
      return;
    }

    const jelolt = [...puffer.current, betu];

    if (igazodik(szoveg, hossz, jelolt)) {
      if (reszinkron(szoveg, hossz, jelolt)) {
        tovabb(hossz + 1 + jelolt.length);
        return;
      }

      puffer.current = jelolt;
      return;
    }

    if (javitas) {
      tovabb(hossz + 1);
      return;
    }

    puffer.current = igazodik(szoveg, hossz, [betu]) ? [betu] : [];
  };

  const valtozas = (ok) => {
    const ertek = ok.target.value;

    if (kesz) {
      return;
    }

    if (ertek.length < hossz) {
      puffer.current = [];
      setHiba(false);
      setHossz(ertek.length);
      return;
    }

    if (ertek.length === hossz) {
      return;
    }

    const betu = ertek[ertek.length - 1];
    const javitas = egyezik(betu, szoveg[hossz]);

    if (hiba) {
      hibasBetu(betu, javitas);
      return;
    }

    if (javitas) {
      lep(hossz + 1);
      return;
    }

    puffer.current = [];
    setHiba(true);
  };

  const osztaly = (index) => {
    if (elirtak.includes(index)) {
      return "practice-char is-done is-typo";
    }

    if (index < hossz) {
      return "practice-char is-done";
    }

    if (index === hossz) {
      return hiba ? "practice-char is-current is-error" : "practice-char is-current";
    }

    return "practice-char";
  };

  return (
    <div className="practice">
      <p className="practice-label">
        Gyakorlás: gépeld le a választ. Ha végigérsz, egy pont jár érte.
      </p>

      <div
        className={kesz ? "practice-box is-done" : "practice-box"}
        onClick={() => beviteli.current?.focus()}
      >
        <p className="practice-text">
          {[...szoveg].map((betu, index) => (
            <span key={`${index}-${betu}`} className={osztaly(index)}>
              {betu}
            </span>
          ))}
        </p>

        <input
          type="text"
          className="practice-input"
          ref={beviteli}
          value={szoveg.slice(0, hossz)}
          onChange={valtozas}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Gyakorló mező"
        />
      </div>

      <p className={kesz ? "practice-status is-done" : "practice-status"}>
        {kesz
          ? "Kész! Végiggépelted, jár érte egy pont."
          : `${hossz} / ${szoveg.length} karakter`}
      </p>
    </div>
  );
}
