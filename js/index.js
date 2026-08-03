import Service from "./Service.js";
import Cards from "./Cards.js";
import Modal from "./Modal.js";

const VEGPONT = "http://localhost:8000/public/index.php";
const SZULOELEM = document.querySelector("#card-grid");

new Cards(new Service(VEGPONT), new Modal("#card-modal", "#card-form"), SZULOELEM);
