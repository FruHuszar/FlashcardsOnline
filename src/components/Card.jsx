import { useState } from "react";
import CardIcon from "../design/CardIcons.jsx";
import { valtozat } from "../design/CardStyle.js";
import { kerdesStilus, valaszBetu } from "../design/textFit.js";

export default function Card({ kartya, onSzerkesztes, onTorles, onTanult }) {
  const [forditva, setForditva] = useState(false);
  const tanult = Boolean(Number(kartya.is_learned));
  const stilus = valtozat(kartya);

  const forgat = (ok) => {
    if (ok.target.closest("button")) {
      return;
    }
    setForditva((elozo) => !elozo);
  };

  const osztalyok = [
    "flip-card",
    `flip-card--${stilus}`,
    tanult ? "is-learned" : "",
    forditva ? "is-flipped" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={osztalyok}
      data-id={kartya.id}
      style={{
        ...kerdesStilus(kartya.question),
        "--valasz-betu": valaszBetu(kartya.answer),
      }}
    >
      <div className="flip-card-inner" onClick={forgat}>
        <div className="face face--front">
          <header className="card-header">
            <span className="topic">{kartya.topic}</span>
            <span className="card-actions">
              <button
                type="button"
                className="btn-icon btn-edit"
                aria-label="Kártya szerkesztése"
                title="Szerkesztés"
                onClick={() => onSzerkesztes(kartya)}
              >
                ✎
              </button>
              <button
                type="button"
                className="btn-icon btn-delete"
                aria-label="Kártya törlése"
                title="Törlés"
                onClick={() => onTorles(kartya.id)}
              >
                ✕
              </button>
            </span>
          </header>

          <span className="card-symbol">
            <CardIcon nev={kartya.icon} />
          </span>

          <p className="question">{kartya.question}</p>
          <span className="flip-hint">Kattints a válaszért</span>
        </div>

        <div className="face face--back">
          <header className="card-header">
            <span className="topic">{kartya.topic}</span>
          </header>
          <p className="answer">{kartya.answer}</p>
          <button
            type="button"
            className="btn-learned"
            onClick={() => onTanult(kartya.id, !tanult)}
          >
            {tanult ? "Megtanulva ✓" : "Megtanultam!"}
          </button>
        </div>
      </div>
    </article>
  );
}
