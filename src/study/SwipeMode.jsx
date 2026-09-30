import { useEffect, useRef, useState } from "react";
import { ellenorzes, veletlenKartya } from "./modUtils.js";

const HUZAS_HATAR = 110;

export default function SwipeMode({ kartya, lista, onValasz }) {
  const kartyaElem = useRef(null);
  const huzas = useRef({ aktiv: false, kezdoX: 0, eltolas: 0 });
  const [dontott, setDontott] = useState(false);
  const [stilus, setStilus] = useState({});
  const [jelzes, setJelzes] = useState("");
  const [tevedes, setTevedes] = useState(false);

  const valasz = useRef(
    Math.random() < 0.5 ? kartya.answer : veletlenKartya(lista, kartya).answer
  );
  const kuldve = useRef(false);
  const parositasHelyes = ellenorzes(valasz.current, kartya);

  const dontes = (igen) => {
    if (dontott) {
      return;
    }

    setDontott(true);

    const helyes = igen === parositasHelyes;
    setJelzes(helyes ? "helyes" : "helytelen");

    if (!helyes) {
      setTevedes(true);
      return;
    }

    setStilus({
      transform: `translateX(${igen ? 420 : -420}px) rotate(${igen ? 18 : -18}deg)`,
    });

    onValasz(true);
  };

  const tovabb = () => {
    if (kuldve.current) {
      return;
    }

    kuldve.current = true;
    onValasz(false);
  };

  useEffect(() => {
    const billentyu = (ok) => {
      if (ok.key === "ArrowRight") {
        dontes(true);
      }
      if (ok.key === "ArrowLeft") {
        dontes(false);
      }
    };

    document.addEventListener("keydown", billentyu);
    return () => document.removeEventListener("keydown", billentyu);
  });

  const kezdes = (ok) => {
    if (dontott) {
      return;
    }

    huzas.current = { aktiv: true, kezdoX: ok.clientX, eltolas: 0 };
    kartyaElem.current.setPointerCapture(ok.pointerId);
  };

  const kozben = (ok) => {
    if (!huzas.current.aktiv) {
      return;
    }

    huzas.current.eltolas = ok.clientX - huzas.current.kezdoX;
    setStilus({
      transform: `translateX(${huzas.current.eltolas}px) rotate(${
        huzas.current.eltolas / 18
      }deg)`,
    });
  };

  const vege = () => {
    if (!huzas.current.aktiv) {
      return;
    }

    huzas.current.aktiv = false;

    if (Math.abs(huzas.current.eltolas) > HUZAS_HATAR) {
      dontes(huzas.current.eltolas > 0);
      return;
    }

    huzas.current.eltolas = 0;
    setStilus({});
  };

  const osztaly = ["swipe-card", huzas.current.aktiv ? "is-dragging" : "", jelzes]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="swipe">
      <div className="swipe-stage">
        {tevedes ? (
          <article className="swipe-card swipe-card--megoldas" role="status">
            <p className="swipe-verdict">Helytelen</p>
            <div className="swipe-body">
              <p className="swipe-correct">{kartya.answer}</p>
            </div>
          </article>
        ) : (
          <article
            className={osztaly}
            ref={kartyaElem}
            style={stilus}
            onPointerDown={kezdes}
            onPointerMove={kozben}
            onPointerUp={vege}
            onPointerCancel={vege}
          >
            <span className="topic">{kartya.topic}</span>

            <div className="swipe-body">
              <h3 className="swipe-question">{kartya.question}</h3>
              <p className="swipe-answer">{valasz.current}</p>
            </div>
          </article>
        )}
      </div>

      {tevedes ? (
        <button type="button" className="swipe-next" autoFocus onClick={tovabb}>
          Tovább
        </button>
      ) : (
        <>
          <div className="swipe-actions">
            <button type="button" className="swipe-nem" onClick={() => dontes(false)}>
              ✕ Helytelen
            </button>
            <button type="button" className="swipe-igen" onClick={() => dontes(true)}>
              ✓ Helyes
            </button>
          </div>

          <p className="swipe-hint">Húzd a kártyát, kattints, vagy használd a nyilakat.</p>
        </>
      )}
    </div>
  );
}
