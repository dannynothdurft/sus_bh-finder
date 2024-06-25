import printDebug from './printDebug'
import getCurrentURL from './getCurrentURL'
import ConfigDE from '../configDE'
import ConfigCH from '../configCH'

const Config = getCurrentURL() ? ConfigCH : ConfigDE

export default class HttpClient {
  constructor(instance) {
    this.host = Config.makaira.host
    this.path = '/search/public'
    this.instance = instance
  }

  normalizeSortingValue = sorting => {
    if (!sorting) return null

    const fieldsMapping = {
      oxvarminprice: 'price',
      oxtitle: 'title',
      smx_isnew: 'new',
      smx_sale: 'sale',
    }

    let normalizedSorting = {}

    const sortingEntries = Object.entries(sorting)[0]

    if (!fieldsMapping.hasOwnProperty(sortingEntries[0])) {
      return sorting
    }

    normalizedSorting[fieldsMapping[sortingEntries[0]]] = sortingEntries[1]

    return normalizedSorting
  }

  post = (body, name) =>
    new Promise(async resolve => resolve(await this.fetch('POST', body, name)))

  fetch = async (method, body, name) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-Makaira-Instance': this.instance,
    }

    const fetchBody = { ...body }

    fetchBody.sorting = this.normalizeSortingValue(fetchBody.sorting)

    const response = await fetch(this.host + this.path, {
      method,
      headers,
      body: JSON.stringify(fetchBody),
    })

    const json = await response.json()

    printDebug(
      name,
      { ...body.aggregations, ...body.customFilter },
      json?.product?.total
    )

    return json
  }
}
