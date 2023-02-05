import { curry, reduce, assoc, keys, pick } from 'rambda';

import type { InputListDataEntry, InputCountryData, Country, PopDataRaw, PopData } from './types';

const listData = (listData: InputListDataEntry[]): Country[] => {
  const renameKeys = curry((keysMap, obj) =>
    reduce(
      (acc, key) => assoc(keysMap[key] || key, obj[key], acc),
      {},
      keys(obj)
    )
  );
  const pickData = (entry: InputListDataEntry) => pick('id,name', entry);
  return listData.map(pickData).map(renameKeys({ name: 'value' }));
};

const popData = (popData: InputCountryData[]): PopData[] => {
  const pickData = (entry: InputCountryData): PopDataRaw => pick('date,value', entry);
  // don't deal with string dates since they are just years
  const dateToNr = (entry: PopDataRaw): PopData => {
    return {
      date: Number(entry.date),
      value: entry.value
    }
  }
  const data = popData.map(pickData).map(dateToNr)
  return data
};

export { listData, popData };
