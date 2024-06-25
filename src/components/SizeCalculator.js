import React, { useState } from "react";

const SizeInput = ({ value = "", placeholder = "", onChange }) => (
  <input
    className="bh-finder__sizeCalculatorInput"
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
  <div className="bh-finder__sizeCalculatorTip">
    <img src={image} className="bh-finder__sizeCalculatorImage" alt={title} />
    <span className="bh-finder__sizeCalculatorTipText">
      <p className="bh-finder__sizeCalculatorTipTitle">{title}</p>
      <ul className="list-unstyled">
        {list.map((item, index) => (
          <li key={index} className="bh-finder__sizeCalculatorItem">
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

    fetch("/?cl=sb_calc_size&fnc=calcSize", {
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
      <div className="bh-finder__sizeCalculator">
        <div className="bh-finder__sizeCalculatorForm">
          <p className="bh-finder__sizeCalculatorFormTitle">Deine Maße</p>
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
            <button type="submit" className="submitButton btn btn-primary">
              {result.success ? "NEU" : "JETZT"} BERECHNEN
            </button>
          </form>
          {resultText && (
            <div className="bh-finder__sizeCalculatorResult">{resultText}</div>
          )}

          {result.success && (
            <button
              type="button"
              className="submitButton btn btn-primary"
              onClick={() => setSize(result.ubu, result.bu)}
            >
              GRÖßE WÄHLEN
            </button>
          )}

          <a className="bh-finder__tapeMeasure" href="/shop/Massband.html">
            <img
              className="bh-finder__button_icon"
              src="/out/sugarshape/img/massband.png"
              alt="SugarShape Massband"
            />
            <div>
              <span className="bh-finder__question_text">Kein Maßband?</span>
              <u className="bh-finder__action_text">Jetzt Bestellen!</u>
            </div>
          </a>
        </div>

        <div className="bh-finder__sizeCalculatorInfo">
          <SizeTip
            image="/out/sugarshape/img/1_Unterbrustumfang.png"
            title="Unterbrustumfang:"
            list={[
              `Maßband waagerecht unter den Brustansatz legen`,
              `Ausatmen und Maßband zuziehen`,
              "Aufrechte Haltung, Blick nach vorne",
              "Bei gerader Körperhaltung Zentimeter ablesen",
            ]}
          />
          <SizeTip
            image="/out/sugarshape/img/2_brustumfang.png"
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
