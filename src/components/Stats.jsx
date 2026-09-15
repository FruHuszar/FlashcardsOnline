export default function Stats({
  lista,
  kereses,
  temakor,
  temakorok,
  onKereses,
  onTemakor,
  onTanulas,
}) {
  const osszes = lista.length;
  const tanult = lista.filter((obj) => Number(obj.is_learned) === 1).length;
  const szazalek = osszes === 0 ? 0 : Math.round((tanult / osszes) * 100);

  return (
    <section id="stats">
      <div className="stats-panel">
        <div className="stats-progress">
          <span className="stats-bar" style={{ width: `${szazalek}%` }} />
        </div>

        <div className="stats-row">
          <p className="stats-numbers">
            <span className="stats-learned">{tanult}</span> /{" "}
            <span className="stats-total">{osszes}</span> megtanulva
            <span className="stats-percent">{szazalek}%</span>
          </p>

          <div className="stats-tools">
            <input
              type="search"
              className="stats-search"
              placeholder="Keresés a kártyák között"
              value={kereses}
              onChange={(ok) => onKereses(ok.target.value)}
            />
            <button type="button" className="stats-start" onClick={onTanulas}>
              Indítás: Tanuló Mód
            </button>
          </div>
        </div>

        <div className="stats-topics">
          {["", ...temakorok].map((nev) => (
            <button
              key={nev}
              type="button"
              className={nev === temakor ? "stats-topic is-active" : "stats-topic"}
              onClick={() => onTemakor(nev)}
            >
              {nev === "" ? "Összes" : nev}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
