import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Palette } from "lucide-react";
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
import StudyPreferences from "./study/StudyPreferences.js";
import ThemeService from "./theme/ThemeService.js";
import ThemeModal from "./theme/ThemeModal.jsx";
import LoadingScreen from "./theme/LoadingScreen.jsx";
import ThemeDecor from "./theme/ThemeDecor.jsx";

export default function App() {
  const repo = useMemo(() => new CardRepository(new LocalStore(CONFIG.TAROLO_KULCS)), []);
  const sync = useMemo(() => {
    const auth = new GoogleAuth();
    return new SyncService(auth, new DriveClient(auth), repo);
  }, [repo]);
  const temak = useMemo(() => new ThemeService(new LocalStore(CONFIG.TEMA_KULCS)), []);
  const tanulasBeallitasok = useMemo(
    () => new StudyPreferences(new LocalStore(CONFIG.TANULAS_KULCS)),
    []
  );

  const [lista, setLista] = useState([]);
  const [kereses, setKereses] = useState("");
  const [valasztottTemak, setValasztottTemak] = useState([]);
  const [hiba, setHiba] = useState("");
  const [allapot, setAllapot] = useState(null);
  const [kartyaModal, setKartyaModal] = useState(null);
  const [importNyitva, setImportNyitva] = useState(false);
  const [tanulas, setTanulas] = useState(null);
  const [csucs, setCsucs] = useState(() => repo.csucs);
  const [tema, setTema] = useState(() => temak.aktualis);
  const [temaNyitva, setTemaNyitva] = useState(false);
  const [betoltve, setBetoltve] = useState(false);
  const [toltesKor, setToltesKor] = useState(0);

  useLayoutEffect(() => {
    temak.alkalmaz(tema);
  }, [temak, tema]);

  const elokeszites = useCallback(() => temak.elokeszit(tema), [temak, tema]);
  const introElokeszites = useCallback(() => temak.introElokeszit(tema), [temak, tema]);

  const betolt = useCallback(
    () =>
      repo
        .lekerdez()
        .then((ujLista) => {
          setLista(ujLista);
          setCsucs(repo.csucs);
          setHiba("");
        })
        .catch((ok) => setHiba(ok.message))
        .finally(() => setBetoltve(true)),
    [repo]
  );

  useEffect(() => {
    betolt();
  }, [betolt]);

  const szurtLista = useMemo(() => {
    const szo = kereses.toLowerCase().trim();

    return lista.filter((obj) => {
      const szoveg = `${obj.topic} ${obj.question} ${obj.answer}`.toLowerCase();
      const temaEgyezik =
        valasztottTemak.length === 0 || valasztottTemak.includes(obj.topic);
      return temaEgyezik && szoveg.includes(szo);
    });
  }, [lista, kereses, valasztottTemak]);

  const temakorok = useMemo(
    () => [...new Set(lista.map((obj) => obj.topic))].sort(),
    [lista]
  );

  useEffect(() => {
    setValasztottTemak((elozo) => {
      const megmaradt = elozo.filter((nev) => temakorok.includes(nev));
      return megmaradt.length === elozo.length ? elozo : megmaradt;
    });
  }, [temakorok]);

  const temakorValtas = (nev) => {
    setValasztottTemak((elozo) => {
      if (nev === "") {
        return [];
      }

      return elozo.includes(nev) ? elozo.filter((obj) => obj !== nev) : [...elozo, nev];
    });
  };

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

  const temaValasztas = (kulcs) => {
    setTemaNyitva(false);
    setTema(temak.valt(kulcs));
    setToltesKor((elozo) => elozo + 1);
  };

  const tanulasIndit = () => {
    if (szurtLista.length === 0) {
      window.alert("Előbb hozz létre kártyákat a tanuláshoz.");
      return;
    }

    setTanulas(szurtLista);
  };

  return (
    <>
      <ThemeDecor tema={tema} />
      <header>
        <div className="brand">
          <h1>Flashcard Online</h1>
          <button
            type="button"
            className="theme-trigger"
            aria-label="Téma választása"
            title="Téma választása"
            onClick={() => setTemaNyitva(true)}
          >
            <Palette size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
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
        valasztottTemak={valasztottTemak}
        temakorok={temakorok}
        onKereses={setKereses}
        onTemakor={temakorValtas}
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
        beallitasok={tanulasBeallitasok}
        onBezar={() => setTanulas(null)}
        onCsucs={csucsMentes}
        onIntroElokeszit={introElokeszites}
      />

      <ThemeModal
        nyitva={temaNyitva}
        tema={tema}
        onValaszt={temaValasztas}
        onBezar={() => setTemaNyitva(false)}
      />

      <LoadingScreen
        key={toltesKor}
        tema={tema}
        kesz={betoltve}
        onElokeszit={elokeszites}
      />
    </>
  );
}
