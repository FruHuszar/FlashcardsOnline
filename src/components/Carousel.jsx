import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SEPRES_HATAR = 48;

export default function Carousel({ elemek, kezdoIndex = 0, cimke, elemKulcs, megjelenit }) {
  const [index, setIndex] = useState(() =>
    Math.min(Math.max(kezdoIndex, 0), Math.max(elemek.length - 1, 0))
  );
  const kezdoX = useRef(null);

  const ugrik = (cel) => setIndex(Math.min(Math.max(cel, 0), elemek.length - 1));

  const billentyu = (ok) => {
    if (ok.key === "ArrowLeft") {
      ugrik(index - 1);
    }

    if (ok.key === "ArrowRight") {
      ugrik(index + 1);
    }
  };

  const sepresVege = (ok) => {
    if (kezdoX.current === null) {
      return;
    }

    const elmozdulas = ok.clientX - kezdoX.current;
    kezdoX.current = null;

    if (Math.abs(elmozdulas) > SEPRES_HATAR) {
      ugrik(index + (elmozdulas < 0 ? 1 : -1));
    }
  };

  return (
    <section
      className="carousel"
      aria-roledescription="carousel"
      aria-label={cimke}
      tabIndex={0}
      onKeyDown={billentyu}
    >
      <div
        className="carousel-viewport"
        onPointerDown={(ok) => (kezdoX.current = ok.clientX)}
        onPointerUp={sepresVege}
        onPointerCancel={() => (kezdoX.current = null)}
      >
        <div className="carousel-track" style={{ transform: `translateX(${index * -100}%)` }}>
          {elemek.map((elem, i) => (
            <div
              key={elemKulcs(elem)}
              className="carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${elemek.length}`}
              aria-hidden={i !== index}
              inert={i === index ? undefined : ""}
            >
              {megjelenit(elem, i === index, Math.abs(i - index) <= 1)}
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <button
          type="button"
          className="carousel-arrow"
          aria-label="Előző"
          disabled={index === 0}
          onClick={() => ugrik(index - 1)}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <div className="carousel-dots">
          {elemek.map((elem, i) => (
            <button
              key={elemKulcs(elem)}
              type="button"
              className={i === index ? "carousel-dot is-active" : "carousel-dot"}
              aria-label={`${i + 1}. elem`}
              aria-current={i === index}
              onClick={() => ugrik(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="carousel-arrow"
          aria-label="Következő"
          disabled={index >= elemek.length - 1}
          onClick={() => ugrik(index + 1)}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
