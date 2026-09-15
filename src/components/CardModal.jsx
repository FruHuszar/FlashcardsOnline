import { useEffect, useState } from "react";
import useDialog from "./useDialog.js";
import IconPicker from "./IconPicker.jsx";
import { ALAP_IKON } from "../design/ikonKeszlet.js";

const URES = { id: null, topic: "", question: "", answer: "", icon: ALAP_IKON };

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
      answer: kartya.answer ?? "",
      icon: kartya.icon ?? ALAP_IKON,
    });
  }, [nyitva, kartya]);

  const mezo = (nev) => (ok) => setUrlap((elozo) => ({ ...elozo, [nev]: ok.target.value }));

  const kuldes = (ok) => {
    ok.preventDefault();

    const adatok = {
      id: urlap.id,
      topic: urlap.topic.trim(),
      question: urlap.question.trim(),
      answer: urlap.answer.trim(),
      icon: urlap.icon,
    };

    if (!adatok.topic || !adatok.question || !adatok.answer) {
      setHiba("Minden mező kitöltése kötelező.");
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
          <input
            type="text"
            name="question"
            placeholder="Mi a kérdés?"
            value={urlap.question}
            onChange={mezo("question")}
          />
        </label>

        <label>
          Válasz
          <textarea
            name="answer"
            rows={3}
            placeholder="Mi a válasz?"
            value={urlap.answer}
            onChange={mezo("answer")}
          />
        </label>

        <div className="modal-actions">
          <button type="button" id="btn-close-modal" onClick={onBezar}>
            Mégse
          </button>
          <button type="submit">Mentés</button>
        </div>
      </form>
    </dialog>
  );
}
