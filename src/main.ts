import { pipe, compose, pick, map, uniq, pluck, difference, filter, includes } from 'rambda';
import * as io from './io';
import { deserialisePopData } from './deserialisation'
import {chart} from './chart'

const INPUTWRAPPEREL = 'selection-wrapper';
const INPUTEL = 'selection'
const BTNEL = 'search-btn';
const OUTPUTEL = 'charts';
const LISTURL = 'https://api.worldbank.org/v2/country?format=json&region=EUU';

const listData = await io.fetchJson(LISTURL)
const pickSelectionProps: ((list: List) => List) = map(pick('id,name'))
const countries = pickSelectionProps(listData[1])

type State = readonly never[] | string[];
type Country = { name: string, id: string }
type List = Country[]
type Dispatcher = (fn: (event: MouseEvent) => any) => () => void;


async function app(state: State, list: List, dispatch: Dispatcher) {
  compose(io.append(view(state)), io.clear())(io.getElem(OUTPUTEL));

  compose(io.append(optionsView(list)), io.clear())(io.getElem(INPUTWRAPPEREL))

  const stop = dispatch(async (_e: Event) => {
    stop();

    const newCountry = io.getInputValue(INPUTEL);

    const countryData = deserialisePopData(await io.fetchCountry(newCountry))
    console.log(countryData)
    
    chart(countryData)
    const newState = uniq([...state, newCountry]);
    const remainingCountries = difference(pluck('id', list), newState)
    const filterByCountry = filter((x: Country) => includes(x.id, remainingCountries))
    const newList = filterByCountry(list)

    app(newState, newList, dispatch);
  });
}

function view(state: State) {
  const el = io.elem('div');
  return state.length > 0
    ? pipe(
      // @ts-expect-error: spreading params
      ...state.map((content: string, index: number) =>
        io.append(message(content, index))
      )
    )(io.elem('div'))
    : el
}

function message(content: string, index: number) {
  return compose(
    io.append(io.text(content)),
    io.attr('data-index', index)
  )(io.elem('div'));
}

function optionsView(list: List) {
  return list.length > 0
    ? pipe(
      // @ts-expect-error: spreading params
      ...list.map((c: Country) =>
        io.append(options(c))
      )
    )(io.attr('id', 'selection')(io.elem('select')))
    : null
}

function options(country: Country) {
  return compose(
    io.append(io.text(country.name)),
    io.attr('value', country.id)
  )(io.elem('option'))
}

const buttonClick = io.on('click', io.getElem(BTNEL));

app(Object.freeze([]), countries, buttonClick);

export default app;
