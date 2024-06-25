import React from "react";
import cloneDeep from "lodash/cloneDeep";
import removeSecondSizeFromConfiguration from "../utils/removeSecondSizeFromConfiguration";
import removeSizeConfigurationIfEmpty from "../utils/removeSizeConfigurationIfEmpty";
import getNewActiveSizeConfig from "../utils/getNewActiveSizeConfig";

export default function SizeReview({
  setLastSelectedSecondSize = () => {},
  isSusSizeType = false,
  setSizeConfigurations,
  sizeConfigurations,
  hasSelectedSizes,
  setActiveSizeConfig,
}) {
  if (!hasSelectedSizes) return null;

  /**
   * Remove the selected secondSize from it's corresponding configuration object
   * If it was the last entry of the selected secondSizes, remove the configuration object
   * @param configurationIndex
   * @param sizeValue
   */
  const resetSizeConfig = (configurationIndex, sizeValue) => {
    const oldSizeConfiguration = cloneDeep(sizeConfigurations);
    let newSizeConfiguration = cloneDeep(sizeConfigurations);
    let currentNewSizeConfiguration = cloneDeep(
      newSizeConfiguration[configurationIndex]
    );

    currentNewSizeConfiguration = removeSecondSizeFromConfiguration(
      currentNewSizeConfiguration,
      sizeValue
    );

    newSizeConfiguration[configurationIndex] = currentNewSizeConfiguration;

    newSizeConfiguration = removeSizeConfigurationIfEmpty(
      newSizeConfiguration,
      configurationIndex
    );

    setActiveSizeConfig(
      getNewActiveSizeConfig(oldSizeConfiguration, newSizeConfiguration)
    );
    setSizeConfigurations(newSizeConfiguration);
    setLastSelectedSecondSize(sizeValue);
  };

  return (
    <div className="bh-finder__selectionWrapper bh-finder__selectionWrapper--size">
      <p className="bh-finder__selectionText">
        {isSusSizeType ? `SugarShape Größe:` : `Standardgröße:`}
      </p>
      <ul className="bh-finder__selection">
        {sizeConfigurations.map((configuration, configurationIndex) => {
          const { baseSize, secondSizes } = configuration;

          return secondSizes.map((size) => {
            return (
              <span key={`${baseSize}-${size}`}>
                <li
                  onClick={() => {
                    resetSizeConfig(configurationIndex, size);
                  }}
                  className="bh-finder__option bh-finder__option--small"
                >
                  <i className="fa fa-times" />{" "}
                  {isSusSizeType ? `${baseSize}/${size}` : `${baseSize}${size}`}
                </li>
              </span>
            );
          });
        })}
      </ul>
    </div>
  );
}
