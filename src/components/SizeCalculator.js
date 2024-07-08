import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const SizeInput = ({ value = "", placeholder = "", onChange }) => (
  <input
    className="block w-full bg-white border border-gray-300 py-2 px-4 my-2"
    type="number"
    min="50"
    max="200"
    step="0.1"
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

const SizeTip = ({ image = "", title = "", list = [] }) => (
  <div className="flex flex-col items-center mt-6 md:mt-0 md:flex-row md:items-start md:ml-12">
    <img src={image} className="max-w-250" alt={title} />
    <span className="w-full md:w-auto md:ml-4">
      <p className="font-bold text-center md:text-left">{title}</p>
      <ul className="list-none">
        {list.map((item, index) => (
          <li key={index} className="pl-5 text-left mb-2">
            <FontAwesomeIcon
              icon={faCheck}
              className="inline-block align-middle mr-2"
            />
            {item}
          </li>
        ))}
      </ul>
    </span>
  </div>
);

function SizeCalculator({ show, setSize }) {
  const [baseSize, setBaseSize] = useState("");
  const [secondSize, setSecondSize] = useState("");
  const [resultText, setResultText] = useState("");
  const [result, setResult] = useState({ success: false });

  const setInvalidResult = () => {
    setResult({ success: false });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    console.log(baseSize);
    console.log(secondSize);

    if (!baseSize || !secondSize) {
      setResultText("Bitte fülle beide Felder aus.");
      setInvalidResult();
      return;
    }

    const sizetable = {
      bra: {
        "65/72,5": "60AA",
        "65/75": "60A",
        "65/77,5": "60B",
        "65/80": "60C",
        "65/82,5": "60D",
        "65/85": "60E",
        "65/87,5": "60F",
        "65/90": "60G",
        "65/92,5": "60H",
        "65/95": "60I",
        "65/97,5": "60J",
        "70/77,5": "65AA",
        "70/80": "65A",
        "70/82,5": "65B",
        "70/85": "65C",
        "70/87,5": "65D",
        "70/90": "65E",
        "70/92,5": "65F",
        "70/95": "65G",
        "70/97,5": "65H",
        "70/100": "65I",
        "70/102,5": "65J",
        "70/105": "65K",
        "75/82,5": "70AA",
        "75/85": "70A",
        "75/87,5": "70B",
        "75/90": "70C",
        "75/92,5": "70D",
        "75/95": "70E",
        "75/97,5": "70F",
        "75/100": "70G",
        "75/102,5": "70H",
        "75/105": "70I",
        "75/107,5": "70J",
        "75/110": "70K",
        "80/87,5": "75AA",
        "80/90": "75A",
        "80/92,5": "75B",
        "80/95": "75C",
        "80/97,5": "75D",
        "80/100": "75E",
        "80/102,5": "75F",
        "80/105": "75G",
        "80/107,5": "75H",
        "80/110": "75I",
        "80/112,5": "75J",
        "80/115": "75K",
        "85/92,5": "80AA",
        "85/95": "80A",
        "85/97,5": "80B",
        "85/100": "80C",
        "85/102,5": "80D",
        "85/105": "80E",
        "85/107,5": "80F",
        "85/110": "80G",
        "85/112,5": "80H",
        "85/115": "80I",
        "85/117,5": "80J",
        "85/120": "80K",
        "90/97,5": "85AA",
        "90/100": "85A",
        "90/102,5": "85B",
        "90/105": "85C",
        "90/107,5": "85D",
        "90/110": "85E",
        "90/112,5": "85F",
        "90/115": "85G",
        "90/117,5": "85H",
        "90/120": "85I",
        "90/122,5": "85J",
        "95/102,5": "90AA",
        "95/105": "90A",
        "95/107,5": "90B",
        "95/110": "90C",
        "95/112,5": "90D",
        "95/115": "90E",
        "95/117,5": "90F",
        "95/120": "90G",
        "95/122,5": "90H",
        "95/125": "90I",
        "95/127,5": "90J",
        "100/107,5": "95AA",
        "100/110": "95A",
        "100/112,5": "95B",
        "100/115": "95C",
        "100/117,5": "95D",
        "100/120": "95E",
        "100/122,5": "95F",
        "100/125": "95G",
        "100/127,5": "95H",
        "100/130": "95I",
        "100/132,5": "95J",
        "105/112,5": "100AA",
        "105/115": "100A",
        "105/117,5": "100B",
        "105/120": "100C",
        "105/122,5": "100D",
        "105/125": "100E",
        "105/127,5": "100F",
        "105/130": "100G",
        "105/132,5": "100H",
        "105/135": "100I",
        "105/137,5": "100J",
        "110/117,5": "105AA",
        "110/120": "105A",
        "110/122,5": "105B",
        "110/125": "105C",
        "110/127,5": "105D",
        "110/130": "105E",
        "110/132,5": "105F",
        "110/135": "105G",
        "110/137,5": "105H",
        "110/140": "105I",
        "110/142,5": "105J",
        "115/122,5": "110AA",
        "115/125": "110A",
        "115/127,5": "110B",
        "115/130": "110C",
        "115/132,5": "110D",
        "115/135": "110E",
        "115/137,5": "110F",
        "115/140": "110G",
        "115/142,5": "110H",
        "115/145": "110I",
        "115/147,5": "110J",
      },
      panty: {
        85: "32",
        90: "34",
        95: "36",
        100: "36-38",
        105: "38-40",
        110: "40-42",
        115: "44-46",
        120: "48-50",
        125: "52-54",
        130: "56",
        135: "58",
      },
    };

    const size = sizetable.bra;

    const bandInput = baseSize;
    const cupInput = secondSize;

    const band = bandInput.replace(/[^0-9,.]/g, "");
    const cup = cupInput.replace(/[^0-9,.]/g, "");

    const reBand = band.replace(",", ".");
    const reCup = cup.replace(",", ".");

    const paBand = parseFloat(reBand);
    const paCup = parseFloat(reCup);

    if (!(paBand >= 50 && paBand <= 199)) {
      return setResultText(
        "Unterbrustumfang: Bitte gib einen Wert zwischen 50 und 199 ein."
      );
    }

    if (!(paCup >= 60 && paCup <= 199)) {
      return setResultText(
        "Brustumfang: Bitte gib einen Wert zwischen 60 und 199 ein."
      );
    }

    if (paBand >= paCup) {
      return setResultText(
        "Der Brustumfang muss größer als der Unterbrustumfang sein."
      );
    }

    if (paCup - paBand < 10) {
      return setResultText(
        "Der Brustumfang muss mindestens 10cm größer als der Unterbrustumfang sein!"
      );
    }

    var dRoundedBand = Math.round(paBand / 5) * 5;
    var dRoundedCup = Math.round(paCup / 2.5) * 2.5;

    var kPaCup = dRoundedCup.toString().replace(".", ",");

    var sizeCheck = `${paBand}/${kPaCup}`;
    var sizeValide = false;

    for (const key in size) {
      if (key === sizeCheck) {
        sizeValide = true;
        break;
      }
    }

    if (sizeValide) {
      return setResultText(`Deine BH-Größe ist ${dRoundedBand}/${kPaCup}`);
    } else {
      return setResultText(
        `Deine BH-Größe ${dRoundedBand}/${kPaCup} ist nicht dabei`
      );
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col mt-5 md:flex-row">
        <div className="w-full md:w-1/3">
          <p className="font-bold my-2">Deine Maße</p>
          <form onSubmit={onSubmit}>
            <SizeInput
              value={baseSize}
              placeholder="Unterbrustumfang (cm)"
              onChange={setBaseSize}
            />
            <SizeInput
              value={secondSize}
              placeholder="Brustumfang (cm)"
              onChange={setSecondSize}
            />
            <button
              type="submit"
              className="py-2 px-4 rounded shadow bg-[#333] border-[#333] hover:bg-[#999] text-white font-semibold border hover:border-[#999]"
            >
              {result.success ? "NEU" : "JETZT"} BERECHNEN
            </button>
          </form>
          {resultText && (
            <div className="font-bold my-4 md:my-2">{resultText}</div>
          )}

          {result.success && (
            <button
              type="button"
              className="py-2 px-4 rounded shadow bg-[#333] border-[#333] hover:bg-[#999] text-white font-semibold border hover:border-[#999]"
              onClick={() => setSize(result.ubu, result.bu)}
            >
              GRÖßE WÄHLEN
            </button>
          )}

          <a
            className="bg-[#efdadd] flex items-center w-full mt-4"
            href="https://stage-sugarshape.myshopify.com/products/massband"
          >
            <img
              src="/cdn/shop/t/19/assets/massband.png"
              alt="SugarShape Massband"
            />
            <div>
              <span>Kein Maßband?</span>
              <u>Jetzt Bestellen!</u>
            </div>
          </a>
        </div>

        <div>
          <SizeTip
            image="/cdn/shop/t/19/assets/1_Unterbrustumfang.png"
            title="Unterbrustumfang:"
            list={[
              `Maßband waagerecht unter den Brustansatz legen`,
              `Ausatmen und Maßband zuziehen`,
              "Aufrechte Haltung, Blick nach vorne",
              "Bei gerader Körperhaltung Zentimeter ablesen",
            ]}
          />
          <SizeTip
            image="/cdn/shop/t/19/assets/2_brustumfang.png"
            title="Brustumfang:"
            list={[
              "Trage einen BH ohne Push-Up",
              `Maßband locker und waagerecht um die breiteste Stelle legen`,
              "Aufrechte Haltung, Blick nach vorne",
              "Bei gerader Körperhaltung Zentimeter ablesen",
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default SizeCalculator;
