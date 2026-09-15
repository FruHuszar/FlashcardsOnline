export const VALTOZATOK = ["solid", "outline", "soft"];

export function valtozat(kartya) {
  return VALTOZATOK[szoras(kartya) % VALTOZATOK.length];
}

function szoras(kartya) {
  const alap = `valtozat|${kartya?.id ?? 0}|${kartya?.topic ?? ""}`;
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
