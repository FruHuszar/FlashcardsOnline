import { useRef, useState } from "react";
import useDialog from "./useDialog.js";
import JsonImporter from "../services/JsonImporter.js";

const MAX_FAJL_MERET = 8 * 1024 * 1024;

export default function ImportModal({ nyitva, repo, onBezar, onValtozas, onAllapot }) {
  const elem = useDialog(nyitva, onBezar);
  const fajlElem = useRef(null);
  const [szoveg, setSzoveg] = useState("");
  const [duplikatum, setDuplikatum] = useState(true);
  const [uzenet, setUzenet] = useState(null);

  const elemez = (forras) => {
    try {
      setUzenet(null);
      return JsonImporter.elemez(forras);
    } catch (hiba) {
      setUzenet({ szoveg: hiba.message, tipus: "hiba" });
      return null;
    }
  };

  const ellenoriz = (forras = szoveg) => {
    const eredmeny = elemez(forras);

    if (!eredmeny) {
      return;
    }

    setUzenet({
      szoveg:
        `${eredmeny.lista.length} kártya felismerve.` +
        (eredmeny.ervenytelen > 0
          ? ` ${eredmeny.ervenytelen} sor hiányos, azokat kihagyjuk.`
          : ""),
      tipus: "ok",
    });
  };

  const importal = () => {
    const eredmeny = elemez(szoveg);

    if (!eredmeny) {
      return;
    }

    repo
      .hozzafuz(eredmeny.lista, duplikatum)
      .then((osszegzes) => {
        onValtozas();
        onAllapot({ uzenet: `Importálva: ${osszegzes.hozzaadva} új kártya.`, tipus: "ok" });
        setUzenet({
          szoveg: `Kész. Hozzáadva: ${osszegzes.hozzaadva}. Kihagyva: ${osszegzes.kihagyva}.`,
          tipus: "ok",
        });
        setSzoveg("");

        if (fajlElem.current) {
          fajlElem.current.value = "";
        }
      })
      .catch((hiba) => setUzenet({ szoveg: hiba.message, tipus: "hiba" }));
  };

  const fajl = (ok) => {
    const valasztott = ok.target.files?.[0];

    if (!valasztott) {
      return;
    }

    if (valasztott.size > MAX_FAJL_MERET) {
      setUzenet({ szoveg: "A fájl túl nagy (maximum 8 MB).", tipus: "hiba" });
      ok.target.value = "";
      return;
    }

    const olvaso = new FileReader();
    olvaso.addEventListener("load", () => {
      const tartalom = String(olvaso.result ?? "");
      setSzoveg(tartalom);
      ellenoriz(tartalom);
    });
    olvaso.addEventListener("error", () =>
      setUzenet({ szoveg: "A fájl nem olvasható.", tipus: "hiba" })
    );
    olvaso.readAsText(valasztott);
  };

  const minta = () => {
    const tartalom = JsonImporter.minta();
    setSzoveg(tartalom);
    ellenoriz(tartalom);
  };

  return (
    <dialog id="import-modal" ref={elem}>
      <div className="import">
        <h2 className="modal-title">Kártyák importálása JSON-ból</h2>
        <p className="import-lead">
          Illeszd be a kártyák JSON tömbjét, vagy válassz ki egy .json fájlt. Az importálás
          mindig <strong>hozzáad</strong>, semmit nem ír felül.
        </p>

        <label className="import-label" htmlFor="import-text">
          JSON tartalom
        </label>
        <textarea
          id="import-text"
          className="import-text"
          rows={10}
          spellCheck={false}
          placeholder='[{ "topic": "HTTP", "question": "...", "answer": "..." }]'
          value={szoveg}
          onChange={(ok) => setSzoveg(ok.target.value)}
        />

        <div className="import-row">
          <label className="import-file">
            <span>Fájl betöltése</span>
            <input
              type="file"
              id="import-file"
              accept=".json,application/json"
              ref={fajlElem}
              onChange={fajl}
            />
          </label>

          <label className="import-check">
            <input
              type="checkbox"
              id="import-skip-duplicates"
              checked={duplikatum}
              onChange={(ok) => setDuplikatum(ok.target.checked)}
            />
            <span>Duplikátumok kihagyása</span>
          </label>
        </div>

        {uzenet && (
          <p className={`import-message import-message--${uzenet.tipus}`}>{uzenet.szoveg}</p>
        )}

        <details className="import-help">
          <summary>Milyen formátumot fogad el?</summary>
          <p>
            Egy JSON tömb, vagy egy objektum <code>cards</code> kulccsal. Kötelező mezők:{" "}
            <code>question</code> és <code>answer</code>. Opcionális: <code>topic</code>,{" "}
            <code>icon</code>, <code>is_learned</code>. Elfogadott aliasok:{" "}
            <code>front</code>/<code>back</code>, <code>kerdes</code>/<code>valasz</code>,{" "}
            <code>term</code>/<code>definition</code>. Minden mező szövegként kerül be, HTML
            nem értelmeződik.
          </p>
        </details>

        <div className="modal-actions">
          <button type="button" id="btn-import-sample" className="import-secondary" onClick={minta}>
            Minta
          </button>
          <button
            type="button"
            id="btn-import-check"
            className="import-secondary"
            onClick={() => ellenoriz()}
          >
            Ellenőrzés
          </button>
          <button type="button" id="btn-import-close" onClick={onBezar}>
            Bezárás
          </button>
          <button type="button" id="btn-import-run" className="import-primary" onClick={importal}>
            Importálás
          </button>
        </div>
      </div>
    </dialog>
  );
}
