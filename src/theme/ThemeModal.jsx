import { Check } from "lucide-react";
import useDialog from "../components/useDialog.js";
import Carousel from "../components/Carousel.jsx";
import CloseButton from "../components/CloseButton.jsx";
import ThemeRegistry from "./ThemeRegistry.js";
import ThemeCollage from "./ThemeCollage.jsx";

export default function ThemeModal({ nyitva, tema, onValaszt, onBezar }) {
  const elem = useDialog(nyitva, onBezar);
  const temak = ThemeRegistry.osszes();

  return (
    <dialog id="theme-modal" ref={elem}>
      <div className="theme-picker">
        <h2 className="modal-title">Choose your theme</h2>

        {nyitva && (
          <Carousel
            elemek={temak}
            kezdoIndex={temak.findIndex((obj) => obj.kulcs === tema)}
            cimke="Témák"
            elemKulcs={(obj) => obj.kulcs}
            megjelenit={(obj, nincs, kozel) => (
              <ThemeSlide
                tema={obj}
                aktiv={obj.kulcs === tema}
                kozel={kozel}
                onValaszt={onValaszt}
              />
            )}
          />
        )}
      </div>
      <CloseButton onClick={onBezar} />
    </dialog>
  );
}

function ThemeSlide({ tema, aktiv, kozel, onValaszt }) {
  return (
    <article className="theme-slide">
      {kozel ? <ThemeCollage tema={tema.kulcs} /> : <div className="theme-collage" />}

      <div className="theme-slide-info">
        <h3 className="theme-slide-name">{tema.nev}</h3>
        <button
          type="button"
          className={aktiv ? "theme-apply is-active" : "theme-apply"}
          aria-pressed={aktiv}
          disabled={aktiv}
          onClick={() => onValaszt(tema.kulcs)}
        >
          {aktiv && <Check size={14} aria-hidden="true" />}
          {aktiv ? "Aktív" : "Kiválasztás"}
        </button>
      </div>
    </article>
  );
}
