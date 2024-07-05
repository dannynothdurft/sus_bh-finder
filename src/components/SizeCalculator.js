import React, { useState } from "react";

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
            <span class="text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 inline-block align-middle mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18.293 3.293a1 1 0 00-1.414-1.414l-10 10a1 1 0 00-.21.324l-4 8a1 1 0 001.635 1.1l3.658-5.657L16.95 5.95a1 1 0 001.1-1.636z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
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

    if (!baseSize || !secondSize) {
      setResultText("Bitte fülle beide Felder aus.");
      setInvalidResult();
      return;
    }

    const isFloat = new RegExp("[+-]?([0-9]*[.])?[0-9]+");
    if (!isFloat.test(baseSize) || !isFloat.test(secondSize)) {
      setResultText(`Bitte fülle beide Felder mit Maßen in CM aus`);
      setInvalidResult();
      return;
    }

    let formData = new FormData();
    formData.append("ubu", baseSize);
    formData.append("bu", secondSize);

    fetch("https://sugarshape.de/?cl=sb_calc_size&fnc=calcSize", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.success) {
          setResultText(`LEIDER IST DEINE GRÖßE NICHT DABEI.`);
          setResult(json);
        } else {
          setResultText(`DEINE GRÖßE IST: ${json.ubu}/${json.bu}`);
          setResult(json);
        }
      })
      .catch((error) => {
        setResultText("Bei deiner Abfrage gab es einen Fehler");
        setInvalidResult();
      });

    return;
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
            href="/shop/Massband.html"
          >
            <img src="/img/massband.png" alt="SugarShape Massband" />
            <div>
              <span>Kein Maßband?</span>
              <u>Jetzt Bestellen!</u>
            </div>
          </a>
        </div>

        <div>
          <SizeTip
            image="/img/1_Unterbrustumfang.png"
            title="Unterbrustumfang:"
            list={[
              `Maßband waagerecht unter den Brustansatz legen`,
              `Ausatmen und Maßband zuziehen`,
              "Aufrechte Haltung, Blick nach vorne",
              "Bei gerader Körperhaltung Zentimeter ablesen",
            ]}
          />
          <SizeTip
            image="/img/2_brustumfang.png"
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
