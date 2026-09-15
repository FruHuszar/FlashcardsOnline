import { useState } from "react";

export default function StudySettings({ modok, onIndit }) {
  const [allapot, setAllapot] = useState(() =>
    Object.keys(modok).reduce(
      (gyujto, kulcs) => ({ ...gyujto, [kulcs]: { aktiv: true, darab: 5 } }),
      {}
    )
  );
  const [hiba, setHiba] = useState("");

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
              min={1}
              max={30}
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
