import Service from "./Service.js";
import Cards from "./components/Cards.js";
import Modal from "./components/Modal.js";
import Stats from "./components/Stats.js";
import Study from "./study/Study.js";

const VEGPONT = "http://localhost:8000/public/index.php";
const SZULOELEM = document.querySelector("#card-grid");

new Cards(
  new Service(VEGPONT),
  new Modal("#card-modal", "#card-form"),
  new Stats(document.querySelector("#stats")),
  new Study(document.querySelector("#study-modal")),
  SZULOELEM
);
