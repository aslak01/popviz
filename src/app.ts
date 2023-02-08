import type {
  State,
  Country,
  List,
  FetchedCountry,
  FetchedCountries,
  Dispatcher,
} from './types';
import { isCustomEvent } from './types';
import { compose, uniq, pluck, difference, filter, includes } from 'rambda';
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

async function app(
  state: State,
  options: List,
  fetchedData: FetchedCountries,
  select: Dispatcher,
  deselect: Dispatcher
) {
  const outputEl = io.getElem(OUTPUTEL);
  const inputWrapper = io.getElem(INPUTWRAPPEREL);
  const btn = io.getElem(BTNEL) as HTMLInputElement;

  options?.length === 0
    ? io.attr('disabled', 'disabled')(btn)
    : (btn!.disabled = false);

  compose(
    io.append(optionsView(options)),
    io.clear()
  )(io.getElem(INPUTWRAPPEREL));

  const toRender = fetchedData.filter((c: FetchedCountry) =>
    state.includes(c.id)
  );

  compose(io.append(view(toRender)), io.clear())(outputEl);

  const rm = deselect((e: Event) => {
    rm();
    if (!isCustomEvent(e)) return;
    const toRm = e.detail;
    const newOptions = uniq(
      [...options, toRm].sort((a, b) => a.value.localeCompare(b.value))
    );
    const newState = state.filter((c: string) => c !== toRm.id);

    app(newState, newOptions, toRender, select, deselect);
  });

  outputEl ? io.scrollDown(outputEl) : null;

  const stop = select(async (_e: Event) => {
    stop();

    const selectedCountryId = io.getInputValue(INPUTEL);
    const newState = uniq([...state, selectedCountryId]);

    const alreadyFetched =
      fetchedData.length > 0
        ? fetchedData.filter((c) => c.id === selectedCountryId)
        : null;

    const newCountry =
      alreadyFetched && alreadyFetched.length > 0
        ? alreadyFetched[0]
        : await serialise.addCountry(selectedCountryId, options);

    const newData = uniq([...fetchedData, newCountry]) as FetchedCountry[];

    const selectableCountries = difference(pluck('id', options), newState);

    const newOptions = filter((x: Country) =>
      includes(x.id, selectableCountries)
    )(options);

    // console.log(state, newState, selectedCountryId)

    app(newState, newOptions, newData, select, deselect);
  });
}

function view(toRender: FetchedCountries) {
  const el = compose(io.attr('class', 'charts'))(io.elem('div'));
  toRender.map(chart).forEach(io.add(el));
  return el;
}

function optionsView(options: List) {
  const el = compose(io.attr('id', 'selection'))(io.elem('select'));
  options.map(option).forEach(io.add(el));
  return el;
}

function option(country: Country) {
  return compose(
    io.append(io.text(country.value)),
    io.attr('value', country.id)
  )(io.elem('option'));
}

const selectButton = compose(
  io.attr('id', BTNEL),
  io.append(io.text('Select country'))
)(io.elem('button'));

compose(io.append(selectButton))(io.getElem(BTNWRAPPEREL));

const selectionClick = io.on('click', io.getElem(BTNEL));

const deselectionClick = io.on('deselect', io.getElem(OUTPUTEL));

// couldn't think of a better way to solve Object.freeze([]) being type "readonly never[]"
app(
  Object.freeze([]) as unknown as string[],
  countries,
  Object.freeze([]) as unknown as FetchedCountries,
  selectionClick,
  deselectionClick
);

export default app;
