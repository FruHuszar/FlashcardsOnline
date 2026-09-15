export const KULCSSZO_KELL = 3;
export const SZAZALEK_KELL = 0.6;
export const MIN_KULCSSZO_HOSSZ = 3;
export const LEVENSHTEIN_MAX_HOSSZ = 400;

export const TOLTELEKSZAVAK = new Set([
  "a",
  "az",
  "egy",
  "ez",
  "eza",
  "ezt",
  "ezek",
  "ezeket",
  "ezen",
  "ezzel",
  "ebben",
  "erre",
  "ennek",
  "ettol",
  "az",
  "azt",
  "azok",
  "azokat",
  "azon",
  "azzal",
  "abban",
  "arra",
  "annak",
  "attol",
  "ilyen",
  "olyan",
  "amilyen",
  "ugyanaz",
  "masik",
  "masok",
  "mas",
  "is",
  "es",
  "meg",
  "vagy",
  "vagyis",
  "illetve",
  "de",
  "hanem",
  "azonban",
  "viszont",
  "pedig",
  "mert",
  "mivel",
  "hiszen",
  "tehat",
  "igy",
  "ugy",
  "ahogy",
  "mint",
  "mintha",
  "hogy",
  "hogyha",
  "ha",
  "akkor",
  "amikor",
  "mikor",
  "amig",
  "mig",
  "amint",
  "miutan",
  "mielott",
  "kozben",
  "utan",
  "elott",
  "alatt",
  "felett",
  "melle",
  "mellett",
  "mogott",
  "kozott",
  "korul",
  "nelkul",
  "helyett",
  "ellen",
  "szerint",
  "altal",
  "reszere",
  "szamara",
  "miatt",
  "vegett",
  "felol",
  "fele",
  "ban",
  "ben",
  "bol",
  "bol",
  "ra",
  "re",
  "rol",
  "rol",
  "nak",
  "nek",
  "tol",
  "tol",
  "val",
  "vel",
  "hoz",
  "hez",
  "hoz",
  "ig",
  "nal",
  "nel",
  "ki",
  "be",
  "le",
  "fel",
  "el",
  "at",
  "ossze",
  "szet",
  "vissza",
  "ide",
  "oda",
  "itt",
  "ott",
  "innen",
  "onnan",
  "most",
  "majd",
  "mar",
  "meg",
  "csak",
  "eppen",
  "szinte",
  "nagyon",
  "tul",
  "eleg",
  "kisse",
  "kicsit",
  "sokkal",
  "tobb",
  "tobbe",
  "kevesbe",
  "leg",
  "igen",
  "nem",
  "sem",
  "se",
  "ne",
  "nincs",
  "sincs",
  "van",
  "vannak",
  "volt",
  "voltak",
  "lesz",
  "lesznek",
  "lenne",
  "lenni",
  "legyen",
  "lehet",
  "kell",
  "kellett",
  "fog",
  "fogja",
  "szokott",
  "valo",
  "vala",
  "valami",
  "valaki",
  "barmi",
  "barki",
  "semmi",
  "senki",
  "minden",
  "mindenki",
  "mindig",
  "soha",
  "neha",
  "gyakran",
  "esetleg",
  "talan",
  "persze",
  "termeszetesen",
  "szoval",
  "amely",
  "amelyik",
  "amely",
  "aki",
  "akik",
  "ami",
  "amik",
  "melyik",
  "mely",
  "ki",
  "kik",
  "mi",
  "mik",
  "mit",
  "mibol",
  "miert",
  "hol",
  "hova",
  "honnan",
  "hogyan",
  "mennyi",
  "hany",
  "en",
  "te",
  "o",
  "mi",
  "ti",
  "ok",
  "engem",
  "teged",
  "ot",
  "minket",
  "titeket",
  "oket",
  "nekem",
  "neked",
  "neki",
  "nekunk",
  "nektek",
  "nekik",
  "enyem",
  "tied",
  "ove",
  "sajat",
  "maga",
  "magat",
  "ono",
  "oket",
  "the",
  "a",
  "an",
  "this",
  "that",
  "these",
  "those",
  "there",
  "here",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "we",
  "us",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "i",
  "me",
  "my",
  "mine",
  "myself",
  "who",
  "whom",
  "whose",
  "which",
  "what",
  "when",
  "where",
  "why",
  "how",
  "whether",
  "and",
  "or",
  "but",
  "nor",
  "so",
  "yet",
  "for",
  "because",
  "since",
  "although",
  "though",
  "while",
  "if",
  "unless",
  "until",
  "than",
  "then",
  "as",
  "like",
  "such",
  "also",
  "too",
  "very",
  "quite",
  "rather",
  "just",
  "only",
  "even",
  "still",
  "already",
  "always",
  "never",
  "often",
  "sometimes",
  "usually",
  "maybe",
  "perhaps",
  "almost",
  "about",
  "around",
  "above",
  "below",
  "under",
  "over",
  "between",
  "among",
  "through",
  "during",
  "before",
  "after",
  "within",
  "without",
  "into",
  "onto",
  "upon",
  "from",
  "to",
  "of",
  "in",
  "on",
  "at",
  "by",
  "with",
  "off",
  "out",
  "up",
  "down",
  "again",
  "further",
  "once",
  "be",
  "am",
  "is",
  "are",
  "was",
  "were",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "done",
  "will",
  "would",
  "shall",
  "should",
  "can",
  "could",
  "may",
  "might",
  "must",
  "ought",
  "not",
  "no",
  "none",
  "nothing",
  "nobody",
  "any",
  "anyone",
  "anything",
  "some",
  "someone",
  "something",
  "every",
  "everyone",
  "everything",
  "all",
  "both",
  "each",
  "few",
  "many",
  "much",
  "more",
  "most",
  "less",
  "least",
  "other",
  "others",
  "another",
  "same",
  "own",
  "thing",
  "things",
  "way",
  "ways",
  "kind",
  "sort",
  "lot",
  "bit",
  "etc",
]);

