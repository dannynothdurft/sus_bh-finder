import getCountOfOption from "./getCountOfOption";

export default function sortQuestionFilters(question = {}, aggregations ={}) {
  //not all questions should be ordered
  const isQuestionSortable = ['attributes', 'material', 'color'].includes(question.id)

// sorts the options of the question in descending order of the number of results.
// The number must be fetched from the aggregations
  const sortQuestions = (options) => {
    if (Object.keys(aggregations).length === 0)
      return options

    const optionCount = options.map(option => {
      return (getCountOfOption(option, aggregations))
    })

    const optionWithCount = options.map((el, index) => {
      return {
        ...el,
        count: optionCount[index]
      }
    })

    // sort with counts
    return optionWithCount.sort((a, b) => {
      return b.count - a.count
    })
  }

 return isQuestionSortable ? sortQuestions(question.options) : question.options

}