import type { ReactNode } from "react";

type Scene =
  | "sun"
  | "moon"
  | "wave"
  | "heart"
  | "yes"
  | "no"
  | "coffee"
  | "tea"
  | "drop"
  | "plate"
  | "bill"
  | "bell"
  | "key"
  | "phone"
  | "coin"
  | "shirt"
  | "coat"
  | "pants"
  | "dress"
  | "shoe"
  | "hat"
  | "bag"
  | "glasses"
  | "bread"
  | "apple"
  | "fish"
  | "house"
  | "door"
  | "bed"
  | "people"
  | "rain"
  | "snow"
  | "tree"
  | "book"
  | "pen"
  | "walk"
  | "eye"
  | "talk"
  | "think"
  | "run"
  | "sauna"
  | "letter"
  | "shop"
  | "city"
  | "clock"
  | "pin"
  | "palette"
  | "bubble"
  | "star"
  | "hand"
  | "child";

const WORDS: Record<string, Scene> = {
  olla: "people",
  puhua: "talk",
  asua: "house",
  sanoa: "talk",
  kysyä: "bubble",
  antaa: "heart",
  nukkua: "bed",
  lukea: "book",
  lähteä: "walk",
  tietää: "think",
  ottaa: "hand",
  kirjoittaa: "pen",
  syödä: "plate",
  juoda: "drop",
  tehdä: "hand",
  nähdä: "eye",
  saada: "heart",
  voida: "yes",
  tulla: "walk",
  mennä: "walk",
  nousta: "sun",
  ajatella: "think",
  haluta: "heart",
  osata: "star",
  tavata: "people",
  pelätä: "moon",
  tarvita: "hand",
  valita: "palette",
  vanheta: "clock",
  paeta: "run",
  aamu: "sun",
  kauppa: "shop",
  viikonloppu: "sun",
  kahvila: "coffee",
  turku: "city",
  sauna: "sauna",
  metsa: "tree",
  kirje: "letter",
  hei: "wave",
  moi: "wave",
  terve: "wave",
  "hyvää huomenta": "sun",
  "hyvää päivää": "sun",
  "hyvää iltaa": "moon",
  "hyvää yötä": "moon",
  maanantai: "clock",
  tiistai: "clock",
  keskiviikko: "clock",
  torstai: "clock",
  perjantai: "sun",
  lauantai: "sun",
  sunnuntai: "moon",
  kevät: "tree",
  kesä: "sun",
  syksy: "tree",
  talvi: "snow",
  näkemiin: "wave",
  "hei hei": "wave",
  "moi moi": "wave",
  nähdään: "eye",
  tervetuloa: "house",
  kyllä: "yes",
  joo: "yes",
  ei: "no",
  kiitos: "heart",
  "kiitos paljon": "heart",
  "ole hyvä": "heart",
  "olkaa hyvä": "heart",
  "ei kestä": "heart",
  anteeksi: "wave",
  samoin: "people",
  vesi: "drop",
  kahvi: "coffee",
  tee: "tea",
  ruoka: "plate",
  lasku: "bill",
  apua: "bell",
  vessa: "door",
  lippu: "bill",
  avain: "key",
  puhelin: "phone",
  raha: "coin",
  nimi: "pen",
  vaatteet: "shirt",
  paita: "shirt",
  "t-paita": "shirt",
  kauluspaita: "shirt",
  pusero: "shirt",
  neule: "coat",
  huppari: "coat",
  takki: "coat",
  sadetakki: "rain",
  kylpytakki: "coat",
  housut: "pants",
  farkut: "pants",
  shortsit: "pants",
  hame: "dress",
  mekko: "dress",
  puku: "coat",
  solmio: "shirt",
  alusvaatteet: "shirt",
  sukat: "shoe",
  sukkahousut: "pants",
  kengät: "shoe",
  saappaat: "shoe",
  lenkkarit: "shoe",
  hattu: "hat",
  lakki: "hat",
  pipo: "hat",
  huivi: "coat",
  käsineet: "hand",
  vyö: "pants",
  laukku: "bag",
  reppu: "bag",
  silmälasit: "glasses",
  kello: "clock",
  sormus: "heart",
  leipä: "bread",
  voi: "bread",
  juusto: "bread",
  maito: "drop",
  kananmuna: "plate",
  omena: "apple",
  liha: "plate",
  kana: "plate",
  kala: "fish",
  keitto: "plate",
  salaatti: "apple",
  peruna: "apple",
  riisi: "plate",
  sokeri: "plate",
  suola: "plate",
  olut: "tea",
  viini: "drop",
  mehu: "apple",
  huone: "house",
  keittiö: "plate",
  olohuone: "house",
  makuuhuone: "bed",
  kylpyhuone: "drop",
  ovi: "door",
  ikkuna: "house",
  pöytä: "plate",
  tuoli: "house",
  sänky: "bed",
  sohva: "house",
  lamppu: "sun",
  perhe: "people",
  äiti: "people",
  isä: "people",
  vanhemmat: "people",
  lapsi: "child",
  veli: "people",
  sisko: "people",
  vaimo: "people",
  mies: "people",
  ystävä: "heart",
  sää: "sun",
  aurinko: "sun",
  sade: "rain",
  lumi: "snow",
  tuuli: "rain",
  pilvi: "rain",
  pää: "think",
  hiukset: "people",
  silmä: "eye",
  korva: "talk",
  nenä: "people",
  suu: "talk",
  hammas: "talk",
  käsi: "hand",
  jalka: "shoe",
  selkä: "people",
  vatsa: "plate",
  nyt: "clock",
  tänään: "sun",
  eilen: "clock",
  huomenna: "sun",
  aamulla: "sun",
  illalla: "moon",
  yöllä: "moon",
  aina: "clock",
  usein: "clock",
  heti: "run",
  täällä: "pin",
  tuolla: "pin",
  siellä: "pin",
  kotona: "house",
  kotiin: "house",
  kotoa: "house",
  ulkona: "tree",
  sisällä: "house",
  ylhäällä: "sun",
  alhaalla: "pin",
  päällä: "pin",
  alla: "pin",
  edessä: "walk",
  takana: "walk",
  vieressä: "people",
  talo: "house",
  kieli: "talk",
  nainen: "people",
  tyttö: "child",
  maa: "pin",
  iso: "sun",
  pieni: "child",
  hyvä: "heart",
  huono: "no",
  kaunis: "heart",
  lämmin: "sun",
  kuuma: "coffee",
  kylmä: "snow",
  iloinen: "sun",
  väsynyt: "bed",
  auki: "door",
  kiinni: "key",
  musta: "palette",
  valkoinen: "palette",
  punainen: "palette",
  sininen: "palette",
  vihreä: "tree",
  keltainen: "sun",
  ruskea: "bread",
  harmaa: "rain",
  mikä: "bubble",
  kuka: "people",
  missä: "pin",
  mistä: "pin",
  mihin: "pin",
  milloin: "clock",
  miten: "bubble",
  miksi: "bubble",
  paljonko: "coin",
  millainen: "palette",
  ja: "people",
  mutta: "bubble",
  tämä: "hand",
  minä: "people",
  sinä: "people",
  hän: "people",
  "hauska tutustua.": "wave",
  "mitä kuuluu?": "talk",
  "minulla on nälkä.": "plate",
  "minulla on jano.": "drop",
  "yksi kahvi, kiitos.": "coffee",
  "hyvää ruokahalua!": "plate",
  kippis: "tea",
  saluer: "wave",
  politesse: "heart",
  nombres: "star",
  semaine: "sun",
  survie: "bag",
  habits: "shirt",
  table: "plate",
  maison: "house",
  proches: "people",
  meteo: "sun",
  corps: "hand",
  "temps-adv": "clock",
  "lieu-adv": "pin",
  maniere: "run",
  position: "pin",
  taille: "sun",
  qualite: "heart",
  etat: "sun",
  couleurs: "palette",
  questions: "bubble",
  liens: "bubble",
  montrer: "hand",
  apres: "pin",
  echange: "wave",
  comprendre: "talk",
  ville: "city",
  ressenti: "heart",
  formules: "star",
};

