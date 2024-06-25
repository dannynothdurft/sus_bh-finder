const colorMapping = {
  '1. Result': 'green',
  '2. AdditionalResults': 'orange',
  '3. OtherResults': 'blue',
}

export default function printDebug(name, filter, total, color) {
  const urlParams = new URLSearchParams(window.location.search)
  const debug = urlParams.get('debug')

  if (debug) {
    console.log(
      `%cType:${name} Results: ${total} Filter:${JSON.stringify(
        filter,
        undefined,
        2
      )}`,
      `color:${colorMapping[name]}`
    )
  }
}
