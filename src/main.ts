import type { State, Country, List, Dispatcher, FetchedCountry } from './types';
import {
  pipe,
  compose,
  find,
  flip,
  propEq,
  uniq,
  pluck,
  difference,
  filter,
  includes,
} from 'rambda';
import * as io from './io';
import * as deserialise from './deserialise';
import { chart } from './chart';

const INPUTWRAPPEREL = 'selection-wrapper';
const INPUTEL = 'selection';
const BTNEL = 'search-btn';
const OUTPUTEL = 'charts';
const LISTURL = 'https://api.worldbank.org/v2/country?format=json&region=EUU';

const countries = deserialise.listData(await io.fetchList(LISTURL));

async function app(state: State, list: List, dispatch: Dispatcher) {
  compose(io.append(optionsView(list)), io.clear())(io.getElem(INPUTWRAPPEREL));

  compose(io.append(view(state)), io.clear())(io.getElem(OUTPUTEL));

  const stop = dispatch(async (_e: Event) => {
    stop();

    const selectedCountryId = io.getInputValue(INPUTEL);
    const selectedCountry = find(propEq('id', selectedCountryId))(list);
    const countryData = deserialise.popData(
      await io.fetchCountry(selectedCountryId)
    );
    const newCountry = {
      ...selectedCountry,
      data: countryData,
    } as FetchedCountry;

    const newState = uniq([...state, newCountry]);

    const remainingCountries = difference(
      pluck('id', list),
      pluck('id', newState)
    );

    const filterByCountry = filter((x: Country) =>
      includes(x.id, remainingCountries)
    );

    const newList = filterByCountry(list);

    app(newState, newList, dispatch);
  });
}

function view(state: State) {
  const el = io.elem('div');
  const add = flip(io.append)(el);
  state.map(chart).forEach(add);
  return el;
}

function optionsView(list: List) {
  return list.length > 0
    ? pipe(
        // @ts-expect-error: spreading params
        ...list.map((c: Country) => io.append(options(c)))
      )(io.attr('id', 'selection')(io.elem('select')))
    : null;
}

function options(country: Country) {
  return compose(
    io.append(io.text(country.value)),
    io.attr('value', country.id)
  )(io.elem('option'));
}

const buttonClick = io.on('click', io.getElem(BTNEL));

app(Object.freeze([]), countries, buttonClick);

export default app;
