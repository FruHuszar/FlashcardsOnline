const KERDES_MERETEK = [
  { hossz: 60, betu: "1.15rem", sorok: 3 },
  { hossz: 100, betu: "0.98rem", sorok: 4 },
  { hossz: 115, betu: "0.88rem", sorok: 4 },
  { hossz: 160, betu: "0.8rem", sorok: 5 },
];

const KERDES_MIN = { betu: "0.76rem", sorok: 5 };

const BUBOREK_MERETEK = [
  { hossz: 30, betu: "1.02rem" },
  { hossz: 55, betu: "0.9rem" },
  { hossz: 85, betu: "0.8rem" },
  { hossz: 120, betu: "0.72rem" },
  { hossz: 170, betu: "0.64rem" },
];

const BUBOREK_MIN = "0.58rem";

const VALASZ_MERETEK = [
  { hossz: 90, betu: "0.95rem" },
  { hossz: 160, betu: "0.88rem" },
  { hossz: 260, betu: "0.82rem" },
  { hossz: 400, betu: "0.78rem" },
];

export const MIN_VALASZ_BETU = "0.76rem";

export function kerdesStilus(szoveg) {
  const meret =
    KERDES_MERETEK.find((obj) => hossz(szoveg) <= obj.hossz) ?? KERDES_MIN;

  const buborek =
    BUBOREK_MERETEK.find((obj) => hossz(szoveg) <= obj.hossz)?.betu ?? BUBOREK_MIN;

  return {
    "--kerdes-betu": meret.betu,
    "--kerdes-sorok": meret.sorok,
    "--buborek-betu": buborek,
  };
}

export function valaszBetu(szoveg) {
  return (
    VALASZ_MERETEK.find((obj) => hossz(szoveg) <= obj.hossz)?.betu ?? MIN_VALASZ_BETU
  );
}

function hossz(szoveg) {
  return String(szoveg ?? "").length;
}
