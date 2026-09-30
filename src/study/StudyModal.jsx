import { useCallback, useEffect, useRef, useState } from "react";
import useDialog from "../components/useDialog.js";
import CloseButton from "../components/CloseButton.jsx";
import StudySettings from "./StudySettings.jsx";
import FanMatch from "./FanMatch.jsx";
import SwipeMode from "./SwipeMode.jsx";
import TypeMode from "./TypeMode.jsx";
import ShuffleMode from "./ShuffleMode.jsx";
import { kever } from "./modUtils.js";

export const MODOK = {
  fan: {
    nev: "Legyezős párkereső",
    elem: FanMatch,
    szin: "var(--color-accent)",
    pontozott: true,
  },
  swipe: {
    nev: "Gyors döntés",
    elem: SwipeMode,
    szin: "var(--color-success)",
    pontozott: true,
  },
  type: {
    nev: "Gépelős kvíz",
    elem: TypeMode,
    szin: "var(--color-accent-strong)",
    pontozott: true,
  },
  shuffle: {
    nev: "Szabad átnézés",
    elem: ShuffleMode,
    szin: "var(--color-ink)",
    pontozott: false,
  },
};

const INTRO_IDO = 1600;

export default function StudyModal({ lista, beallitasok, onBezar, onCsucs, onIntroElokeszit }) {
  const nyitva = lista !== null;
  const elem = useDialog(nyitva, onBezar);
  const idozito = useRef(0);
  const introKor = useRef(0);

  const [fazis, setFazis] = useState("beallitas");
  const [sor, setSor] = useState([]);
  const [index, setIndex] = useState(0);
  const [pontok, setPontok] = useState(0);
  const [eredmenyek, setEredmenyek] = useState([]);
  const [intro, setIntro] = useState(null);

  const alaphelyzet = useCallback(() => {
    window.clearTimeout(idozito.current);
    introKor.current++;
    setFazis("beallitas");
    setSor([]);
    setIndex(0);
    setPontok(0);
    setEredmenyek([]);
    setIntro(null);
  }, []);

  useEffect(() => {
    if (nyitva) {
      alaphelyzet();
      onIntroElokeszit?.();
    }

    return () => window.clearTimeout(idozito.current);
  }, [nyitva, alaphelyzet, onIntroElokeszit]);

  useEffect(() => {
    if (fazis !== "jatek") {
      return;
    }

    if (index >= sor.length) {
      setFazis("eredmeny");
      onCsucs?.(pontok);
    }
  }, [fazis, index, sor, pontok, onCsucs]);

  const introIndit = (kulcs) => {
    const kor = ++introKor.current;
    const minimum = new Promise((megold) => window.setTimeout(megold, INTRO_IDO));

    setIntro(kulcs);
    Promise.all([minimum, onIntroElokeszit?.()]).then(() => {
      if (introKor.current === kor) {
        setIntro(null);
      }
    });
  };

  const sessionIndul = (modok) => {
    const ujSor = modok.flatMap((mod) =>
      kartyakValasztas(lista, mod.darab).map((kartya) => ({ kulcs: mod.kulcs, kartya }))
    );

    setSor(ujSor);
    setIndex(0);
    setPontok(0);
    setEredmenyek([]);
    setFazis("jatek");

    if (ujSor.length > 0) {
      introIndit(ujSor[0].kulcs);
    }
  };

  const valasz = (helyes) => {
    const pontozott = MODOK[sor[index].kulcs].pontozott;

    if (pontozott) {
      setEredmenyek((elozo) => [...elozo, { kulcs: sor[index].kulcs, helyes }]);

      if (helyes) {
        setPontok((elozo) => elozo + 1);
      }
    }

    const kovetkezo = index + 1;
    const ujKulcs = sor[kovetkezo]?.kulcs;

    window.clearTimeout(idozito.current);
    idozito.current = window.setTimeout(() => {
      setIndex(kovetkezo);

      if (ujKulcs && ujKulcs !== sor[index].kulcs) {
        introIndit(ujKulcs);
      }
    }, pontozott ? 700 : 0);
  };

  const osszes = sor.length;
  const pontozhato = sor.some((obj) => MODOK[obj.kulcs].pontozott);
  const Aktualis = fazis === "jatek" && sor[index] ? MODOK[sor[index].kulcs].elem : null;

  return (
    <dialog id="study-modal" ref={elem}>
      <div className="study">
        <header className="study-head">
          <p className="study-progress">
            {osszes === 0 ? "" : `${Math.min(index + 1, osszes)} / ${osszes}`}
          </p>
          <p className="study-score">
            {eredmenyek.length === 0 && !pontozhato ? "" : `${pontok} pont`}
          </p>
          <CloseButton onClick={onBezar} />
        </header>

        <div className="study-body">
          {fazis === "beallitas" && (
            <StudySettings modok={MODOK} beallitasok={beallitasok} onIndit={sessionIndul} />
          )}

          {Aktualis && !intro && (
            <Aktualis
              key={index}
              kartya={sor[index].kartya}
              lista={lista ?? []}
              onValasz={valasz}
            />
          )}

          {fazis === "eredmeny" && (
            <Eredmeny pontok={pontok} eredmenyek={eredmenyek} onUjra={alaphelyzet} />
          )}
        </div>

        <div className="study-intro" hidden={intro === null} style={introStilus(intro)}>
          <h2>{intro ? MODOK[intro].nev : ""}</h2>
        </div>
      </div>
    </dialog>
  );
}

function Eredmeny({ pontok, eredmenyek, onUjra }) {
  const sorok = Object.keys(MODOK)
    .map((kulcs) => ({
      nev: MODOK[kulcs].nev,
      sajat: eredmenyek.filter((obj) => obj.kulcs === kulcs),
    }))
    .filter((obj) => obj.sajat.length > 0);

  return (
    <div className="result">
      <h2 className="result-title">Session vége</h2>
      <p className="result-score">
        {eredmenyek.length === 0 ? "Nincs pontozott kör" : `${pontok} / ${eredmenyek.length} pont`}
      </p>
      <ul className="result-list">
        {sorok.map((obj) => (
          <li key={obj.nev}>
            <span>{obj.nev}</span>
            <span>
              {obj.sajat.filter((elem) => elem.helyes).length} / {obj.sajat.length}
            </span>
          </li>
        ))}
      </ul>
      <div className="result-actions">
        <button type="button" className="result-again" onClick={onUjra}>
          Új session
        </button>
      </div>
    </div>
  );
}

function introStilus(kulcs) {
  return kulcs ? { "--intro-szin": MODOK[kulcs].szin } : undefined;
}

function kartyakValasztas(lista, darab) {
  const valasztott = [];
  let keszlet = [];

  for (let i = 0; i < darab; i++) {
    if (keszlet.length === 0) {
      keszlet = kever(lista);
    }

    valasztott.push(keszlet.pop());
  }

  return valasztott;
}
