export default class ScrollLock {
  static #zarak = 0;
  static #pozicio = 0;

  static zar() {
    ScrollLock.#zarak++;

    if (ScrollLock.#zarak > 1) {
      return;
    }

    const gyoker = document.documentElement;
    ScrollLock.#pozicio = window.scrollY;
    gyoker.classList.toggle("is-scroll-gutter", window.innerWidth > gyoker.clientWidth);
    gyoker.classList.add("is-scroll-locked");
    document.body.style.top = `-${ScrollLock.#pozicio}px`;
  }

  static felold() {
    ScrollLock.#zarak = Math.max(0, ScrollLock.#zarak - 1);

    if (ScrollLock.#zarak > 0) {
      return;
    }

    const gyoker = document.documentElement;
    gyoker.classList.remove("is-scroll-locked", "is-scroll-gutter");
    document.body.style.top = "";
    window.scrollTo(0, ScrollLock.#pozicio);
  }
}
