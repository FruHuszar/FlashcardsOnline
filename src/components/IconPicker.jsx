import { useEffect, useRef, useState } from "react";
import CardIcon from "../design/CardIcons.jsx";
import { IKONOK } from "../design/ikonKeszlet.js";

export default function IconPicker({ ertek, onValaszt }) {
  const [nyitva, setNyitva] = useState(false);
  const doboz = useRef(null);
  const aktualis = IKONOK.find((obj) => obj.nev === ertek) ?? IKONOK[0];

  useEffect(() => {
    if (!nyitva) {
      return undefined;
    }

    const kattintas = (ok) => {
      if (!doboz.current?.contains(ok.target)) {
        setNyitva(false);
      }
    };

    document.addEventListener("mousedown", kattintas);
    return () => document.removeEventListener("mousedown", kattintas);
  }, [nyitva]);

  return (
    <div className="icon-picker" ref={doboz}>
      <button
        type="button"
        className="icon-picker-trigger"
        onClick={() => setNyitva((elozo) => !elozo)}
        aria-haspopup="listbox"
        aria-expanded={nyitva}
      >
        <CardIcon nev={aktualis.nev} meret={20} />
        <span>{aktualis.cimke}</span>
        <span className="icon-picker-arrow">▾</span>
      </button>

      {nyitva && (
        <div className="icon-picker-list" role="listbox">
          {IKONOK.map((obj) => (
            <button
              key={obj.nev}
              type="button"
              role="option"
              aria-selected={obj.nev === ertek}
              title={obj.cimke}
              className={
                obj.nev === ertek ? "icon-picker-item is-active" : "icon-picker-item"
              }
              onClick={() => {
                onValaszt(obj.nev);
                setNyitva(false);
              }}
            >
              <CardIcon nev={obj.nev} meret={20} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
