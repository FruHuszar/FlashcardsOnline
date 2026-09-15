import { useCallback, useEffect, useRef, useState } from "react";
import useDialog from "../components/useDialog.js";
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

export default function StudyModal({ lista, onBezar, onCsucs }) {
  const nyitva = lista !== null;
  const elem = useDialog(nyitva, onBezar);
  const utolsoKulcs = useRef("");
  const idozito = useRef(0);

  const [fazis, setFazis] = useState("beallitas");
  const [sor, setSor] = useState([]);
  const [index, setIndex] = useState(0);
  const [pontok, setPontok] = useState(0);
  const [eredmenyek, setEredmenyek] = useState([]);
  const [intro, setIntro] = useState(null);

  const alaphelyzet = useCallback(() => {
    window.clearTimeout(idozito.current);
    utolsoKulcs.current = "";
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
    }

    return () => window.clearTimeout(idozito.current);
  }, [nyitva, alaphelyzet]);

  useEffect(() => {
    if (fazis !== "jatek") {
      return;
    }

    if (index >= sor.length) {
      setFazis("eredmeny");
      onCsucs?.(pontok);
      return;
    }

    const kulcs = sor[index].kulcs;

    if (kulcs !== utolsoKulcs.current) {
      utolsoKulcs.current = kulcs;
      setIntro(kulcs);
      idozito.current = window.setTimeout(() => setIntro(null), 1600);
    }
  }, [fazis, index, sor, pontok, onCsucs]);

  const sessionIndul = (modok) => {
    const ujSor = modok.flatMap((mod) =>
      kartyakValasztas(lista, mod.darab).map((kartya) => ({ kulcs: mod.kulcs, kartya }))
    );

    utolsoKulcs.current = "";
    setSor(ujSor);
    setIndex(0);
    setPontok(0);
    setEredmenyek([]);
    setFazis("jatek");
  };

  const valasz = (helyes) => {
    const pontozott = MODOK[sor[index].kulcs].pontozott;

    if (pontozott) {
      setEredmenyek((elozo) => [...elozo, { kulcs: sor[index].kulcs, helyes }]);

      if (helyes) {
        setPontok((elozo) => elozo + 1);
      }
    }

    window.clearTimeout(idozito.current);
    idozito.current = window.setTimeout(
      () => setIndex((elozo) => elozo + 1),
      pontozott ? 700 : 0
    );
  };

  const osszes = sor.length;
  const pontozhato = sor.some((obj) => MODOK[obj.kulcs].pontozott);
  const gorgetheto = fazis === "jatek" && sor[index]?.kulcs === "type";
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
          <button type="button" className="study-close" aria-label="Bezárás" onClick={onBezar}>
            ✕
          </button>
        </header>

        <div className={gorgetheto ? "study-body study-body--gorgetheto" : "study-body"}>
          {fazis === "beallitas" && <StudySettings modok={MODOK} onIndit={sessionIndul} />}

          {Aktualis && !intro && (
            <Aktualis
              key={index}
              kartya={sor[index].kartya}
              lista={lista ?? []}
              onValasz={valasz}
            />
          )}

          {fazis === "eredmeny" && (
            <Eredmeny
              pontok={pontok}
              eredmenyek={eredmenyek}
              onUjra={alaphelyzet}
              onBezar={onBezar}
            />
          )}
        </div>

        <div className="study-intro" hidden={intro === null} style={introStilus(intro)}>
          <h2>{intro ? MODOK[intro].nev : ""}</h2>
        </div>
      </div>
    </dialog>
  );
}

function Eredmeny({ pontok, eredmenyek, onUjra, onBezar }) {
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
        <button type="button" className="result-close" onClick={onBezar}>
          Bezárás
        </button>
      </div>
    </div>
  );
}

function introStilus(kulcs) {
  return kulcs ? { background: MODOK[kulcs].szin } : undefined;
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
