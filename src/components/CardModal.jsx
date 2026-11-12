import { useEffect, useState } from "react";
import useDialog from "./useDialog.js";
import IconPicker from "./IconPicker.jsx";
import CloseButton from "./CloseButton.jsx";
import ListaMezo from "./ListaMezo.jsx";
import CardEntity from "../model/CardEntity.js";
import { ALAP_IKON } from "../design/ikonKeszlet.js";

const URES = { id: null, topic: "", question: "", helyesek: [""], opciok: [], icon: ALAP_IKON };

function kitoltott(lista) {
  return lista.map((szoveg) => szoveg.trim()).filter(Boolean);
}

export default function CardModal({ kartya, onMentes, onBezar }) {
  const nyitva = kartya !== null;
  const elem = useDialog(nyitva, onBezar);
  const [urlap, setUrlap] = useState(URES);
  const [hiba, setHiba] = useState("");

  useEffect(() => {
    if (!nyitva) {
      return;
    }

    setHiba("");
    setUrlap({
      id: kartya.id ?? null,
      topic: kartya.topic ?? "",
      question: kartya.question ?? "",
      helyesek: [...CardEntity.helyesek(kartya)],
      opciok: [...CardEntity.opciok(kartya)],
      icon: kartya.icon ?? ALAP_IKON,
    });
  }, [nyitva, kartya]);

  const mezo = (nev) => (ok) => setUrlap((elozo) => ({ ...elozo, [nev]: ok.target.value }));
  const lista = (nev) => (ertekek) => setUrlap((elozo) => ({ ...elozo, [nev]: ertekek }));

  const kuldes = (ok) => {
    ok.preventDefault();

    const adatok = {
      id: urlap.id,
      topic: urlap.topic.trim(),
      question: urlap.question.trim(),
      answer: kitoltott(urlap.helyesek),
      options: kitoltott(urlap.opciok),
      icon: urlap.icon,
    };

    if (!adatok.topic || !adatok.question || adatok.answer.length === 0) {
      setHiba("A témakör, a kérdés és legalább egy helyes válasz kitöltése kötelező.");
      return;
    }

    setHiba("");
    onMentes(adatok).catch((keres) => setHiba(keres.message));
  };

  return (
    <dialog id="card-modal" ref={elem}>
      <form id="card-form" onSubmit={kuldes} noValidate>
        <h2 className="modal-title">{urlap.id ? "Kártya szerkesztése" : "Új kártya"}</h2>
        <p className="modal-error" hidden={hiba === ""}>
          {hiba}
        </p>

        <div className="form-row">
          <label className="form-grow">
            Témakör
            <input
              type="text"
              name="topic"
              placeholder="pl. HTTP, SQL"
              maxLength={50}
              value={urlap.topic}
              onChange={mezo("topic")}
            />
          </label>

          <span className="form-icon">
            Ikon
            <IconPicker
              ertek={urlap.icon}
              onValaszt={(nev) => setUrlap((elozo) => ({ ...elozo, icon: nev }))}
            />
          </span>
        </div>

        <label>
          Kérdés
          <textarea
            name="question"
            rows={3}
            placeholder="Mi a kérdés?"
            value={urlap.question}
            onChange={mezo("question")}
          />
        </label>

        <ListaMezo
          cimke="Helyes válaszok"
          ertekek={urlap.helyesek}
          sorok={2}
          helyorzo="Mi a válasz?"
          minDarab={1}
          onValtozas={lista("helyesek")}
        />

        <ListaMezo
          cimke="Helytelen lehetőségek"
          ertekek={urlap.opciok}
          sorok={1}
          helyorzo="Hibás válaszlehetőség"
          minDarab={0}
          onValtozas={lista("opciok")}
        />

        <div className="modal-actions">
          <button type="button" id="btn-close-modal" onClick={onBezar}>
            Mégse
          </button>
          <button type="submit">Mentés</button>
        </div>
      </form>
      <CloseButton onClick={onBezar} />
    </dialog>
  );
}
