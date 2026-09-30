import { useEffect, useRef, useState } from "react";
import ScrollLock from "../components/ScrollLock.js";
import ThemeCollage from "./ThemeCollage.jsx";

const MIN_IDO = 1700;
const ELTUNES_IDO = 500;

export default function LoadingScreen({ tema, kesz, onElokeszit }) {
  const kezdet = useRef(window.performance.now());
  const [fazis, setFazis] = useState("latszik");
  const [elokeszitve, setElokeszitve] = useState(false);
  const rejtett = fazis === "rejtett";

  useEffect(() => {
    if (rejtett) {
      return undefined;
    }

    ScrollLock.zar();
    return () => ScrollLock.felold();
  }, [rejtett]);

  useEffect(() => {
    let aktiv = true;
    onElokeszit().then(() => aktiv && setElokeszitve(true));
    return () => {
      aktiv = false;
    };
  }, [onElokeszit]);

  useEffect(() => {
    if (!kesz || !elokeszitve) {
      return undefined;
    }

    const hatra = Math.max(0, MIN_IDO - (window.performance.now() - kezdet.current));
    const idozito = window.setTimeout(() => setFazis("tavozik"), hatra);
    return () => window.clearTimeout(idozito);
  }, [kesz, elokeszitve]);

  useEffect(() => {
    if (fazis !== "tavozik") {
      return undefined;
    }

    const idozito = window.setTimeout(() => setFazis("rejtett"), ELTUNES_IDO);
    return () => window.clearTimeout(idozito);
  }, [fazis]);

  if (rejtett) {
    return null;
  }

  return (
    <div
      className={`loading loading--${fazis}`}
      role="status"
      aria-live="polite"
      aria-busy={fazis === "latszik"}
    >
      <ThemeCollage tema={tema} valtozat="auto" />

      <div className="loading-caption">
        <p className="loading-title">Flashcards Online</p>
        <p className="loading-text">loading your cards...</p>
      </div>
    </div>
  );
}
