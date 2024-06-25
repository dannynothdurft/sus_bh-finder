import React, { useState, useEffect } from "react";
import conversionSize from "../helper/conversionSize";
import SizeCalculator from "./SizeCalculator";
import cloneDeep from "lodash/cloneDeep";

import { scroller } from "react-scroll";
import removeSecondSizeFromConfiguration from "../utils/removeSecondSizeFromConfiguration";
import removeSizeConfigurationIfEmpty from "../utils/removeSizeConfigurationIfEmpty";

function generateSizes(isSusSizeType, sizes) {
  let array = [];

  if (!sizes) {
    return [];
  }

  for (const [key] of Object.entries(sizes)) {
    let data = transformFormat(key, "js");

    if (!isSusSizeType) {
      data = conversionSize(data.replace(/,/g, "."));
    }

    let typeData = data.split("/");
    const newKey = typeData[0];
    const newValue = typeData[1];

    array[newKey] = array[newKey] ? [...array[newKey], newValue] : [newValue];
  }

  return array;
}

function transformFormat(data, toFormat = "makaira") {
  if (toFormat !== "makaira") {
    let ident = data.split(" | ");
    return `${ident[0]}/${ident[1]}`;
  }

  let ident = data.split("/");
  return `${ident[0]} | ${ident[1]}`;
}