export function normalizal(szoveg) {
  return String(szoveg ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function szavak(szoveg) {
  const tisztitott = normalizal(szoveg);
  return tisztitott === "" ? [] : tisztitott.split(" ");
}

export function kulcsszavak(szoveg) {
  const latott = new Set();

  return szavak(szoveg).filter((szo) => {
    if (szo.length < MIN_KULCSSZO_HOSSZ || TOLTELEKSZAVAK.has(szo) || latott.has(szo)) {
      return false;
    }

    latott.add(szo);
    return true;
  });
}

export function szoEgyezik(egyik, masik) {
  if (egyik === masik) {
    return true;
  }

  const rovidebb = Math.min(egyik.length, masik.length);

  if (rovidebb < 4) {
    return false;
  }

  if (egyik.startsWith(masik) || masik.startsWith(egyik)) {
    return true;
  }

  return levenshtein(egyik, masik) <= (rovidebb >= 7 ? 2 : 1);
}

export function levenshtein(egyik, masik) {
  if (egyik === masik) {
    return 0;
  }

  let elozo = Array.from({ length: masik.length + 1 }, (nincs, i) => i);

  for (let i = 1; i <= egyik.length; i++) {
    const sor = [i];

    for (let j = 1; j <= masik.length; j++) {
      const csere = elozo[j - 1] + (egyik[i - 1] === masik[j - 1] ? 0 : 1);
      sor[j] = Math.min(sor[j - 1] + 1, elozo[j] + 1, csere);
    }

    elozo = sor;
  }

  return elozo[masik.length];
}

function szoparositas(helyesSzavak, valaszSzavak) {
  const hasznalt = new Array(helyesSzavak.length).fill(false);
  let talalat = 0;

  valaszSzavak.forEach((szo) => {
    const index = helyesSzavak.findIndex(
      (helyesSzo, i) => !hasznalt[i] && szoEgyezik(szo, helyesSzo)
    );

    if (index !== -1) {
      hasznalt[index] = true;
      talalat++;
    }
  });

  return talalat;
}

function dice(helyesSzavak, valaszSzavak) {
  const osszes = helyesSzavak.length + valaszSzavak.length;

  if (osszes === 0) {
    return 0;
  }

  return (2 * szoparositas(helyesSzavak, valaszSzavak)) / osszes;
}

function betuHasonlosag(helyes, valasz) {
  if (helyes.length > LEVENSHTEIN_MAX_HOSSZ || valasz.length > LEVENSHTEIN_MAX_HOSSZ) {
    return 0;
  }

  const hosszabb = Math.max(helyes.length, valasz.length);

  if (hosszabb === 0) {
    return 0;
  }

  return 1 - levenshtein(helyes, valasz) / hosszabb;
}

/**
 * @returns {{helyes: boolean, szazalek: number, talalt: number, kell: number, talaltSzavak: string[]}}
 */
export function ertekeles(valasz, helyesValasz) {
  const valaszSzavak = szavak(valasz);
  const helyesSzavak = szavak(helyesValasz);
  const kulcsok = kulcsszavak(helyesValasz);
  const kell = Math.max(1, Math.min(KULCSSZO_KELL, kulcsok.length));

  if (valaszSzavak.length === 0 || helyesSzavak.length === 0) {
    return { helyes: false, szazalek: 0, talalt: 0, kell, talaltSzavak: [] };
  }

  const talaltSzavak = kulcsok.filter((kulcs) =>
    valaszSzavak.some((szo) => szoEgyezik(szo, kulcs))
  );

  const szazalek = Math.max(
    dice(helyesSzavak, valaszSzavak),
    betuHasonlosag(normalizal(helyesValasz), normalizal(valasz))
  );

  return {
    helyes: talaltSzavak.length >= kell || szazalek >= SZAZALEK_KELL,
    szazalek,
    talalt: talaltSzavak.length,
    kell,
    talaltSzavak,
  };
}
