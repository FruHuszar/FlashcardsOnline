import { useEffect, useRef, useState } from "react";

const HUZAS_HATAR = 90;
const KATTINTAS_TUR = 6;
const TAVOZAS_IDO = 220;

export default function ShuffleMode({ kartya, onValasz }) {
  const kartyaElem = useRef(null);
  const huzas = useRef({ aktiv: false, kezdoY: 0, eltolas: 0, mozdult: false });
  const idozito = useRef(0);
  const [forditva, setForditva] = useState(false);
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

  const fordit = () => {
    if (!tavozik) {
      setForditva((elozo) => !elozo);
    }
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

  const gorgetheto = (elem) => {
    const doboz = elem?.closest(".shuffle-body");
    return Boolean(doboz) && doboz.scrollHeight > doboz.clientHeight + 1;
  };

  const kezdes = (ok) => {
    huzas.current.mozdult = false;

    if (tavozik || ok.target.closest("button") || gorgetheto(ok.target)) {
      return;
    }

    huzas.current = { aktiv: true, kezdoY: ok.clientY, eltolas: 0, mozdult: false };
    kartyaElem.current.setPointerCapture(ok.pointerId);
  };

  const kozben = (ok) => {
    if (!huzas.current.aktiv) {
      return;
    }

    huzas.current.eltolas = Math.min(0, ok.clientY - huzas.current.kezdoY);
    huzas.current.mozdult ||= Math.abs(ok.clientY - huzas.current.kezdoY) > KATTINTAS_TUR;
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

  const kattintas = () => {
    if (huzas.current.mozdult) {
      huzas.current.mozdult = false;
      return;
    }

    fordit();
  };

  const billentyuFordit = (ok) => {
    if (ok.key === "Enter" || ok.key === " ") {
      ok.preventDefault();
      fordit();
    }
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
          tabIndex={0}
          onPointerDown={kezdes}
          onPointerMove={kozben}
          onPointerUp={vege}
          onPointerCancel={vege}
          onClick={kattintas}
          onKeyDown={billentyuFordit}
        >
          <div className={forditva ? "shuffle-inner is-flipped" : "shuffle-inner"}>
            <div className="shuffle-face shuffle-face--front" aria-hidden={forditva}>
              <span className="topic">{kartya.topic}</span>
              <div className="shuffle-body">
                <h3 className="shuffle-question">{kartya.question}</h3>
              </div>
            </div>

            <div className="shuffle-face shuffle-face--back" aria-hidden={!forditva}>
              <span className="topic">{kartya.topic}</span>
              <div className="shuffle-body">
                <p className="shuffle-answer">{kartya.answer}</p>
              </div>
            </div>
          </div>
        </article>
      </div>

      <p className="shuffle-hint">
        {forditva
          ? "Húzd felfelé a kártyát, vagy nyomd meg a ↑ gombot a következőhöz."
          : "Gondold végig a választ, aztán kattints a kártyára a megfordításhoz."}
      </p>
    </div>
  );
}
