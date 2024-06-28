const configDE = {
  title: "BH-Finder",
  welcomeText:
    "Hey Schönheit, hier finden wir gemeinsam Deine Traum-BHs – abgestimmt auf Deinen einzigartigen Körper und Geschmack! ",
  startButtonText: "BH-Finder starten",
  successText: "Juhuu, wir haben <strong>11 Artikel<strong> für Dich gefunden",
  selectionTitle: "Deine Auswahl",
  nextButtonText: "WEITER",
  nextButtonTextNoSize:
    'WEITER <span class="bh-finder__next--hint">(ohne Größe)</span>',
  resultsButtonText: "Ergebnis anzeigen",
  quickResultsButtonText: "Überspringen und <br /> Ergebnisse anzeigen",
  resultsLabel: "Artikel<br />gefunden",
  noResultsText:
    'Leider können wir keine BHs finden, die Deiner Auswahl entsprechen. Bitte ändere oder erweitere Deine Auswahl. Gerne beraten Dich auch unsere BH-Expertinnen im Live-Chat, per WhatsApp oder telefonisch. Du kannst sie <a target="_blank" href="/persoenliche-Beratung/">hier</a> kontaktieren.',
  results: {
    title: "Top Empfehlungen",
    text: (total = "") =>
      `Juhu, wir haben <strong>${total} Artikel gefunden</strong>, die jeweils mindestens einer Deiner ausgewählten Eigenschaften pro Frage entsprechen: `,
    textFewResultsPre: (total = "") =>
      `Wir haben nur <strong>${total} Artikel gefunden</strong>, die jeweils mindestens einer Deiner ausgewählten Eigenschaften pro Frage entsprechen: `,
    textFewResultsPost:
      "Um mehr passende Artikel zu sehen, ändere Deine Auswahl, indem Du Eigenschaften entfernst oder hinzufügst.",
    attributeResults: {
      title: "Empfehlung",
      text: "Diese BHs könnten für Dich auch interessant sein.",
    },
    notRecommendedResults: {
      title: "Nicht empfohlen",
      text: "Diese Artikel solltest Du vermeiden",
    },
  },
  pageSize: 24,
  questions: [
    {
      id: "size",
      title: "",
      preText:
        "<p>Wähle Deine BH-Größe aus, damit wir Dir passende Empfehlungen anzeigen können.</p>",
      text: "Deine SugarShape Größe: Perfekte Passform durch neues Größensystem!",
      optionsType: "size",
      before: [],
      next: "attributes",
      following: ["attributes", "breastform", "breasttissuetype", "size2"],
      options: [],
      sizeStepText: (susType) => {
        if (susType)
          return [
            "1. Wähle Deinen Unterbrustumfang (in cm).",
            "2. Wähle Deine SugarShape Größe: Unterbrustumfang/Brustumfang in cm z.B. 80/100.",
          ];
        return ["1. Wähle Dein Unterbrustband ", "2. Wähle Deine BH-Größe"];
      },
      sizeTypeButtonText: (isSusSizeType) =>
        isSusSizeType ? "Standardgröße wählen" : "SugarShape Größe wählen",
      sizeInfoText: (toggleCalculator) => (
        <>
          Du willst einen <strong>perfekt sitzenden BH</strong>? Dann nutze
          unsere{" "}
          <button onClick={toggleCalculator} className="bh-finder__linkButton">
            Anleitung
          </button>{" "}
          und miss Dich aus, um Deine SugarShape-Größe in 2 Schritten zu
          ermitteln. Alternativ kannst Du auch Deine Standard-BH-Größe
          auswählen. Aber bitte beachte, dass BH-Größen verschiedener Hersteller
          unterschiedlich ausfallen können. Bei Fragen hilft Dir unser{" "}
          <a
            target="_blank"
            href="/persoenliche-Beratung/"
            className="underline"
          >
            Kundenservice
          </a>{" "}
          gerne weiter.
        </>
      ),
      sizeCalculatorText: (visible) =>
        visible ? "Größenrechner ausblenden" : "Zum Größenrechner",
    },
    {
      id: "attributes",
      title: "",
      preText:
        "<p>Wähle alles aus, was Dich interessiert, damit wir Dir eine vielfältige Auswahl anzeigen können.</p>",
      text: "Welche Eigenschaften sind Dir bei BHs besonders wichtig?",
      aText: "BH-Eigenschaften",
      optionsType: "icon",
      before: ["size"],
      next: "breastform",
      following: ["breastform", "breasttissuetype", "size2"],
      options: [
        {
          title: "kein Abzeichnen unter Kleidung",
          track: "kein Abzeichnen unter Kleidung",
          image: "02-Icons_BH_Beratung-20px-Nicht_Abzeichnen.svg",
          attributes: [{ name: "eigenschaften", value: "T-Shirt-BHs" }],
          excludes: [],
        },
        {
          title: "ohne Bügel",
          track: "ohne Bügel",
          image: "01-Icons_BH_Beratung-20px_buegellos_bequem.svg",
          attributes: [{ name: "eigenschaften", value: "bügellose BHs" }],
          excludes: [],
        },
        {
          title: "besonderer Look",
          track: "something special",
          image: "03-Icons_BH_Beratung-20px-Spitze.svg",
          attributes: [
            { name: "eigenschaften", value: "Spitzen-BHs" },
            { name: "style", value: "trendy" },
          ],
          excludes: [
            { name: "kollektion", value: "Rosalie" },
            { name: "kollektion", value: "Blossom" },
            { name: "kollektion", value: "Emma" },
          ],
        },
        {
          title: "starker Halt",
          track: "starker Halt",
          image: "04-Icons_BH_Beratung-20px-Halt.svg",
          attributes: [
            { name: "eigenschaften", value: "T-Shirt-BHs" },
            { name: "schnitt", value: "Bralettes" },
            { name: "schnitt", value: "Sport-BHs" },
          ],
          excludes: [
            { name: "kollektion", value: "LUCY" },
            { name: "kollektion", value: "GRACE" },
            { name: "kollektion", value: "STARS" },
            { name: "kollektion", value: "FLOW" },
            { name: "kollektion", value: "ROYAL DELITE," },
            { name: "kollektion", value: "ROYAL DIVA" },
            { name: "kollektion", value: "ROYAL FIT" },
            { name: "kollektion", value: "ROYAL MAGIC" },
            { name: "kollektion", value: "ROYAL MIRACLE" },
            { name: "kollektion", value: "ROYAL PUSH" },
          ],
        },
        {
          title: "tiefer Ausschnitt",
          track: "tiefer Ausschnitt",
          image: "06_Icons_BH_Beratung-20px-Ausschnitt.svg",
          attributes: [
            { name: "schnitt", value: "Demi-BHs" },
            { name: "schnitt", value: "Plunge-BHs" },
          ],
          excludes: [],
        },
        {
          title: "umschließt viel Brust",
          track: "umschließt viel Brust",
          image: "05-Icons_BH_Beratung-20px-Brust_Umschliessen.svg",
          attributes: [
            { name: "eigenschaften", value: "Multiway-BHs" },
            { name: "schnitt", value: "Balconette-BHs" },
            { name: "eigenschaften", value: "Spacer-BHs" },
            { name: "schnitt", value: "Bralettes" },
            { name: "schnitt", value: "Sport-BHs" },
            { name: "schnitt", value: "Full-Cup-BHs" },
          ],
          excludes: [],
        },
        {
          title: "abnehmbare Träger",
          track: "abnehmbare Träger",
          image: "07-Icons_BH_Beratung-20px-Traegerlos.svg",
          attributes: [{ name: "eigenschaften", value: "Multiway-BHs" }],
          excludes: [],
        },
        {
          title: "trägt nicht auf",
          track: "Be light and not add extra",
          image: "09-Icons_BH_Beratung-20px-Nicht_extra_auftragen.svg",
          attributes: [
            { name: "wattierung", value: "unwattiert" },
            { name: "wattierung", value: "leicht wattiert" },
            { name: "wattierung", value: "unwattiert" },
            { name: "wattierung", value: "leicht wattiert" },
          ],
          excludes: [],
        },
        {
          title: "kein Abzeichnen der Brustwarzen",
          track: "kein Abzeichnen der Brustwarzen",
          image: "11-Icons_BH_Beratung-20px-Brust_umschliessen.svg",
          attributes: [
            { name: "wattierung", value: "wattiert" },
            { name: "wattierung", value: "Push-up" },
          ],
          excludes: [],
        },
        {
          title: "betont meine Kurven",
          track: "betont meine Kurven",
          image: "10-Icons_BH_Beratung-20px-Kuven_betonen.svg",
          attributes: [
            { name: "wattierung", value: "wattiert" },
            { name: "wattierung", value: "Push-up" },
          ],
          excludes: [],
        },
        {
          title: "Ich bin für alles offen",
          track: "Ich bin für alles offen",
          wildcard: true,
          image: "08_Icons_BH_Beratung-20px-Fuer_Alles_Offen.svg",
          attributes: [],
          excludes: [],
        },
      ],
    },
    {
      id: "breastform",
      title: "",
      preText:
        "<p>Sieh Dir die folgenden Bilder an. Wir wissen, dass Deine Brustform einzigartig ist. Wir möchten mit Dir zusammen herausfinden, welche dieser Formen Deiner Brustform am ähnlichsten ist. Versuche Dich nicht auf die Größe der Brüste zu konzentrieren, sondern nutze die Beschreibung, um die wichtigsten Merkmale Deiner Brust zu bestimmen.</p>",
      text: "Welche dieser Beschreibungen entsprechen am ehesten Deiner Brustform?",
      aText: "Brustform",
      infoText:
        "Es können bis zu 2 aufeinanderfolgende Optionen ausgewählt werden",
      optionsType: "icon",
      before: ["size", "attributes"],
      next: "breasttissuetype",
      following: ["breasttissuetype", "size2"],
      options: [
        {
          title: "Sportlich",
          track: "athletic",
          image: "sys_breastshapes_athletic.svg",
          text: "Deine Brüste sind in der Regel breiter, sehen muskulöser aus und haben weniger Weichteilgewebe. Die Kontur um den unteren Teil der Brust ist eher breiter als tief.",
          attributes: [{ name: "athletisch", value: "Top Recommended" }],
          excludes: [],
          fullSize: true,
        },
        {
          title: "Tränenförmig",
          track: "tear_drop",
          image: "sys_breastshapes_teardrop.svg",
          text: 'Deine Brüste sind angehoben und rund. Die Unterseiten sind etwas breiter als die Oberseiten und das Seitenprofil hat eine sanfte "Tränenform".',
          attributes: [{ name: "traenenfoermig", value: "Top Recommended" }],
          excludes: [],
          fullSize: true,
        },
        {
          title: "Entspannt",
          track: "relaxed",
          image: "sys_breastshapes_relaxed.svg",
          text: "Deine Brüste sind schmaler und hängen mit weicherem Gewebe nach unten.",
          attributes: [{ name: "entspannt", value: "Top Recommended" }],
          excludes: [],
          fullSize: true,
        },
        {
          title: "Asymmetrisch",
          track: "asymmetric",
          image: "sys_breastshapes_asymmetric.svg",
          text: "Während es sehr oft vorkommt, dass Brüste leicht ungleichmäßig sind, haben Deine Brüste einen Unterschied von einer oder mehreren Körbchengrößen und sehen auffallend asymmetrisch aus.",
          attributes: [{ name: "asymmetrisch", value: "Top Recommended" }],
          excludes: [],
          fullSize: true,
        },
        {
          title: "Ost-West",
          track: "side_set",
          image: "sys_breastshapes_sideset.svg",
          text: "Deine Brüste haben einen größeren Abstand zueinander. Die Brustwarzen zeigen häufiger zu den Seiten und die Brust sitzt am Rand des Oberkörpers.",
          attributes: [{ name: "seitlich", value: "Top Recommended" }],
          excludes: [],
          fullSize: true,
        },
        {
          title: "Ich weiß es nicht.",
          track: "I-don-t-know",
          image: "08_Icons_BH_Beratung-20px-Fuer_Alles_Offen.svg",
          wildcard: true,
          attributes: [],
          excludes: [],
        },
      ],
    },
    {
      id: "breasttissuetype",
      title: "",
      preText:
        "Wähle bis zu 2 aufeinanderfolgende Optionen aus, z. B. Weich & Mittel",
      text: "Welche dieser Beschreibungen entsprechen am ehesten Deinem Brustgewebetyp?",
      aText: "Brustgewebetyp",
      optionsType: "icon",
      before: ["size", "attributes", "breastform"],
      next: "size2",
      following: ["size2"],
      options: [
        {
          title: "Weich",
          track: "soft",
          text: "Deine Brusthaut hat eine geringe Elastizität/ Straffheit. Dein Brustgewebe fühlt sich weich und nicht gestützt an. Schwangerschaft, Stillen und starke Gewichtsschwankungen können dazu beigetragen haben, dass Dein Gewebe im Laufe der Zeit gedehnt wurde. Es können auch Dehnungsstreifen vorhanden sein.",
          attributes: [{ name: "weich", value: "Top Recommended" }],
          excludes: [],
        },
        {
          title: "Mittel",
          track: "mid",
          text: "Deine Brusthaut hat eine mittlere Elastizität/ Straffheit und Dein Brustgewebe fühlt sich gut von der Haut gestützt an.",
          attributes: [{ name: "mittelfest", value: "Top Recommended" }],
          excludes: [],
        },
        {
          title: "Fest",
          track: "firm",
          text: "Deine Brusthaut und Dein Brustgewebe sind sehr fest. Die Brust trägt sich wie von selbst. Es ist eher unwahrscheinlich, dass Du eine große Gewichtsabnahme hinter Dir hast. Es ist auch eher selten, dass sich Dehnungsstreifen auf Deinen Brüsten befinden.",
          attributes: [{ name: "fest", value: "Top Recommended" }],
          excludes: [],
        },
        {
          title: "Ich weiß es nicht.",
          track: "I-don-t-know",
          image: "08_Icons_BH_Beratung-20px-Fuer_Alles_Offen.svg",
          wildcard: true,
          attributes: [],
          excludes: [],
        },
      ],
    },
    {
      id: "size2",
      title: "",
      preText:
        "<p>Wähle Deine BH-Größe aus, damit wir Dir passende Empfehlungen anzeigen können.</p>",
      text: "Deine SugarShape Größe: Perfekte Passform durch neues Größensystem.",
      optionsType: "size",
      before: ["size", "attributes", "breastform", "breasttissuetype"],
      next: null,
      following: [""],
      display: (size) => {
        return !size;
      },
      show: false,
      options: [],
      sizeStepText: (susType) => {
        if (susType)
          return [
            "1. Wähle Deinen Unterbrustumfang (in cm).",
            "2. Wähle Deine SugarShape Größe: Unterbrustumfang/Brustumfang in cm z.B. 80/100.",
          ];
        return ["1. Wähle Dein Unterbrustband ", "2. Wähle Deine BH-Größe"];
      },
      sizeInfoText: (toggleCalculator) => (
        <>
          Du willst einen <strong>perfekt sitzenden BH</strong>? Dann nutze
          unsere{" "}
          <button onClick={toggleCalculator} className="bh-finder__linkButton">
            Anleitung
          </button>{" "}
          und miss Dich aus, um Deine SugarShape-Größe in 2 Schritten zu
          ermitteln. Alternativ kannst Du auch Deine Standard-BH-Größe
          auswählen. Aber bitte beachte, dass BH-Größen verschiedener Hersteller
          unterschiedlich ausfallen können. Bei Fragen hilft Dir unser{" "}
          <a
            target="_blank"
            href="/persoenliche-Beratung/"
            className="underline"
          >
            Kundenservice
          </a>{" "}
          gerne weiter.
        </>
      ),
      sizeTypeButtonText: (isSusSizeType) =>
        isSusSizeType ? "Standardgröße wählen" : "SugarShape Größe wählen",
      sizeCalculatorText: (visible) =>
        visible ? "Größenrechner ausblenden" : "Zum Größenrechner",
    },
  ],
};

export default configDE;
