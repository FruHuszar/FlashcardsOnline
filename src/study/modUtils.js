import CardEntity from "../model/CardEntity.js";

export function kulcsok(szovegek) {
  return new Set(szovegek.map(CardEntity.egyszerusit));
}

export function ellenorzes(valasz, kartya) {
  return kulcsok(CardEntity.helyesek(kartya)).has(CardEntity.egyszerusit(valasz));
}

export function kever(lista) {
  const masolat = [...lista];

  for (let i = masolat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [masolat[i], masolat[j]] = [masolat[j], masolat[i]];
  }

  return masolat;
}

export function veletlenElem(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

export function veletlenKartya(lista, kartya) {
  const maradek = lista.filter((obj) => Number(obj.id) !== Number(kartya.id));

  if (maradek.length === 0) {
    return kartya;
  }

  return veletlenElem(maradek);
}

export function idegenValaszok(lista, kartya, darab, kizart) {
  const latott = new Set(kizart);
  const eredmeny = [];

  kever(lista).forEach((obj) => {
    if (eredmeny.length >= darab || Number(obj.id) === Number(kartya.id)) {
      return;
    }

    const szoveg = veletlenElem(CardEntity.helyesek(obj));
    const kulcs = CardEntity.egyszerusit(szoveg);

    if (latott.has(kulcs)) {
      return;
    }

    latott.add(kulcs);
    eredmeny.push({ szoveg, kartya: obj });
  });

  return eredmeny;
}
