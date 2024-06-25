/**
 * If the checked configuration has no selected secondSizes, remove the entry from the configuration
 * @param configurations
 * @param activeSizeConfig
 * @returns {*}
 */
export default function removeSizeConfigurationIfEmpty(configurations = [], activeSizeConfig = 0) {
  if (activeSizeConfig !== null && !configurations[activeSizeConfig].secondSizes.length) {
    configurations = configurations.filter((configuration, index) => index !== activeSizeConfig)
  }

  return configurations
}