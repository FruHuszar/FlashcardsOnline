export const IKONOK = [
  { nev: "konyv", cimke: "Könyv" },
  { nev: "diploma", cimke: "Tanulás" },
  { nev: "agy", cimke: "Agy" },
  { nev: "otlet", cimke: "Ötlet" },
  { nev: "lombik", cimke: "Kémia" },
  { nev: "szamologep", cimke: "Matek" },
  { nev: "kod", cimke: "Kód" },
  { nev: "terminal", cimke: "Terminál" },
  { nev: "adatbazis", cimke: "Adatbázis" },
  { nev: "szerver", cimke: "Szerver" },
  { nev: "foldgomb", cimke: "Web" },
  { nev: "halozat", cimke: "Hálózat" },
  { nev: "pajzs", cimke: "Biztonság" },
  { nev: "lakat", cimke: "Titkosítás" },
  { nev: "processzor", cimke: "Hardver" },
  { nev: "binaris", cimke: "Bináris" },
  { nev: "dokumentum", cimke: "Dokumentum" },
  { nev: "toll", cimke: "Írás" },
  { nev: "paletta", cimke: "Design" },
  { nev: "zene", cimke: "Zene" },
  { nev: "nyelvek", cimke: "Nyelvek" },
  { nev: "terkep", cimke: "Földrajz" },
  { nev: "atom", cimke: "Fizika" },
  { nev: "level", cimke: "Biológia" },
  { nev: "mikroszkop", cimke: "Kutatás" },
  { nev: "merleg", cimke: "Jog" },
  { nev: "szív", cimke: "Egészség" },
  { nev: "ora", cimke: "Történelem" },
  { nev: "csillag", cimke: "Csillag" },
  { nev: "kirako", cimke: "Kirakó" },
  { nev: "rakéta", cimke: "Rakéta" },
  { nev: "celtabla", cimke: "Cél" },
];

export const IKON_NEVEK = IKONOK.map((obj) => obj.nev);

export const ALAP_IKON = IKON_NEVEK[0];

export function ervenyesIkon(nev) {
  return IKON_NEVEK.includes(nev) ? nev : ALAP_IKON;
}
