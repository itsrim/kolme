import type { Level } from "../types";

export interface Paragraph {
  fi: string;
  fr: string;
}

export interface Reading {
  id: string;
  level: Level;
  title: string;
  fiTitle: string;
  minutes: number;
  intro: string;
  paragraphs: Paragraph[];
}

export const LEVELS: { id: Level; fr: string; hint: string }[] = [
  { id: "A1", fr: "Découverte", hint: "Textes courts au présent. Lis-les d'une traite." },
  { id: "A2", fr: "Élémentaire", hint: "Petits récits à l'imparfait, en paragraphes." },
  { id: "B1", fr: "Intermédiaire", hint: "Textes du quotidien, avec des phrases reliées." },
  { id: "B2", fr: "Avancé", hint: "Pages plus denses. Tiens le rythme jusqu'au bout." },
];

export const READINGS: Reading[] = [
  {
    id: "aamu",
    level: "A1",
    title: "Le matin",
    fiTitle: "Aamu",
    minutes: 5,
    intro: "Un matin entier, pas une liste de phrases. Le micro suit les mots : le vert veut dire que le finnois a été reconnu.",
    paragraphs: [
      {
        fi: "Minä olen Anna ja asun pienessä asunnossa Helsingissä. Tänään on maanantai. Herään kello seitsemän, pesen kasvot ja juon kahvia. Syön leipää ja juustoa. Sitten puen takin ja menen töihin. Työ alkaa kello kahdeksan.",
        fr: "Je suis Anna et j'habite un petit appartement à Helsinki. Aujourd'hui, c'est lundi. Je me réveille à sept heures, je me lave le visage et je bois du café. Je mange du pain et du fromage. Ensuite j'enfile mon manteau et je vais au travail. Le travail commence à huit heures.",
      },
      {
        fi: "Päivä on tavallinen. Puhun työkavereiden kanssa ja kirjoitan viestejä. Iltapäivällä juon vielä yhden kahvin. Kello neljä lähden kotiin. Bussi on täynnä, mutta istuudun ikkunan viereen ja katson katua.",
        fr: "La journée est ordinaire. Je parle avec les collègues et j'écris des messages. L'après-midi, je bois encore un café. À quatre heures, je rentre. Le bus est plein, mais je m'assois près de la fenêtre et je regarde la rue.",
      },
      {
        fi: "Kotona on hiljaista. Laitan ruoan, luen kirjaa ja kuuntelen radiota. Kello on jo kymmenen. Sammutan valon, sanon hyvää yötä ja menen nukkumaan.",
        fr: "À la maison, c'est calme. Je prépare à manger, je lis un livre et j'écoute la radio. Il est déjà dix heures. J'éteins la lumière, je dis bonne nuit et je vais dormir.",
      },
    ],
  },
  {
    id: "kauppa",
    level: "A1",
    title: "À l'épicerie",
    fiTitle: "Kaupassa",
    minutes: 5,
    intro: "Une scène continue, de la porte du magasin jusqu'à la rue.",
    paragraphs: [
      {
        fi: "Töiden jälkeen menen kauppaan. Kauppa on kotikadun päässä, ja ovi on auki myöhään. Otan korin ja etsin maitoa. Maito on takaseinällä, ja leipä on sen vieressä. Otan myös kolme omenaa ja pienen jogurtin.",
        fr: "Après le travail, je vais à l'épicerie. Elle est au bout de ma rue, et la porte reste ouverte tard. Je prends un panier et je cherche le lait. Le lait est contre le mur du fond, et le pain est à côté. Je prends aussi trois pommes et un petit yaourt.",
      },
      {
        fi: "Jonotan kassalle. Edessäni on vanha mies, joka etsii lompakkoa hitaasti. Myyjä odottaa rauhassa eikä sano mitään. Sitten on minun vuoroni. Maito maksaa kaksi euroa, ja koko ostos maksaa vähän yli seitsemän.",
        fr: "Je fais la queue à la caisse. Devant moi, un vieil homme cherche son portefeuille lentement. La vendeuse attend calmement et ne dit rien. Puis c'est mon tour. Le lait coûte deux euros, et toutes les courses coûtent un peu plus de sept.",
      },
      {
        fi: "Myyjä kysyy, haluanko kuitin. Katson paperia hetken ja sanon, että en tarvitse sitä. Kiitän häntä ja sanon hei hei. Ulkona sataa vähän. Kävelen kotiin ja mietin, mitä teen ruoaksi.",
        fr: "La vendeuse demande si je veux le reçu. Je regarde le papier un instant et je dis que je n'en ai pas besoin. Je la remercie et je dis au revoir. Dehors, il pleut un peu. Je rentre à pied et je me demande ce que je vais cuisiner.",
      },
    ],
  },
  {
    id: "viikonloppu",
    level: "A2",
    title: "Le week-end",
    fiTitle: "Viikonloppu",
    minutes: 7,
    intro: "Un récit au passé. Ne t'arrête pas entre les phrases : le texte avance tout seul si les mots sont reconnus.",
    paragraphs: [
      {
        fi: "Viikonloppu alkoi hitaasti. Lauantai-aamuna heräsin myöhään, koska en halunnut lähteä mihinkään. Söin aamiaista ikkunan ääressä ja katsoin, miten sade loppui. Puoleenpäivään mennessä sää oli jo kaunis ja valoisa.",
        fr: "Le week-end a commencé lentement. Samedi matin, je me suis réveillé tard, parce que je ne voulais aller nulle part. J'ai pris le petit-déjeuner près de la fenêtre et j'ai regardé la pluie s'arrêter. À midi, le temps était déjà beau et lumineux.",
      },
      {
        fi: "Iltapäivällä lähdin ulos ystävän kanssa. Kävelimme puistossa, joimme teetä pienessä kahvilassa ja puhuimme tulevasta viikosta. Illalla katsoimme elokuvan hänen kotonaan. Elokuva oli pitkä, mutta emme väsyneet, koska juttu jatkui sen jälkeenkin.",
        fr: "L'après-midi, je suis sorti avec un ami. Nous nous sommes promenés dans le parc, nous avons bu du thé dans un petit café et nous avons parlé de la semaine à venir. Le soir, nous avons regardé un film chez lui. Le film était long, mais nous n'étions pas fatigués, parce que la conversation a continué après.",
      },
      {
        fi: "Sunnuntaina nukuin taas pitkään. Sitten siivosin asunnon, pesin pyykit ja kirjoitin muutaman viestin. Illalla valmistauduin maanantaihin. Tarvitsin unta ja rauhaa, koska uusi viikko alkoi aikaisin.",
        fr: "Dimanche, j'ai encore dormi longtemps. Ensuite j'ai nettoyé l'appartement, fait les lessives et écrit quelques messages. Le soir, je me suis préparé pour lundi. J'avais besoin de sommeil et de calme, parce que la nouvelle semaine commençait tôt.",
      },
    ],
  },
  {
    id: "kahvila",
    level: "A2",
    title: "Le café",
    fiTitle: "Kahvila",
    minutes: 7,
    intro: "Reste dans la salle du début à la fin. La traduction du paragraphe en cours reste à côté.",
    paragraphs: [
      {
        fi: "Tämä kahvila on pieni mutta valoisa. Ikkunat ovat kadulle päin, ja pöydät ovat lähellä toisiaan. Istun nurkkapöytään, otan takin selästäni ja katson ihmisiä. Ulkona ihmiset kulkevat nopeasti, sisällä kukaan ei pidä kiirettä.",
        fr: "Ce café est petit mais lumineux. Les fenêtres donnent sur la rue, et les tables sont proches les unes des autres. Je m'assois à la table du coin, j'enlève mon manteau et je regarde les gens. Dehors, les gens marchent vite ; dedans, personne n'est pressé.",
      },
      {
        fi: "Tarjoilija tulee luokseni ja kysyy, haluanko vielä kahvia. Kyllä, kiitos, ja yhden pullan. Pulla on tuore, makea ja vielä lämmin. Juon kahvin hitaasti ja luen vanhaa sanomalehteä, jonka joku on jättänyt pöydälle.",
        fr: "Le serveur vient vers moi et demande si je veux encore du café. Oui, merci, et un petit pain. Le petit pain est frais, sucré et encore chaud. Je bois le café lentement et je lis un vieux journal que quelqu'un a laissé sur la table.",
      },
      {
        fi: "Kun lasi on tyhjä, maksan kortilla ja jätän pienen tipin. Ulkona alkaa taas sataa. Jään siis vielä hetkeksi, katson sadetta ja mietin, lähdenkö heti vai odotanko. Lopulta nousen, kiitän ja avaan oven.",
        fr: "Quand le verre est vide, je paie par carte et je laisse un petit pourboire. Dehors, il se remet à pleuvoir. Je reste donc encore un moment, je regarde la pluie et je me demande si je pars tout de suite ou si j'attends. Finalement je me lève, je remercie et j'ouvre la porte.",
      },
    ],
  },
  {
    id: "turku",
    level: "B1",
    title: "Un samedi à Turku",
    fiTitle: "Lauantai Turussa",
    minutes: 8,
    intro: "Lis le voyage comme une page, sans t'arrêter à chaque verbe.",
    paragraphs: [
      {
        fi: "Viime lauantaina matkustin Turkuun aikaisella junalla. Asemalla oli vielä hiljaista, ja otin ikkunapaikan. Matka kesti noin kaksi tuntia. Katsoin peltoja, metsiä ja pieniä asemia, joissa juna ei pysähtynyt. Join kahvin junassa ja luin muutaman sivun kirjaa, mutta en keskittynyt kunnolla, koska odotin jo perillä oloa.",
        fr: "Samedi dernier, je suis allé à Turku par un train tôt le matin. La gare était encore calme, et j'ai pris une place côté fenêtre. Le voyage a duré environ deux heures. Je regardais les champs, les forêts et les petites gares où le train ne s'arrêtait pas. J'ai bu un café dans le train et lu quelques pages, mais je n'arrivais pas vraiment à me concentrer, parce que j'attendais déjà d'être arrivé.",
      },
      {
        fi: "Turun asemalla ystäväni odotti minua laiturilla. Halasimme ja lähdimme kävelemään keskustaan, koska sää oli lämmin eikä meillä ollut kiirettä. Joen rannalla söimme lohikeittoa ja puhuimme siitä, miten kaupunki oli muuttunut. Sen jälkeen menimme museoon. Siellä oli hiljaista, ja jäimme pitkäksi aikaa yhden vanhan kartan eteen.",
        fr: "À la gare de Turku, mon ami m'attendait sur le quai. Nous nous sommes embrassés et nous sommes partis à pied vers le centre, parce qu'il faisait doux et que nous n'étions pas pressés. Au bord du fleuve, nous avons mangé de la soupe de saumon et parlé de la façon dont la ville avait changé. Ensuite nous sommes allés au musée. C'était calme, et nous sommes restés longtemps devant une vieille carte.",
      },
      {
        fi: "Olisimme jääneet pidemmäksi aikaa, mutta viimeinen juna lähti aikaisin. Kävelimme takaisin asemalle hitaasti ja ostimme pullat matkalle. Illalla, kun olin taas kotona, kirjoitin ystävälleni ja kiitin mukavasta päivästä. Junassa olin väsynyt, mutta nukuin hyvin, koska päivä oli ollut juuri sopivan pitkä.",
        fr: "Nous serions restés plus longtemps, mais le dernier train partait tôt. Nous sommes revenus à la gare lentement et nous avons acheté des petits pains pour le trajet. Le soir, une fois rentré, j'ai écrit à mon ami et je l'ai remercié pour cette belle journée. Dans le train j'étais fatigué, mais j'ai bien dormi, parce que la journée avait eu juste la bonne longueur.",
      },
    ],
  },
  {
    id: "sauna",
    level: "B1",
    title: "Le sauna",
    fiTitle: "Sauna",
    minutes: 8,
    intro: "Un mode d'emploi écrit comme un texte. Le passif (« on ») revient souvent : peseydytään, istutaan, juodaan.",
    paragraphs: [
      {
        fi: "Suomalainen sauna ei ole vain kuuma huone talon perällä. Se on paikka, jossa päivä hidastuu. Ensin peseydytään rauhassa, sitten istutaan lauteille ja annetaan lämmön tulla iholle. Kukaan ei pidä kiirettä, eikä kukaan selitä koko elämäänsä heti ovella.",
        fr: "Le sauna finlandais n'est pas seulement une pièce chaude au fond de la maison. C'est un endroit où la journée ralentit. D'abord on se lave tranquillement, puis on s'assoit sur les gradins et on laisse la chaleur venir sur la peau. Personne n'est pressé, et personne ne raconte toute sa vie dès la porte.",
      },
      {
        fi: "Löylyä heitetään kiukaalle varovasti. Jos tulee liian kuuma, voi nousta alas, käydä suihkussa tai mennä hetkeksi ulos. Saunan jälkeen juodaan usein vettä ja istutaan hiljaa. Monille tämä on päivän ainoa hetki, jolloin ei tarvitse puhua eikä vastata viesteihin.",
        fr: "On jette de l'eau sur le poêle avec précaution. S'il fait trop chaud, on peut descendre, passer sous la douche ou sortir un moment. Après le sauna, on boit souvent de l'eau et on reste assis en silence. Pour beaucoup, c'est le seul moment de la journée où l'on n'a pas besoin de parler ni de répondre aux messages.",
      },
      {
        fi: "Jos menet saunaan vieraana, katso ensin muita. Älä melua, äläkä heitä löylyä kysymättä. Kysy rauhallisesti, sopiiko lisää lämpöä. Pieni kysymys riittää. Sen jälkeen voit itsekin istua, hengittää ja olla vain siinä huoneessa, kunnes on aika lähteä.",
        fr: "Si tu vas au sauna en invité, regarde d'abord les autres. Ne fais pas de bruit, et ne jette pas d'eau sans demander. Demande calmement si un peu plus de chaleur convient. Une petite question suffit. Ensuite tu peux toi aussi t'asseoir, respirer, et simplement rester dans cette pièce, jusqu'à ce qu'il soit temps de partir.",
      },
    ],
  },
  {
    id: "metsa",
    level: "B2",
    title: "La forêt en septembre",
    fiTitle: "Syysmetsä",
    minutes: 9,
    intro: "Lis la page sans décortiquer. Reviens au français seulement si un paragraphe se ferme.",
    paragraphs: [
      {
        fi: "Syyskuun lopussa metsä muuttaa äänensä. Lehdet eivät enää kahise samalla tavalla, koska yöt ovat olleet kylmiä ja polku on märkä. Askel uppoaa vähän, ja jostain kauempaa kuuluu tie, vaikka sitä ei näe. Jos jäisit tähän iltahämärässä, kuulisit lähinnä pisarat ja oman hengityksesi.",
        fr: "À la fin septembre, la forêt change de voix. Les feuilles ne bruissent plus de la même façon, parce que les nuits ont été froides et que le sentier est mouillé. Le pas s'enfonce un peu, et quelque part plus loin on entend une route, même si on ne la voit pas. Si tu restais ici au crépuscule, tu n'entendrais surtout que les gouttes et ta propre respiration.",
      },
      {
        fi: "Kuljin hitaasti enkä halunnut ottaa puhelinta esiin. Tällaisina hetkinä suomi tuntuu kieleltä, joka osaa olla hiljaa. Sanat ovat lyhyitä, mutta niihin tarttuu koko maisema: suo, kuusi, tuuli, hämärä. Ei tarvitse selittää kaikkea loppuun asti. Riittää, että lause jää vähän auki, niin kuin polku puiden välissä.",
        fr: "J'avançais lentement et je ne voulais pas sortir mon téléphone. Dans ces moments-là, le finnois semble une langue qui sait se taire. Les mots sont courts, mais tout le paysage s'y accroche : la tourbière, l'épicéa, le vent, le crépuscule. Il n'est pas nécessaire de tout expliquer jusqu'au bout. Il suffit que la phrase reste un peu ouverte, comme le sentier entre les arbres.",
      },
      {
        fi: "En tarvinnut käännöstä. Riitti, että olin siellä ja että osasin nimetä muutaman asian oikein. Kun tulin tielle takaisin, kaupungin valot näkyivät jo. Metsä jäi selän taakse, mutta sen hiljaisuus kulki mukanani vielä bussipysäkille asti.",
        fr: "Je n'avais pas besoin de traduction. Il suffisait que je sois là et que je sache nommer quelques choses correctement. Quand je suis revenu sur la route, les lumières de la ville se voyaient déjà. La forêt est restée derrière moi, mais son silence m'a accompagné jusqu'à l'arrêt de bus.",
      },
    ],
  },
  {
    id: "kirje",
    level: "B2",
    title: "Lettre après trois mois",
    fiTitle: "Kirje",
    minutes: 9,
    intro: "Une lettre à lire jusqu'au point final. C'est le texte du bout des trois mois.",
    paragraphs: [
      {
        fi: "Rakas ystävä. Kirjoitan sinulle keittiön pöydän ääressä, kun ulkona on jo pimeää, vaikka kello on vasta viisi. Olen asunut täällä kolme kuukautta, enkä enää eksy joka aamulla. Aluksi pelkäsin puhua, koska jokainen pääte tuntui arvoitukselta. Nyt osaan kysyä tietä, tilata kahvin ja kertoa, missä asun, ilman että vaihdan englantiin kesken lauseen.",
        fr: "Cher ami. Je t'écris à la table de la cuisine, alors que dehors il fait déjà nuit, bien qu'il ne soit que cinq heures. J'habite ici depuis trois mois, et je ne me perds plus tous les matins. Au début, j'avais peur de parler, parce que chaque désinence semblait une énigme. Maintenant je sais demander mon chemin, commander un café et dire où j'habite, sans passer à l'anglais au milieu de la phrase.",
      },
      {
        fi: "En väitä, että puhun sujuvasti. Hidastun yhä, kun pitää valita partitiivin ja genetiivin välillä, ja joskus sanon sanan, jonka tunnistan vasta jälkikäteen. Silti ihmiset ymmärtävät. Eilen naapuri jäi portaikkoon juttelemaan säästä, ja minä pysyin mukana. Se tuntui isolta asialta, vaikka keskustelu kesti vain muutaman minuutin.",
        fr: "Je ne prétends pas parler couramment. Je ralentis encore quand il faut choisir entre le partitif et le génitif, et parfois je dis un mot que je ne reconnais qu'après coup. Pourtant les gens comprennent. Hier, le voisin s'est arrêté dans la cage d'escalier pour parler du temps, et je suis resté dans la conversation. Ça m'a semblé une grande chose, même si elle n'a duré que quelques minutes.",
      },
      {
        fi: "Jos tulisit käymään, veisin sinut saareen, johon pääsee lautalla, ja sen jälkeen pieneen kahvilaan, jossa kukaan ei hoputa. Siihen asti opettelen sanoja, jotka tarttuvat toisiinsa kuin pakkanen ikkunaan. Kirjoita minulle, milloin voit lähteä. Odotan sinua, ja lupaan lukea vastauksesi ääneen, hitaasti ja oikein.",
        fr: "Si tu venais me voir, je t'emmènerais dans une île où l'on arrive par le ferry, puis dans un petit café où personne ne presse. D'ici là, j'apprends des mots qui s'accrochent les uns aux autres comme le gel à la vitre. Écris-moi quand tu peux partir. Je t'attends, et je promets de lire ta réponse à voix haute, lentement et correctement.",
      },
    ],
  },
];

export function readingById(id: string | undefined): Reading | undefined {
  return READINGS.find((reading) => reading.id === id);
}