const NUMERALS: Record<string, string> = {
  nolla: "0",
  yksi: "1",
  kaksi: "2",
  kolme: "3",
  neljä: "4",
  viisi: "5",
  kuusi: "6",
  seitsemän: "7",
  kahdeksan: "8",
  yhdeksän: "9",
  kymmenen: "10",
  yksitoista: "11",
  kaksikymmentä: "20",
  sata: "100",
  tuhat: "1k",
};

function sceneFor(id: string): Scene {
  const key = id.trim().toLowerCase();
  if (WORDS[key]) return WORDS[key];
  const head = key.split(/[\s,]+/)[0] ?? key;
  return WORDS[head] ?? "star";
}

function Frame({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <>
      <rect width="80" height="80" rx="24" fill={bg} />
      <circle cx="58" cy="18" r="16" fill="#fff" opacity="0.28" />
      {children}
    </>
  );
}

function scenes(scene: Scene): ReactNode {
  switch (scene) {
    case "sun":
      return (
        <Frame bg="#f6d98a">
          <circle cx="40" cy="42" r="14" fill="#f08a24" />
          <g stroke="#f08a24" strokeWidth="3" strokeLinecap="round">
            <path d="M40 18v6M40 60v6M22 42h6M52 42h6M27 29l4 4M49 51l4 4M53 29l-4 4M31 51l-4 4" />
          </g>
        </Frame>
      );
    case "moon":
      return (
        <Frame bg="#2c3d66">
          <path d="M48 18a18 18 0 1 0 0 40 14 14 0 1 1 0-40z" fill="#f4e7b0" />
          <circle cx="24" cy="24" r="2" fill="#fff" />
          <circle cx="30" cy="58" r="1.5" fill="#fff" />
        </Frame>
      );
    case "wave":
      return (
        <Frame bg="#f3c1a5">
          <path d="M28 46c0-8 6-14 14-14 2 0 4 4 2 8 6-2 12 2 12 8v8H28z" fill="#f7e2cf" />
          <path d="M46 22c6 2 8 10 4 16" stroke="#e07a4c" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="34" cy="40" r="3" fill="#e07a4c" />
        </Frame>
      );
    case "heart":
      return (
        <Frame bg="#f3b7c0">
          <path d="M40 58 18 38c-6-6-2-16 7-16 5 0 8 3 10 6 2-3 5-6 10-6 9 0 13 10 7 16z" fill="#d4536a" />
        </Frame>
      );
    case "yes":
      return (
        <Frame bg="#b7e0c2">
          <path d="M22 42l12 12 24-28" fill="none" stroke="#1f7a4d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </Frame>
      );
    case "no":
      return (
        <Frame bg="#f3c1b4">
          <path d="M26 26l28 28M54 26 26 54" stroke="#a33b32" strokeWidth="6" strokeLinecap="round" />
        </Frame>
      );
    case "coffee":
      return (
        <Frame bg="#e7d3bf">
          <path d="M22 32h28v16a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12z" fill="#fff" />
          <path d="M50 36h6a6 6 0 0 1 0 12h-6" fill="none" stroke="#fff" strokeWidth="4" />
          <path d="M28 24c2 4 2 4 0 8M38 22c2 4 2 4 0 8" stroke="#c47a4a" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="36" cy="40" rx="10" ry="4" fill="#6b3a22" />
        </Frame>
      );
    case "tea":
      return (
        <Frame bg="#d5ebc8">
          <path d="M24 34h26v14a10 10 0 0 1-10 10h-6a10 10 0 0 1-10-10z" fill="#fff" />
          <path d="M50 38h5a5 5 0 0 1 0 10h-5" fill="none" stroke="#fff" strokeWidth="3" />
          <circle cx="37" cy="44" r="6" fill="#7dae4a" />
        </Frame>
      );
    case "drop":
      return (
        <Frame bg="#c5e4f5">
          <path d="M40 16c10 14 18 22 18 32a18 18 0 0 1-36 0c0-10 8-18 18-32z" fill="#2f8fbf" />
          <circle cx="34" cy="46" r="4" fill="#fff" opacity="0.7" />
        </Frame>
      );
    case "plate":
      return (
        <Frame bg="#f7e3c4">
          <ellipse cx="40" cy="48" rx="22" ry="10" fill="#fff" />
          <ellipse cx="40" cy="46" rx="14" ry="6" fill="#e07a4c" />
          <path d="M30 28c4 6 16 6 20 0" fill="#7dae4a" />
        </Frame>
      );
    case "bill":
      return (
        <Frame bg="#efe6c8">
          <rect x="24" y="16" width="32" height="48" rx="4" fill="#fff" />
          <path d="M30 28h20M30 36h20M30 44h12" stroke="#c4a15a" strokeWidth="3" strokeLinecap="round" />
        </Frame>
      );
    case "bell":
      return (
        <Frame bg="#f6d98a">
          <path d="M40 16a4 4 0 0 1 4 4c8 2 12 10 12 18v8H24v-8c0-8 4-16 12-18a4 4 0 0 1 4-4z" fill="#e39b2b" />
          <rect x="22" y="46" width="36" height="4" rx="2" fill="#c47a22" />
          <circle cx="40" cy="56" r="4" fill="#e39b2b" />
        </Frame>
      );
    case "key":
      return (
        <Frame bg="#f3d7a1">
          <circle cx="32" cy="32" r="10" fill="none" stroke="#c47a22" strokeWidth="5" />
          <path d="M40 36h16v6h-6v6h-6" fill="none" stroke="#c47a22" strokeWidth="5" strokeLinejoin="round" />
        </Frame>
      );
    case "phone":
      return (
        <Frame bg="#d5dcf3">
          <rect x="28" y="14" width="24" height="52" rx="6" fill="#2c3d66" />
          <rect x="32" y="20" width="16" height="32" rx="2" fill="#8fd0ea" />
          <circle cx="40" cy="58" r="2" fill="#fff" />
        </Frame>
      );
    case "coin":
      return (
        <Frame bg="#f6e2a8">
          <circle cx="40" cy="42" r="18" fill="#e0b03a" />
          <circle cx="40" cy="42" r="12" fill="none" stroke="#fff3c4" strokeWidth="3" />
          <path d="M40 32v20" stroke="#fff3c4" strokeWidth="3" />
        </Frame>
      );
    case "shirt":
      return (
        <Frame bg="#d7e4f8">
          <path d="M28 24l12 8 12-8 8 8-6 6v26H26V38l-6-6z" fill="#4c7fd0" />
        </Frame>
      );
    case "coat":
      return (
        <Frame bg="#e4d7f2">
          <path d="M30 20l10 10 10-10 8 6-4 8v30H26V34l-4-8z" fill="#6d4ea3" />
          <path d="M40 30v34" stroke="#efe6f8" strokeWidth="2" />
        </Frame>
      );
    case "pants":
      return (
        <Frame bg="#d9e7f5">
          <path d="M26 22h28l-2 40H38l-2-22-2 22H28z" fill="#3d6ea8" />
        </Frame>
      );
    case "dress":
      return (
        <Frame bg="#f8d0e0">
          <path d="M32 20h16l6 14-10 6v24H36V40l-10-6z" fill="#d4537a" />
        </Frame>
      );
    case "shoe":
      return (
        <Frame bg="#f0d8c4">
          <path d="M18 48c8-2 14-10 20-10h16c6 0 8 6 8 10v6H18z" fill="#8a4b2f" />
          <path d="M38 38c2-8 8-12 14-12" stroke="#8a4b2f" strokeWidth="4" fill="none" />
        </Frame>
      );
    case "hat":
      return (
        <Frame bg="#f6d98a">
          <ellipse cx="40" cy="48" rx="24" ry="6" fill="#c47a22" />
          <path d="M26 46c2-16 8-22 14-22s12 6 14 22" fill="#e39b2b" />
        </Frame>
      );
    case "bag":
      return (
        <Frame bg="#f3c9a4">
          <rect x="22" y="32" width="36" height="30" rx="6" fill="#c46a3a" />
          <path d="M30 32v-6a10 10 0 0 1 20 0v6" fill="none" stroke="#c46a3a" strokeWidth="4" />
        </Frame>
      );
    case "glasses":
      return (
        <Frame bg="#d9e8f2">
          <circle cx="28" cy="42" r="10" fill="none" stroke="#2c3d66" strokeWidth="4" />
          <circle cx="52" cy="42" r="10" fill="none" stroke="#2c3d66" strokeWidth="4" />
          <path d="M38 42h4" stroke="#2c3d66" strokeWidth="4" />
        </Frame>
      );
    case "bread":
      return (
        <Frame bg="#f6e0b8">
          <path d="M16 46c0-12 12-20 24-20s24 8 24 20v6H16z" fill="#e0a15a" />
          <path d="M28 36c4 4 8 4 12 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </Frame>
      );
    case "apple":
      return (
        <Frame bg="#f7c9c4">
          <circle cx="40" cy="46" r="16" fill="#d64545" />
          <path d="M40 30c4-8 10-8 12-6" stroke="#3d7a45" strokeWidth="3" fill="none" />
          <ellipse cx="46" cy="22" rx="6" ry="3" fill="#7dae4a" />
        </Frame>
      );
    case "fish":
      return (
        <Frame bg="#c5e4f5">
          <ellipse cx="36" cy="42" rx="16" ry="10" fill="#f08a24" />
          <path d="M50 42l14-10v20z" fill="#e07a3a" />
          <circle cx="28" cy="40" r="2" fill="#16352b" />
        </Frame>
      );
    case "house":
      return (
        <Frame bg="#d7ebc8">
          <path d="M16 40 40 18l24 22" fill="#e07a4c" />
          <rect x="24" y="40" width="32" height="24" fill="#f7f1e4" />
          <rect x="36" y="48" width="10" height="16" fill="#c47a4a" />
        </Frame>
      );
    case "door":
      return (
        <Frame bg="#f0d8c4">
          <rect x="26" y="16" width="28" height="50" rx="4" fill="#c47a4a" />
          <circle cx="46" cy="42" r="2" fill="#f6e2a8" />
        </Frame>
      );
    case "bed":
      return (
        <Frame bg="#ddd4f2">
          <rect x="14" y="40" width="52" height="16" rx="4" fill="#fff" />
          <rect x="18" y="28" width="16" height="12" rx="4" fill="#d4537a" />
          <path d="M14 40v16M66 40v16" stroke="#6d4ea3" strokeWidth="4" />
        </Frame>
      );
    case "people":
      return (
        <Frame bg="#f7d7c4">
          <circle cx="30" cy="30" r="8" fill="#f0b48a" />
          <circle cx="50" cy="32" r="7" fill="#e0a070" />
          <path d="M16 60c2-12 8-16 14-16s12 4 14 16" fill="#4c7fd0" />
          <path d="M40 60c2-10 6-14 12-14s10 4 12 14" fill="#d4536a" />
        </Frame>
      );
    case "child":
      return (
        <Frame bg="#f8e0b0">
          <circle cx="40" cy="30" r="10" fill="#f0b48a" />
          <path d="M24 62c2-14 8-18 16-18s14 4 16 18z" fill="#f08a24" />
        </Frame>
      );
    case "rain":
      return (
        <Frame bg="#c9d7ea">
          <ellipse cx="40" cy="32" rx="18" ry="10" fill="#8aa0bf" />
          <path d="M28 48l-4 10M40 46l-4 12M52 48l-4 10" stroke="#2f8fbf" strokeWidth="3" strokeLinecap="round" />
        </Frame>
      );
    case "snow":
      return (
        <Frame bg="#e7f2f8">
          <path d="M40 18v44M22 30l36 20M22 50l36-20" stroke="#7eb0d4" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="40" r="4" fill="#fff" />
        </Frame>
      );
    case "tree":
      return (
        <Frame bg="#d5ebc8">
          <rect x="36" y="48" width="8" height="18" fill="#8a5a32" />
          <circle cx="40" cy="36" r="16" fill="#3d8a4a" />
          <circle cx="30" cy="40" r="10" fill="#4ea35a" />
          <circle cx="50" cy="42" r="9" fill="#2f7a40" />
        </Frame>
      );
    case "book":
      return (
        <Frame bg="#f6d7c8">
          <path d="M18 22h20v40H22a4 4 0 0 1-4-4z" fill="#fff" />
          <path d="M42 22h20v36a4 4 0 0 1-4 4H42z" fill="#fff" />
          <path d="M40 22v40" stroke="#d4536a" strokeWidth="3" />
          <path d="M24 32h10M24 40h10M46 32h10M46 40h10" stroke="#e07a4c" strokeWidth="2" strokeLinecap="round" />
        </Frame>
      );
    case "pen":
      return (
        <Frame bg="#d9e7f5">
          <path d="M22 54 48 20l8 8-26 34z" fill="#3d6ea8" />
          <path d="M22 54l-4 8 10-4" fill="#f08a24" />
        </Frame>
      );
    case "walk":
      return (
        <Frame bg="#cfe8d4">
          <circle cx="40" cy="22" r="7" fill="#f0b48a" />
          <path d="M40 30l-6 16 8 4 6-12 8 16" fill="none" stroke="#1f6f5b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M34 40l-10 6" stroke="#1f6f5b" strokeWidth="4" strokeLinecap="round" />
        </Frame>
      );
    case "eye":
      return (
        <Frame bg="#d5e8f6">
          <path d="M12 42s10-16 28-16 28 16 28 16-10 16-28 16S12 42 12 42z" fill="#fff" />
          <circle cx="40" cy="42" r="8" fill="#2c3d66" />
          <circle cx="43" cy="39" r="3" fill="#fff" />
        </Frame>
      );
    case "talk":
      return (
        <Frame bg="#f8e0b0">
          <rect x="14" y="18" width="40" height="30" rx="10" fill="#fff" />
          <path d="M28 48l-6 12 16-12" fill="#fff" />
          <path d="M24 32h20M24 38h12" stroke="#e39b2b" strokeWidth="3" strokeLinecap="round" />
        </Frame>
      );
    case "think":
      return (
        <Frame bg="#e4d7f2">
          <circle cx="34" cy="36" r="14" fill="#fff" />
          <circle cx="52" cy="50" r="6" fill="#fff" />
          <circle cx="60" cy="58" r="3" fill="#fff" />
          <circle cx="30" cy="34" r="2" fill="#6d4ea3" />
          <circle cx="38" cy="34" r="2" fill="#6d4ea3" />
        </Frame>
      );
    case "run":
      return (
        <Frame bg="#f8d0b8">
          <circle cx="48" cy="22" r="7" fill="#f0b48a" />
          <path d="M44 30 30 46l12 2 4 14M36 44 22 50M42 34l14 6" fill="none" stroke="#d4533a" strokeWidth="4" strokeLinecap="round" />
        </Frame>
      );
    case "sauna":
      return (
        <Frame bg="#f3c1a5">
          <path d="M18 58V36l22-16 22 16v22z" fill="#c46a3a" />
          <path d="M34 28c4-6 4-6 0-12M46 28c4-6 4-6 0-12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </Frame>
      );
    case "letter":
      return (
        <Frame bg="#f7e3c4">
          <rect x="14" y="24" width="52" height="36" rx="4" fill="#fff" />
          <path d="M14 24l26 20 26-20" fill="none" stroke="#e07a4c" strokeWidth="3" />
        </Frame>
      );
    case "shop":
      return (
        <Frame bg="#f6d7c8">
          <path d="M16 32h48l-4 10H20z" fill="#e07a4c" />
          <rect x="22" y="42" width="36" height="22" fill="#fff" />
          <path d="M24 32V24h8v8M36 32V22h8v10M48 32v-6h6v6" stroke="#c46a3a" strokeWidth="2" />
        </Frame>
      );
    case "city":
      return (
        <Frame bg="#d5e4f5">
          <rect x="14" y="36" width="14" height="28" fill="#4c7fd0" />
          <rect x="32" y="22" width="16" height="42" fill="#2c3d66" />
          <rect x="52" y="40" width="14" height="24" fill="#7aa2e0" />
          <rect x="36" y="28" width="3" height="3" fill="#f6d98a" />
          <rect x="42" y="28" width="3" height="3" fill="#f6d98a" />
        </Frame>
      );
    case "clock":
      return (
        <Frame bg="#f6e2a8">
          <circle cx="40" cy="42" r="18" fill="#fff" />
          <path d="M40 42V30M40 42l10 6" stroke="#c47a22" strokeWidth="3" strokeLinecap="round" />
        </Frame>
      );
    case "pin":
      return (
        <Frame bg="#f3c1b4">
          <path d="M40 16c10 0 16 8 16 16 0 12-16 28-16 28S24 44 24 32c0-8 6-16 16-16z" fill="#d4536a" />
          <circle cx="40" cy="32" r="5" fill="#fff" />
        </Frame>
      );
    case "palette":
      return (
        <Frame bg="#efe6f8">
          <path d="M24 44c0-14 12-24 26-20 8 2 12 12 8 20-6 2-8-2-12-2-6 0-8 6-14 6-6 0-8-2-8-4z" fill="#fff" />
          <circle cx="34" cy="36" r="3" fill="#d4536a" />
          <circle cx="44" cy="32" r="3" fill="#e0b03a" />
          <circle cx="50" cy="42" r="3" fill="#3d8a4a" />
          <circle cx="40" cy="46" r="3" fill="#4c7fd0" />
        </Frame>
      );
    case "bubble":
      return (
        <Frame bg="#d5e8f6">
          <rect x="14" y="18" width="52" height="36" rx="16" fill="#fff" />
          <path d="M28 54l-4 10 16-10" fill="#fff" />
          <text x="40" y="42" textAnchor="middle" fontSize="18" fontFamily="Georgia, serif" fill="#2c3d66">
            ?
          </text>
        </Frame>
      );
    case "hand":
      return (
        <Frame bg="#f7d7c4">
          <path d="M30 46V28a4 4 0 0 1 8 0v12h2V26a4 4 0 0 1 8 0v14h2V30a4 4 0 0 1 8 0v20c0 10-8 16-18 16h-4c-8 0-14-6-14-16z" fill="#f0b48a" />
        </Frame>
      );
    default:
      return (
        <Frame bg="#f6e2a8">
          <path d="M40 16l6 14h16l-12 10 4 16-14-8-14 8 4-16-12-10h16z" fill="#e0b03a" />
        </Frame>
      );
  }
}

export function Picture({ id, scene, size = 48 }: { id?: string; scene?: Scene; size?: number }) {
  const numeral = id ? NUMERALS[id.trim().toLowerCase()] : undefined;
  if (!scene && numeral) {
    const hues = ["#f6d98a", "#f3c1a5", "#c5e4f5", "#d5ebc8", "#f3b7c0", "#e4d7f2", "#f7e3c4", "#d9e7f5"];
    const bg = hues[numeral.length + numeral.charCodeAt(0)] ?? hues[0];
    return (
      <i className="pic" style={{ width: size, height: size }} aria-hidden="true">
        <svg viewBox="0 0 80 80" width={size} height={size}>
          <Frame bg={bg}>
            <text x="40" y="50" textAnchor="middle" fontSize={numeral.length > 2 ? 22 : 32} fontFamily="Georgia, serif" fill="#16352b">
              {numeral}
            </text>
          </Frame>
        </svg>
      </i>
    );
  }
  const drawn = scene ?? sceneFor(id ?? "");
  return (
    <i className="pic" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 80 80" width={size} height={size}>
        {scenes(drawn)}
      </svg>
    </i>
  );
}
