import { useCallback, useEffect, useMemo, useState } from "react";
import { CONFIG } from "./config.js";
import LocalStore from "./services/LocalStore.js";
import CardRepository from "./services/CardRepository.js";
import GoogleAuth from "./cloud/GoogleAuth.js";
import DriveClient from "./cloud/DriveClient.js";
import SyncService from "./cloud/SyncService.js";
import CloudBar from "./components/CloudBar.jsx";
import Stats from "./components/Stats.jsx";
import CardGrid from "./components/CardGrid.jsx";
import CardModal from "./components/CardModal.jsx";
import ImportModal from "./components/ImportModal.jsx";
import StudyModal from "./study/StudyModal.jsx";

export default function App() {
  const repo = useMemo(() => new CardRepository(new LocalStore(CONFIG.TAROLO_KULCS)), []);
  const sync = useMemo(() => {
    const auth = new GoogleAuth();
    return new SyncService(auth, new DriveClient(auth), repo);
  }, [repo]);

  const [lista, setLista] = useState([]);
  const [kereses, setKereses] = useState("");
  const [temakor, setTemakor] = useState("");
  const [hiba, setHiba] = useState("");
  const [allapot, setAllapot] = useState(null);
  const [kartyaModal, setKartyaModal] = useState(null);
  const [importNyitva, setImportNyitva] = useState(false);
  const [tanulas, setTanulas] = useState(null);
  const [csucs, setCsucs] = useState(() => repo.csucs);

  const betolt = useCallback(
    () =>
      repo
        .lekerdez()
        .then((ujLista) => {
          setLista(ujLista);
          setCsucs(repo.csucs);
          setHiba("");
        })
        .catch((ok) => setHiba(ok.message)),
    [repo]
  );

  useEffect(() => {
    betolt();
  }, [betolt]);

  const szurtLista = useMemo(() => {
    const szo = kereses.toLowerCase().trim();

    return lista.filter((obj) => {
      const szoveg = `${obj.topic} ${obj.question} ${obj.answer}`.toLowerCase();
      return (temakor === "" || obj.topic === temakor) && szoveg.includes(szo);
    });
  }, [lista, kereses, temakor]);

  const temakorok = useMemo(
    () => [...new Set(lista.map((obj) => obj.topic))].sort(),
    [lista]
  );

  useEffect(() => {
    if (temakor !== "" && !temakorok.includes(temakor)) {
      setTemakor("");
    }
  }, [temakor, temakorok]);

  const mentes = (obj) => {
    const adatok = {
      topic: obj.topic,
      question: obj.question,
      answer: obj.answer,
      icon: obj.icon,
    };

    return (obj.id ? repo.modosit(obj.id, adatok) : repo.letrehoz(adatok)).then(() => {
      setKartyaModal(null);
      return betolt();
    });
  };

  const torles = (id) => {
    if (!window.confirm("Biztosan törlöd ezt a kártyát?")) {
      return;
    }

    repo
      .torol(id)
      .then(() => betolt())
      .catch((ok) => window.alert(ok.message));
  };

  const tanult = (id, ertek) => {
    repo
      .modosit(id, { is_learned: ertek ? 1 : 0 })
      .then(() => betolt())
      .catch((ok) => window.alert(ok.message));
  };

  const csucsMentes = useCallback(
    (pont) => {
      repo
        .csucsMentes(pont)
        .then((ertek) => setCsucs(ertek))
        .catch(() => setCsucs(repo.csucs));
    },
    [repo]
  );

  const tanulasIndit = () => {
    if (szurtLista.length === 0) {
      window.alert("Előbb hozz létre kártyákat a tanuláshoz.");
      return;
    }

    setTanulas(szurtLista);
  };

  return (
    <>
      <header>
        <h1>Flashcard Online</h1>
        <p>Kattints egy kártyára a válasz felfedéséhez.</p>
        <CloudBar
          sync={sync}
          allapot={allapot}
          onAllapot={setAllapot}
          onImport={() => setImportNyitva(true)}
          onValtozas={betolt}
        />
      </header>

      <p className="high-score">Legjobb pontszám: {csucs}</p>

      <Stats
        lista={lista}
        kereses={kereses}
        temakor={temakor}
        temakorok={temakorok}
        onKereses={setKereses}
        onTemakor={setTemakor}
        onTanulas={tanulasIndit}
      />

      <CardGrid
        lista={szurtLista}
        ures={lista.length === 0}
        hiba={hiba}
        onUj={() => setKartyaModal({})}
        onSzerkesztes={(kartya) => setKartyaModal(kartya)}
        onTorles={torles}
        onTanult={tanult}
      />

      <CardModal
        kartya={kartyaModal}
        onMentes={mentes}
        onBezar={() => setKartyaModal(null)}
      />

      <ImportModal
        nyitva={importNyitva}
        repo={repo}
        onBezar={() => setImportNyitva(false)}
        onValtozas={betolt}
        onAllapot={setAllapot}
      />

      <StudyModal
        lista={tanulas}
        onBezar={() => setTanulas(null)}
        onCsucs={csucsMentes}
      />
    </>
  );
}
