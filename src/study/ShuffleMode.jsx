import { useEffect, useRef, useState } from "react";

const HUZAS_HATAR = 90;
const TAVOZAS_IDO = 220;

export default function ShuffleMode({ kartya, onValasz }) {
  const kartyaElem = useRef(null);
  const huzas = useRef({ aktiv: false, kezdoY: 0, eltolas: 0 });
  const idozito = useRef(0);
  const [lathato, setLathato] = useState(false);
  const [tavozik, setTavozik] = useState(false);
  const [stilus, setStilus] = useState({});

  useEffect(() => () => window.clearTimeout(idozito.current), []);

  const kovetkezo = () => {
    if (tavozik) {
      return;
    }

    setTavozik(true);
    setStilus({ transform: "translateY(-480px)", opacity: 0 });
    idozito.current = window.setTimeout(() => onValasz(false), TAVOZAS_IDO);
  };

  useEffect(() => {
    const billentyu = (ok) => {
      if (ok.key === "ArrowUp") {
        kovetkezo();
      }
    };

    document.addEventListener("keydown", billentyu);
    return () => document.removeEventListener("keydown", billentyu);
  });

  /**
   * A görgethető szövegdobozban a függőleges mozdulat a görgetésé marad,
   * máshol viszont felfelé húzással lehet továbblapozni.
   */
  const gorgetheto = (elem) => {
    const doboz = elem?.closest(".shuffle-body");
    return Boolean(doboz) && doboz.scrollHeight > doboz.clientHeight + 1;
  };

  const kezdes = (ok) => {
    if (tavozik || ok.target.closest("button") || gorgetheto(ok.target)) {
      return;
    }

    huzas.current = { aktiv: true, kezdoY: ok.clientY, eltolas: 0 };
    kartyaElem.current.setPointerCapture(ok.pointerId);
  };

  const kozben = (ok) => {
    if (!huzas.current.aktiv) {
      return;
    }

    huzas.current.eltolas = Math.min(0, ok.clientY - huzas.current.kezdoY);
    setStilus({ transform: `translateY(${huzas.current.eltolas}px)` });
  };

  const vege = () => {
    if (!huzas.current.aktiv) {
      return;
    }

    huzas.current.aktiv = false;

    if (huzas.current.eltolas < -HUZAS_HATAR) {
      kovetkezo();
      return;
    }

    huzas.current.eltolas = 0;
    setStilus({});
  };

  return (
    <div className="shuffle">
      <button
        type="button"
        className="shuffle-next"
        aria-label="Következő kártya"
        title="Következő kártya"
        onClick={kovetkezo}
      >
        ↑
      </button>

      <div className="shuffle-stage">
        <article
          className={tavozik ? "shuffle-card is-leaving" : "shuffle-card"}
          ref={kartyaElem}
          style={stilus}
          onPointerDown={kezdes}
          onPointerMove={kozben}
          onPointerUp={vege}
          onPointerCancel={vege}
        >
          <span className="topic">{kartya.topic}</span>

          <div className="shuffle-body">
            <h3 className="shuffle-question">{kartya.question}</h3>

            {lathato ? (
              <p className="shuffle-answer">{kartya.answer}</p>
            ) : (
              <button
                type="button"
                className="shuffle-reveal"
                onClick={() => setLathato(true)}
              >
                Mutasd a választ
              </button>
            )}
          </div>
        </article>
      </div>

      <p className="shuffle-hint">
        {lathato
          ? "Húzd felfelé a kártyát, vagy nyomd meg a ↑ gombot a következőhöz."
          : "Gondold végig a választ, aztán fedd fel."}
      </p>
    </div>
  );
}
