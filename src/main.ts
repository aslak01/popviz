import type { State, Country, List, Dispatcher } from './types';
import {
  pipe,
  compose,
  flip,
  uniq,
  pluck,
  difference,
  filter,
  includes,
} from 'rambda';
import * as io from './io';
import * as deserialise from './deserialise';
import * as serialise from './serialise';
import chart from './chart';

const INPUTWRAPPEREL = 'selection-wrapper';
const INPUTEL = 'selection';
const BTNWRAPPEREL = 'button-wrapper';
const BTNEL = 'select-btn';
const OUTPUTEL = 'charts';
const LISTURL = 'https://api.worldbank.org/v2/country?format=json&region=EUU';

const countries = deserialise.listData(await io.fetchList(LISTURL));

async function app(state: State, list: List, dispatch: Dispatcher) {
  const outputEl = io.getElem(OUTPUTEL);

  document.scrollingElement
    ? document.scrollingElement.scrollTo(
        0,
        outputEl ? outputEl.scrollHeight : 0
      )
    : null;

  compose(io.append(optionsView(list)), io.clear())(io.getElem(INPUTWRAPPEREL));

  compose(io.append(view(state)), io.clear())(outputEl);

  const stop = dispatch(async (_e: Event) => {
    stop();

    const selectedCountryId = io.getInputValue(INPUTEL);

    const newCountry = await serialise.addCountry(selectedCountryId, list);

    const newState = uniq([...state, newCountry]);

    const selectableCountries = difference(
      pluck('id', list),
      pluck('id', newState)
    );

    const newList = filter((x: Country) => includes(x.id, selectableCountries))(
      list
    );

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

const button = compose(
  io.attr('id', BTNEL),
  io.append(io.text('Select country'))
)(io.elem('button'));
compose(io.append(button))(io.getElem(BTNWRAPPEREL));
const buttonClick = io.on('click', io.getElem(BTNEL));

app(Object.freeze([]), countries, buttonClick);

export default app;
