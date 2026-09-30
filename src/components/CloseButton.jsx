import { X } from "lucide-react";

export default function CloseButton({ onClick }) {
  return (
    <button type="button" className="modal-close" aria-label="Bezárás" title="Bezárás" onClick={onClick}>
      <X size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
