import { useEffect, useState } from "react";
import StudyPreferences from "./StudyPreferences.js";

export default function StudySettings({ modok, beallitasok, onIndit }) {
  const [allapot, setAllapot] = useState(() => beallitasok.olvas(Object.keys(modok)));
  const [hiba, setHiba] = useState("");

  useEffect(() => {
    beallitasok.ment(allapot);
  }, [beallitasok, allapot]);

  const modosit = (kulcs, valtozas) =>
    setAllapot((elozo) => ({ ...elozo, [kulcs]: { ...elozo[kulcs], ...valtozas } }));

  const indit = () => {
    const kivalasztott = Object.keys(allapot)
      .filter((kulcs) => allapot[kulcs].aktiv)
      .map((kulcs) => ({
        kulcs,
        darab: Number(allapot[kulcs].darab) > 0 ? Number(allapot[kulcs].darab) : 1,
      }));

    if (kivalasztott.length === 0) {
      setHiba("Válassz ki legalább egy játékmódot.");
      return;
    }

    onIndit(kivalasztott);
  };

  return (
    <div className="settings">
      <h2 className="settings-title">Tanuló mód</h2>
      <p className="settings-lead">Válaszd ki a játékmódokat és a kérdések számát.</p>

      <div className="settings-list">
        {Object.keys(modok).map((kulcs) => (
          <div className="settings-item" key={kulcs}>
            <label className="settings-name">
              <input
                type="checkbox"
                className="settings-check"
                checked={allapot[kulcs].aktiv}
                onChange={(ok) => modosit(kulcs, { aktiv: ok.target.checked })}
              />
              <span>{modok[kulcs].nev}</span>
            </label>
            <input
              type="number"
              className="settings-db"
              min={StudyPreferences.MIN_DARAB}
              max={StudyPreferences.MAX_DARAB}
              value={allapot[kulcs].darab}
              onChange={(ok) => modosit(kulcs, { darab: ok.target.value })}
            />
          </div>
        ))}
      </div>

      <p className="settings-error" hidden={hiba === ""}>
        {hiba}
      </p>

      <button type="button" className="settings-start" onClick={indit}>
        Indítás
      </button>
    </div>
  );
}
