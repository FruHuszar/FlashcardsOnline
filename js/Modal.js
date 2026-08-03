export default class Modal {
  static ESEMENYEK = {
    MENTES: "modal:mentes",
  };

  constructor(dialogSzelektor, urlapSzelektor) {
    this.elem = document.querySelector(dialogSzelektor);
    this.urlap = document.querySelector(urlapSzelektor);
    this.cimElem = this.elem.querySelector(".modal-title");
    this.hibaElem = this.elem.querySelector(".modal-error");
    this.esemenyeketFigyel();
  }

  esemenyeketFigyel() {
    this.urlap.addEventListener("submit", (esemeny) => this.#mentes(esemeny));
    this.elem.querySelector("#btn-close-modal").addEventListener("click", () => this.bezar());
  }

  megnyit(obj = null) {
    this.urlap.reset();
    this.hibaTorles();
    this.#kitolt(obj);
    this.cimElem.textContent = obj ? "Kártya szerkesztése" : "Új kártya";
    this.elem.showModal();
    this.urlap.elements.topic.focus();
  }

  bezar() {
    this.elem.close();
  }

  hibaMegjelenit(uzenet) {
    this.hibaElem.textContent = uzenet;
    this.hibaElem.hidden = false;
  }

  hibaTorles() {
    this.hibaElem.textContent = "";
    this.hibaElem.hidden = true;
  }

  #kitolt(obj) {
    this.urlap.elements.id.value = obj?.id ?? "";
    this.urlap.elements.topic.value = obj?.topic ?? "";
    this.urlap.elements.question.value = obj?.question ?? "";
    this.urlap.elements.answer.value = obj?.answer ?? "";
  }

  #mentes(esemeny) {
    esemeny.preventDefault();
    const obj = this.#adatok();

    if (!obj.topic || !obj.question || !obj.answer) {
      this.hibaMegjelenit("Minden mező kitöltése kötelező.");
      return;
    }

    this.hibaTorles();
    this.elem.dispatchEvent(new CustomEvent(Modal.ESEMENYEK.MENTES, { detail: obj }));
  }

  #adatok() {
    return {
      id: this.urlap.elements.id.value || null,
      topic: this.urlap.elements.topic.value.trim(),
      question: this.urlap.elements.question.value.trim(),
      answer: this.urlap.elements.answer.value.trim(),
    };
  }
}
