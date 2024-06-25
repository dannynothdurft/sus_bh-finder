export default function getCountOfOption(option, aggregations){

  const count = option.attributes.map(attr=>{
    return aggregations[attr.name]?.values[attr.value]?.count || 0
  }).reduce((acc,curr)=>acc+curr,0)

  return count
}