export default function removeSecondSizeFromConfiguration(
  configuration = {},
  sizeValue = ''
) {
  const secondSizes = configuration.secondSizes
  const sizeValueKey = parseInt(
    Object.keys(secondSizes).find(key => secondSizes[key] === sizeValue)
  )

  configuration.secondSizes = secondSizes.filter(
    secondSize => secondSize !== sizeValue
  )
  configuration.filterSizes = configuration.filterSizes.filter(
    (filterSize, index) => index !== sizeValueKey
  )

  return configuration
}
