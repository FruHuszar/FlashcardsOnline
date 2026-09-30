import { useEffect, useState } from "react";
import InstallButton from "./InstallButton.jsx";

export default function CloudBar({ sync, allapot, onAllapot, onImport, onValtozas }) {
  const auth = sync.auth;
  const [dolgozik, setDolgozik] = useState(false);
  const [bejelentkezve, setBejelentkezve] = useState(auth.bejelentkezve);

  useEffect(() => {
    if (!auth.beallitva) {
      onAllapot({
        uzenet: "A felhő kikapcsolva: nincs Google Client ID a .env fájlban.",
        tipus: "info",
      });
      return;
    }

    onAllapot({
      uzenet: bejelentkezve
        ? "Bejelentkezve. A mentés és a letöltés is teljes felülírás."
        : "Kijelentkezve. A kártyáid a böngésződben vannak mentve.",
      tipus: bejelentkezve ? "ok" : "info",
    });
  }, [auth, bejelentkezve, onAllapot]);

  const futtat = (muvelet, uzenet) => {
    setDolgozik(true);
    onAllapot({ uzenet: "Dolgozom…", tipus: "info" });

    muvelet
      .then((eredmeny) => {
        setDolgozik(false);
        setBejelentkezve(auth.bejelentkezve);
        onAllapot({ uzenet: uzenet(eredmeny), tipus: "ok" });
      })
      .catch((ok) => {
        setDolgozik(false);
        setBejelentkezve(auth.bejelentkezve);
        onAllapot({ uzenet: ok.message, tipus: "hiba" });
      });
  };

  const belepes = () => {
    if (bejelentkezve) {
      futtat(auth.kijelentkezes(), () => "Kijelentkeztél.");
      return;
    }

    futtat(auth.bejelentkezes(), () => "Sikeres bejelentkezés.");
  };

  const mentes = () => {
    const kerdes =
      "Ez felülírja azt, ami jelenleg a felhőben van.\n\n" +
      `A felhőbe kerül: ${sync.helyiDarab} kártya erről az oldalról.\n` +
      "A felhőben lévő korábbi mentés elvész.\n\nFolytatod?";

    if (!window.confirm(kerdes)) {
      return;
    }

    futtat(sync.mentes(), (eredmeny) => `Mentve a felhőbe: ${eredmeny.darab} kártya.`);
  };

  const letoltes = () => {
    const kerdes =
      "Ez felülírja azt, ami jelenleg az oldaladon van.\n\n" +
      `A jelenlegi ${sync.helyiDarab} kártyád törlődik, és a felhőben lévő mentés lép a helyükre.\n\nFolytatod?`;

    if (!window.confirm(kerdes)) {
      return;
    }

    futtat(sync.letoltes(), (eredmeny) => {
      onValtozas();
      return `Letöltve a felhőből: ${eredmeny.darab} kártya.`;
    });
  };

  const tiltva = !bejelentkezve || dolgozik;

  return (
    <div id="cloud-bar">
      <div className="cloud-bar">
        <div className="cloud-actions">
          <button
            type="button"
            className="cloud-btn cloud-btn--primary"
            onClick={belepes}
            disabled={dolgozik || !auth.beallitva}
          >
            {bejelentkezve ? "Kijelentkezés" : "Bejelentkezés"}
          </button>
          <button type="button" className="cloud-btn" onClick={mentes} disabled={tiltva}>
            ☁ Mentés a felhőbe
          </button>
          <button type="button" className="cloud-btn" onClick={letoltes} disabled={tiltva}>
            ⤓ Letöltés a felhőből
          </button>
          <button
            type="button"
            className="cloud-btn cloud-btn--ghost"
            onClick={onImport}
          >
            ⇪ Importálás JSON-ból
          </button>
          <InstallButton />
        </div>
        <p className={`cloud-status cloud-status--${allapot?.tipus ?? "info"}`} role="status">
          {allapot?.uzenet ?? ""}
        </p>
      </div>
    </div>
  );
}
