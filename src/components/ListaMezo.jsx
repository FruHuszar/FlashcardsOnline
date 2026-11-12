import { Plus, Trash2 } from "lucide-react";

export default function ListaMezo({ cimke, ertekek, sorok, helyorzo, minDarab, onValtozas }) {
  const modosit = (index, ertek) =>
    onValtozas(ertekek.map((obj, sajat) => (sajat === index ? ertek : obj)));

  const torol = (index) => onValtozas(ertekek.filter((_, sajat) => sajat !== index));

  return (
    <fieldset className="list-field">
      <legend>{cimke}</legend>

      {ertekek.map((ertek, index) => (
        <div className="list-field-row" key={index}>
          <textarea
            rows={sorok}
            placeholder={helyorzo}
            aria-label={`${cimke} ${index + 1}.`}
            value={ertek}
            onChange={(ok) => modosit(index, ok.target.value)}
          />
          <button
            type="button"
            className="list-field-remove"
            aria-label="Sor törlése"
            title="Törlés"
            disabled={ertekek.length <= minDarab}
            onClick={() => torol(index)}
          >
            <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      ))}

      <button type="button" className="list-field-add" onClick={() => onValtozas([...ertekek, ""])}>
        <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
        <span>Hozzáadás</span>
      </button>
    </fieldset>
  );
}
