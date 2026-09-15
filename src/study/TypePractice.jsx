import { useEffect, useRef, useState } from "react";

const RESZINKRON_HOSSZ = 4;

function egyezik(beirt, vart) {
  if (beirt === undefined || vart === undefined) {
    return false;
  }

  if (beirt === vart) {
    return true;
  }

  if (/\s/.test(vart) && /\s/.test(beirt)) {
    return true;
  }

  return beirt.toLowerCase() === vart.toLowerCase();
}

function reszinkron(szoveg, hossz, puffer) {
  if (puffer.length < RESZINKRON_HOSSZ) {
    return false;
  }

  return puffer.every((betu, i) => egyezik(betu, szoveg[hossz + 1 + i]));
}

export default function TypePractice({ szoveg, onKesz }) {
  const beviteli = useRef(null);
  const puffer = useRef([]);
  const [hossz, setHossz] = useState(0);
  const [hiba, setHiba] = useState(false);
  const [elirtak, setElirtak] = useState([]);

  useEffect(() => {
    puffer.current = [];
    setHossz(0);
    setHiba(false);
    setElirtak([]);
  }, [szoveg]);

  const kesz = hossz >= szoveg.length;

  const lep = (ujHossz) => {
    setHossz(ujHossz);

    if (ujHossz >= szoveg.length) {
      onKesz?.();
    }
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

    if (puffer.current.length === 0 && egyezik(betu, szoveg[hossz])) {
      setHiba(false);
      lep(hossz + 1);
      return;
    }

    puffer.current = [...puffer.current, betu];
    setHiba(true);

    if (reszinkron(szoveg, hossz, puffer.current)) {
      const ugras = hossz + 1 + puffer.current.length;
      puffer.current = [];
      setHiba(false);
      setElirtak((elozo) => [...elozo, hossz]);
      lep(Math.min(ugras, szoveg.length));
      return;
    }

    if (puffer.current.length > RESZINKRON_HOSSZ) {
      puffer.current = puffer.current.slice(1);
    }
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
