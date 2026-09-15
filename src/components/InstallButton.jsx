import { useEffect, useRef, useState } from "react";

export default function InstallButton() {
  const esemeny = useRef(null);
  const [lathato, setLathato] = useState(false);

  useEffect(() => {
    const keres = (ok) => {
      ok.preventDefault();
      esemeny.current = ok;
      setLathato(true);
    };

    const telepitve = () => {
      esemeny.current = null;
      setLathato(false);
    };

    window.addEventListener("beforeinstallprompt", keres);
    window.addEventListener("appinstalled", telepitve);

    const ios = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const fut =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (ios && !fut) {
      setLathato(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", keres);
      window.removeEventListener("appinstalled", telepitve);
    };
  }, []);

  const telepites = () => {
    if (!esemeny.current) {
      window.alert(
        "Telepítés iPhone-on: Megosztás ikon → „Főképernyőhöz adás”.\n" +
          "Asztali gépen: a címsor jobb szélén lévő telepítés ikon."
      );
      return;
    }

    esemeny.current.prompt();
    esemeny.current.userChoice.finally(() => {
      esemeny.current = null;
      setLathato(false);
    });
  };

  return (
    <button
      type="button"
      className="cloud-btn cloud-btn--ghost"
      onClick={telepites}
      hidden={!lathato}
    >
      ⤋ Telepítés
    </button>
  );
}
