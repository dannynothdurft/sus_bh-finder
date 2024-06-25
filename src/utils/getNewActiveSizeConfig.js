/**
 *
 * @param oldSizeConfiguration
 * @param newSizeConfiguration
 * @returns {null|number}
 */
export default function getNewActiveSizeConfig(oldSizeConfiguration = [], newSizeConfiguration = []) {
  if (newSizeConfiguration.length && oldSizeConfiguration.length >= newSizeConfiguration.length) {
    return newSizeConfiguration.length - 1
  }

  return null
}