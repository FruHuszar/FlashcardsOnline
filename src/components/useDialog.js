import { useEffect, useRef } from "react";

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

  return elem;
}
