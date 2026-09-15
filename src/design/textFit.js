const KERDES_MERETEK = [
  { hossz: 60, betu: "1.15rem", sorok: 3 },
  { hossz: 100, betu: "0.98rem", sorok: 4 },
  { hossz: 115, betu: "0.88rem", sorok: 4 },
  { hossz: 160, betu: "0.8rem", sorok: 5 },
];

const KERDES_MIN = { betu: "0.76rem", sorok: 5 };

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

  return { "--kerdes-betu": meret.betu, "--kerdes-sorok": meret.sorok };
}

export function valaszBetu(szoveg) {
  return (
    VALASZ_MERETEK.find((obj) => hossz(szoveg) <= obj.hossz)?.betu ?? MIN_VALASZ_BETU
  );
}

function hossz(szoveg) {
  return String(szoveg ?? "").length;
}
