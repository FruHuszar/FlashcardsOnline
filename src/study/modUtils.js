export function egyszerusit(szoveg) {
  return String(szoveg ?? "").toLowerCase().trim();
}

export function ellenorzes(valasz, kartya) {
  return egyszerusit(valasz) === egyszerusit(kartya?.answer);
}

export function kever(lista) {
  const masolat = [...lista];

  for (let i = masolat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [masolat[i], masolat[j]] = [masolat[j], masolat[i]];
  }

  return masolat;
}

export function veletlenKartya(lista, kartya) {
  const maradek = lista.filter((obj) => Number(obj.id) !== Number(kartya.id));

  if (maradek.length === 0) {
    return kartya;
  }

  return maradek[Math.floor(Math.random() * maradek.length)];
}
