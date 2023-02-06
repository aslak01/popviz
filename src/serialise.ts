import { find, propEq } from 'rambda';
import type { List, FetchedCountry, Country } from './types';
import * as io from './io';
import * as deserialise from './deserialise';

const addCountry = async (id: string, list: List): Promise<FetchedCountry> => {
  const selectCountry = (id: string, list: List): Country => {
    const c = find(propEq('id', id))(list);
    // TODO
    // doesn't properly handle problems with fetch:
    return c as Country;
  };
  const selectedCountry = selectCountry(id, list);
  const countryData = deserialise.popData(await io.fetchCountry(id));
  return {
    ...selectedCountry,
    data: countryData,
  };
};

export { addCountry };
