import Card from "./Card.jsx";

export default function CardGrid({ lista, ures, hiba, onUj, onSzerkesztes, onTorles, onTanult }) {
  return (
    <main id="card-grid">
      <button type="button" className="add-card" onClick={onUj} aria-label="Új kártya hozzáadása">
        <span className="add-icon">+</span>
        <span>Új kártya</span>
      </button>

      {lista.map((obj) => (
        <Card
          key={obj.id}
          kartya={obj}
          onSzerkesztes={onSzerkesztes}
          onTorles={onTorles}
          onTanult={onTanult}
        />
      ))}

      {hiba !== "" && <p className="grid-message grid-message--error">{hiba}</p>}

      {hiba === "" && lista.length === 0 && (
        <p className="grid-message">
          {ures
            ? "Még nincs kártyád. Hozd létre az elsőt a plusz gombbal, vagy importálj JSON-ból!"
            : "Nincs a szűrésnek megfelelő kártya."}
        </p>
      )}
    </main>
  );
}
