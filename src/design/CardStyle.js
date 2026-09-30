export const VALTOZATOK = ["solid", "outline", "soft"];
export const FORMAK = [
  "ovalis",
  "farok",
  "magas",
  "fekete",
  "ovalis",
  "keskeny",
  "farok",
  "magas",
  "fekete",
  "szogletes",
];

export function valtozat(kartya) {
  return VALTOZATOK[szoras(kartya, "valtozat") % VALTOZATOK.length];
}

export function forma(kartya) {
  return FORMAK[szoras(kartya, "forma") % FORMAK.length];
}

function szoras(kartya, so) {
  const alap = `${so}|${kartya?.id ?? 0}|${kartya?.topic ?? ""}`;
  let ertek = 2166136261;

  for (let i = 0; i < alap.length; i++) {
    ertek ^= alap.charCodeAt(i);
    ertek = Math.imul(ertek, 16777619);
  }

  ertek ^= ertek >>> 15;
  ertek = Math.imul(ertek, 2246822507);
  ertek ^= ertek >>> 13;
  ertek = Math.imul(ertek, 3266489909);
  ertek ^= ertek >>> 16;

  return ertek >>> 0;
}
