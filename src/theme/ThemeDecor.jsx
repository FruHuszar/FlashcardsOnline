import { useMemo } from "react";
import ThemeRegistry from "./ThemeRegistry.js";
import ThemeAssets from "./ThemeAssets.js";

function szorvany(tema) {
  const dekor = ThemeRegistry.keres(tema)?.dekor;

  if (!dekor) {
    return [];
  }

  const kepek = dekor.kepek.map((nev) => ThemeAssets.egy(tema, nev)).filter(Boolean);

  return Array.from({ length: kepek.length === 0 ? 0 : dekor.darab }, (nincs, i) => ({
    kulcs: i,
    forras: kepek[Math.floor(Math.random() * kepek.length)],
    meret: Math.round(dekor.min + Math.random() * (dekor.max - dekor.min)),
    x: Math.random() * 100,
    y: Math.random() * 100,
    forgas: Math.round(Math.random() * 360),
  }));
}

export default function ThemeDecor({ tema }) {
  const elemek = useMemo(() => szorvany(tema), [tema]);

  if (elemek.length === 0) {
    return null;
  }

  return (
    <div className="theme-decor" aria-hidden="true">
      {elemek.map((obj) => (
        <img
          key={obj.kulcs}
          className="theme-decor-elem"
          src={obj.forras}
          alt=""
          decoding="async"
          draggable={false}
          style={{
            width: `${obj.meret}px`,
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            transform: `translate(-50%, -50%) rotate(${obj.forgas}deg)`,
          }}
        />
      ))}
    </div>
  );
}
