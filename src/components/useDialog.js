import { useEffect, useRef } from "react";
import ScrollLock from "./ScrollLock.js";

export default function useDialog(nyitva, onBezar) {
  const elem = useRef(null);

  useEffect(() => {
    const dialog = elem.current;

    if (!dialog) {
      return undefined;
    }

    if (nyitva && !dialog.open) {
      dialog.showModal();
    }

    if (!nyitva && dialog.open) {
      dialog.close();
    }

    const bezaras = () => onBezar();
    dialog.addEventListener("close", bezaras);

    return () => dialog.removeEventListener("close", bezaras);
  }, [nyitva, onBezar]);

  useEffect(() => {
    if (!nyitva) {
      return undefined;
    }

    ScrollLock.zar();
    return () => ScrollLock.felold();
  }, [nyitva]);

  return elem;
}
