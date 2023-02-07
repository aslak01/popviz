import type { State, Country, List, Render, Dispatcher } from './types';
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
import chart from './io/chart';

const INPUTWRAPPEREL = 'selection-wrapper';
const INPUTEL = 'selection';
const BTNWRAPPEREL = 'button-wrapper';
const BTNEL = 'select-btn';
const OUTPUTEL = 'charts';
const LISTURL = 'https://api.worldbank.org/v2/country?format=json&region=EUU';

const countries = deserialise.listData(await io.fetchList(LISTURL));

async function app(state: State, options: List, fetchedData: List, dispatch: Dispatcher) {
  const outputEl = io.getElem(OUTPUTEL);
  const inputWrapper = io.getElem(INPUTWRAPPEREL)
  const btn = io.getElem(BTNEL) as HTMLInputElement

  options?.length === 0 ? io.attr('disabled', 'disabled')(btn) : btn!.disabled = false;

  compose(
    io.append(optionsView(options)), io.clear()
  )(inputWrapper);

  const render = fetchedData.filter(c => state.includes(c.id))

  compose(
    io.append(view(render)), io.clear()
  )(outputEl);


  document.scrollingElement
    ? document.scrollingElement.scrollTo(
      0,
      outputEl!.scrollHeight
    )
    : null;

  const stop = dispatch(async (_e: Event) => {
    stop();

    const selectedCountryId = io.getInputValue(INPUTEL);
    const newState = uniq([...state, selectedCountryId])
    const newCountry = await serialise.addCountry(selectedCountryId, options);

    const newData = uniq([...fetchedData, newCountry]);

    const selectableCountries = difference(
      pluck('id', options),
      newState
    );

    const newOptions = filter((x: Country) => includes(x.id, selectableCountries))(
      options
    );

    console.log('newstate, newlist', newState, newOptions, newData)

    app(newState, newOptions, newData, dispatch);
  });
}

function view(state: Render) {
  // state.map(chart)
  const el = compose(io.attr('class', 'hei'))(io.elem('div'))
  state.map(chart).forEach(io.add(el));
  return el;
}

function optionsView(list: List) {
  const el = compose(io.attr('id', 'selection'))(io.elem('select'))
  // list.map(options).forEach(io.add(el))
  return list.length > 0
    ? pipe(
      // @ts-expect-error: spreading params
      ...list.map((c: Country) => io.append(options(c)))
    )(el)
    : el;
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

app(Object.freeze([]), countries, Object.freeze([]), buttonClick);

export default app;
