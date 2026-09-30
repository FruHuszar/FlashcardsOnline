import { useEffect, useRef, useState } from "react";
import { Image as KepIkon } from "lucide-react";

export default function ThemeImage({ forras, index }) {
  const kep = useRef(null);
  const [allapot, setAllapot] = useState("tolt");

  useEffect(() => {
    const elem = kep.current;

    if (elem?.complete) {
      setAllapot(elem.naturalWidth > 0 ? "kesz" : "hiba");
      return;
    }

    setAllapot("tolt");
  }, [forras]);

  return (
    <span className={`theme-panel theme-panel--${index + 1} is-${allapot}`}>
      <span className="theme-panel-belso">
        {allapot === "hiba" ? (
          <span className="theme-placeholder" aria-hidden="true">
            <KepIkon size={28} strokeWidth={1.25} />
          </span>
        ) : (
          <img
            ref={kep}
            className="theme-image"
            src={forras}
            alt=""
            decoding="async"
            draggable={false}
            onLoad={() => setAllapot("kesz")}
            onError={() => setAllapot("hiba")}
          />
        )}
      </span>
    </span>
  );
}
