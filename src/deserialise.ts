import { curry, reduce, assoc, keys, pick } from 'rambda'

import type { InputListDataEntry, InputCountryData, PopData } from './types'

const listData = (listData: InputListDataEntry[]) => {
  const renameKeys = curry((keysMap, obj) =>
    reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj))
  );
  const pickData = (entry: InputListDataEntry) => pick('id,name', entry)
  return listData.map(pickData).map(renameKeys({name: 'value'}))
}

const popData = (popData: InputCountryData[]): PopData[] => {
  const pickData = (entry: InputCountryData) => pick('date,value', entry)
  return popData.map(pickData) as PopData[]
}

export {
  listData,
  popData
}
