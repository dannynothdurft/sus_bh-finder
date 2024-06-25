import getCountOfOption from "./getCountOfOption";

export default function addCountsToOptions(options = {}, aggregations = {}) {

  if (Object.keys(aggregations).length === 0)
      return options

    const optionCount = options.map(option => {
      return (getCountOfOption(option, aggregations))
    })

    return options.map((el, index) => {
      return {
        ...el,
        count: optionCount[index]
      }
    })
}