function SizeSelector({
  question,
  startSizes,
  isSusSizeType,
  setIsSusSizeType,
  activeSizeConfig,
  setActiveSizeConfig,
  sizeConfigurations,
  setSizeConfigurations,
  lastSelectedBaseSize,
  lastSelectedSecondSize,
  setLastSelectedSecondSize,
  isAnswered,
}) {
  const [sizes, setSizes] = useState(generateSizes(isSusSizeType, startSizes));
  const [showInfo, setShowInfo] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  const scrollOptions = {
    duration: 400,
    isDynamic: true,
    smooth: true,
  };

  const activeBaseSize =
    sizeConfigurations.length && activeSizeConfig !== null
      ? sizeConfigurations[activeSizeConfig].baseSize
      : null;

  /**
   * depending on if the user wants the basic size oder Sugarshape size type we have to convert the selected size values into the format of the according size type
   * for example transform the basic size 85C to 90/105 and vice versa
   */
  useEffect(() => {
    setSizes(generateSizes(isSusSizeType, startSizes));

    const newSizeConfiguration = cloneDeep(sizeConfigurations);

    newSizeConfiguration.forEach((sizeConfiguration, index) => {
      const { baseSize, secondSizes } = sizeConfiguration;

      secondSizes.forEach((item, sizeIndex) => {
        const [base, secondSize] = conversionSize(
          `${baseSize}/${item.replace(/,/g, ".")}`,
          isSusSizeType
        ).split("/");

        const sizeConverter = isSusSizeType
          ? secondSize.replace(/\./g, ",")
          : secondSize;

        newSizeConfiguration[index].baseSize = base.toString();
        newSizeConfiguration[index].secondSizes[sizeIndex] =
          sizeConverter.toString();
      });

      setSizeConfigurations(newSizeConfiguration);
    });
  }, [isSusSizeType, setSizeConfigurations, startSizes, sizeConfigurations]);

  /**
   * set sizes depending on size type
   */
  useEffect(() => {
    setSizes(generateSizes(isSusSizeType, startSizes));
  }, [isSusSizeType, startSizes]);

  useEffect(() => {
    // setFilterSize()
  }, [lastSelectedBaseSize]);

  useEffect(() => {
    setFilterSize();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSelectedSecondSize]);

  /**
   * Add a new object in the sizeConfigurations array and set its baseSize based on the value of the currently selected size
   * @param baseSize
   * @param secondSize
   * @param newSizeConfiguration
   */
  const handleAddNewSizeConfig = (
    baseSize = "",
    secondSize = "",
    newSizeConfiguration
  ) => {
    newSizeConfiguration.push({
      filterSizes: [],
      baseSize: baseSize,
      secondSizes: secondSize ? [secondSize] : [],
    });

    setSizeConfigurations(newSizeConfiguration);
    setActiveSizeConfig(newSizeConfiguration.length - 1);

    if (secondSize) setLastSelectedSecondSize(secondSize);
  };

  /**
   * determine the size for the filter according to the selected size values (base and second size)
   * if we're not using the Sugarshape size type we have to get the according Sugarshape size values for base and second size
   */
  const setFilterSize = () => {
    const newSizeConfiguration = cloneDeep(sizeConfigurations);
    const currentSizeConfiguration = newSizeConfiguration[activeSizeConfig];

    if (!currentSizeConfiguration) return null;

    let baseSize = currentSizeConfiguration.baseSize;
    const secondSizes = currentSizeConfiguration.secondSizes;
    const oldFilterSizes = currentSizeConfiguration.filterSizes;

    if (!baseSize || !secondSizes.length) {
      newSizeConfiguration[activeSizeConfig].filterSizes = [];

      setSizeConfigurations(newSizeConfiguration);

      return;
    }

    const newFilterSizes = currentSizeConfiguration.filterSizes;

    /**
     * For each secondSize in the specific sizeConfiguration object we have to check if there is already a corresponding entry in the filterSizes array
     * If yes, then we update the value
     * If no, we have to create a new entry within the filterSizes array
     */
    secondSizes.forEach((secondSize, index) => {
      let filterBase = baseSize;
      let filterSecond = secondSize;

      if (!isSusSizeType) {
        [filterBase, filterSecond] = conversionSize(
          `${baseSize}/${secondSize.replace(/,/g, ".")}`,
          true
        ).split("/");
      }

      if (oldFilterSizes[index]) {
        newFilterSizes[index] = transformFormat(
          `${filterBase}/${filterSecond.replace(/\./g, ",")}`
        );
      } else {
        newFilterSizes.push(
          transformFormat(`${filterBase}/${filterSecond.replace(/\./g, ",")}`)
        );
      }
    });

    newSizeConfiguration[activeSizeConfig].filterSizes = newFilterSizes;

    setSizeConfigurations(newSizeConfiguration);
  };

  /**
   *
   * @param baseSize
   * @param secondSize
   */
  const updateSizeConfig = (baseSize = "", secondSize = "") => {
    // we cast the values to strings because it might happen that they are given as integers
    baseSize = baseSize.toString();
    secondSize = secondSize.toString();

    // if the new selected baseSize is already used by another sizeConfiguration, let's point on it and add the secondSize if it is not given yet
    if (
      sizeConfigurations.some(
        (configuration) => configuration.baseSize === baseSize
      )
    ) {
      let newSizeConfiguration = cloneDeep(sizeConfigurations);
      newSizeConfiguration = removeSizeConfigurationIfEmpty(
        newSizeConfiguration,
        activeSizeConfig
      );

      const configurationKey = parseInt(
        Object.keys(newSizeConfiguration).find(
          (key) => newSizeConfiguration[key].baseSize === baseSize
        )
      );

      let currentNewSizeConfiguration = cloneDeep(
        newSizeConfiguration[configurationKey]
      );

      if (
        !currentNewSizeConfiguration.secondSizes.some(
          (size) => size === secondSize
        )
      ) {
        currentNewSizeConfiguration.secondSizes.push(secondSize);
      }

      newSizeConfiguration[configurationKey] = currentNewSizeConfiguration;

      setSizeConfigurations(newSizeConfiguration);
      setActiveSizeConfig(configurationKey);
      setLastSelectedSecondSize(secondSize);
    }
    // if the new selected baseSize is not selected yet, we add a new configuration entry
    else {
      const newSizeConfiguration = cloneDeep(sizeConfigurations);
      handleAddNewSizeConfig(baseSize, secondSize, newSizeConfiguration);
    }
  };

  /**
   *
   * @param baseSize
   */
  const updateBaseSize = (baseSize = "") => {
    // we cast the values to strings because it might happen that they are given as integers
    baseSize = baseSize.toString();

    console.log(baseSize);

    // if the new selected baseSize is already selected, just mark it as selected and not active anymore
    if (baseSize === activeBaseSize) {
      setActiveSizeConfig(null);
    }
    // if the new selected baseSize is already used by another sizeConfiguration, let's point on it
    else if (
      sizeConfigurations.some(
        (configuration) => configuration.baseSize === baseSize
      )
    ) {
      let newSizeConfiguration = cloneDeep(sizeConfigurations);
      newSizeConfiguration = removeSizeConfigurationIfEmpty(
        newSizeConfiguration,
        activeSizeConfig
      );

      const configurationKey = parseInt(
        Object.keys(newSizeConfiguration).find(
          (key) => newSizeConfiguration[key].baseSize === baseSize
        )
      );

      setSizeConfigurations(newSizeConfiguration);
      setActiveSizeConfig(configurationKey);
    } else {
      let newSizeConfiguration = cloneDeep(sizeConfigurations);
      newSizeConfiguration = removeSizeConfigurationIfEmpty(
        newSizeConfiguration,
        activeSizeConfig
      );
      handleAddNewSizeConfig(baseSize, "", newSizeConfiguration);
    }
  };

  /**
   *
   * @param sizeValue
   */
  const updateSecondSize = (sizeValue) => {
    sizeValue = sizeValue.toString();

    const newSizeConfiguration = cloneDeep(sizeConfigurations);
    let currentNewSizeConfiguration = cloneDeep(
      newSizeConfiguration[activeSizeConfig]
    );

    // If the user clicks on an already selected value we want to remove it (including the corresponding filterSize value)
    if (
      currentNewSizeConfiguration.secondSizes.some(
        (secondSize) => secondSize === sizeValue
      )
    ) {
      currentNewSizeConfiguration = removeSecondSizeFromConfiguration(
        currentNewSizeConfiguration,
        sizeValue
      );
    } else {
      currentNewSizeConfiguration.secondSizes.push(sizeValue);
    }

    newSizeConfiguration[activeSizeConfig] = currentNewSizeConfiguration;

    setSizeConfigurations(newSizeConfiguration);
    setLastSelectedSecondSize(sizeValue);
  };

  /**
   *
   * @param a
   * @param b
   * @returns {number}
   */
  const sortAlphaNumeric = (a, b) => {
    if (a.indexOf(",") === -1) {
      a = a + "0";
    }
    if (b.indexOf(",") === -1) {
      b = b + "0";
    }

    const reA = /[^a-zA-Z]/g;
    const reN = /[^0-9]/g;
    const aA = a.replace(reA, "");
    const bA = b.replace(reA, "");

    if (aA === bA) {
      const aN = parseInt(a.replace(reN, ""), 10);
      const bN = parseInt(b.replace(reN, ""), 10);
      return aN === bN ? 0 : aN > bN ? 1 : -1;
    } else {
      return aA > bA ? 1 : -1;
    }
  };

  return (
    <>
      {showInfo && (
        <div className="bh-finder__sizeInfoTextWrapper">
          <button
            onClick={() => setShowInfo(false)}
            className="bh-finder__closeIcon"
          >
            <i className="fa fa-times-circle" />
          </button>
          <p className="bh-finder__sizeInfoText">
            {question.sizeInfoText(() => {
              setShowCalculator(true);
              scroller.scrollTo(`sizeCalculator-${question.id}`, scrollOptions);
            })}
          </p>
        </div>
      )}
      <div className={`${isAnswered ? "bh-finder__question--disabled" : ""}`}>
        <p>
          {question.sizeStepText(isSusSizeType)[0]}{" "}
          <i
            className="fa fa-info-circle"
            onClick={() => setShowInfo(!showInfo)}
          />
        </p>
        <ul className="bh-finder__sizeOptionList">
          {sizes?.map((item, sizeValue) => {
            // we cast the value to string to ensure the strict equality (===) operation works
            sizeValue = sizeValue.toString();

            const isSelected = sizeConfigurations.some((configuration) => {
              return configuration.baseSize === sizeValue;
            });

            const isActive = sizeConfigurations.some((size, index) => {
              return size.baseSize === sizeValue && index === activeSizeConfig;
            });

            const classes = `bh-finder__sizeOption ${
              isSelected ? " bh-finder__sizeOption--selected" : ""
            } ${isActive ? " bh-finder__sizeOption--active" : ""}`;

            return (
              <li
                key={sizeValue}
                className={classes}
                onClick={() => updateBaseSize(sizeValue)}
                type={isSusSizeType ? "SUS_SIZE" : "STD_SIZE"}
                bhf-ga4-tid="size"
                bhf-ga4-tse={sizeValue}
              >
                {sizeValue}
              </li>
            );
          })}
        </ul>
        {activeBaseSize && (
          <>
            <p>
              {question.sizeStepText(isSusSizeType)[1]}{" "}
              <i
                className="fa fa-info-circle"
                onClick={() => setShowInfo(!showInfo)}
              />
            </p>
            <ul className="bh-finder__sizeOptionList">
              {sizes[activeBaseSize]
                .sort((a, b) => sortAlphaNumeric(a, b))
                .map((item, index) => {
                  const isSelected = sizeConfigurations.some(
                    (configuration) => {
                      return (
                        configuration.baseSize === activeBaseSize &&
                        configuration.secondSizes.some(
                          (secondSize) => secondSize === item
                        )
                      );
                    }
                  );

                  const isActive = sizeConfigurations.some((size, index) => {
                    return (
                      size.secondSizes.some(
                        (secondSize) => secondSize === item
                      ) && index === activeSizeConfig
                    );
                  });

                  const classes = `bh-finder__sizeOption ${
                    isSelected ? " bh-finder__sizeOption--selected" : ""
                  } ${isActive ? " bh-finder__sizeOption--active" : ""} ${
                    isSelected && !isActive
                      ? " bh-finder__sizeOption--disabled"
                      : ""
                  }`;

                  return (
                    <li
                      key={`${activeBaseSize}-${item}`}
                      onClick={() => updateSecondSize(item)}
                      className={classes}
                      type={isSusSizeType ? "SUS_SIZE" : "STD_SIZE"}
                      bhf-ga4-tid="size"
                      bhf-ga4-tse={`${activeBaseSize}/${item}`}
                    >
                      {isSusSizeType
                        ? `${activeBaseSize} | ${item}`
                        : `${activeBaseSize}${item}`}
                    </li>
                  );
                })}
            </ul>
          </>
        )}
        <button
          className="bh-finder__sizeLink"
          bhf-ga4-tid="size_change"
          type={
            question.sizeTypeButtonText(isSusSizeType) !==
            "Standardgröße wählen"
              ? "sus_size to std_size"
              : "std_size to sus_size"
          }
          onClick={() => setIsSusSizeType(!isSusSizeType)}
        >
          {question.sizeTypeButtonText(isSusSizeType)}
        </button>
        <div id={`sizeCalculator-${question.id}`}>
          <p className="bh-finder__sizeLinkText">
            Du kennst Deine Größe noch nicht?&nbsp;
          </p>
          <button
            className="bh-finder__sizeLink bh-finder__sizeLink--bold"
            bhf-ga4-tid="size_calculator"
            type={
              question.sizeCalculatorText(showCalculator) !==
              "Zum Größenrechner"
                ? "open"
                : "close"
            }
            onClick={() => setShowCalculator(!showCalculator)}
          >
            {question.sizeCalculatorText(showCalculator)}
          </button>
        </div>
        <SizeCalculator
          show={showCalculator}
          setSize={(baseSize, secondSize) => {
            setIsSusSizeType(true);
            updateSizeConfig(baseSize, secondSize);
          }}
        />
      </div>
    </>
  );
}

export default SizeSelector;
