import { pipe, compose, curry } from 'rambda'
import {
  elem,
  text,
  // on,
  append,
  clear,
  attr,
  // addClass,
  getElem,
  getInputText,
  setInputText,
} from "./functions";

const INPUTEL = 'search'
const BTNEL = 'search-btn'
const OUTPUTEL = 'charts'

type State = readonly never[] | string[];
type Output = HTMLElement | null;
// type Dispatch = EventHandler

export const on = curry(function(eventType, element, fn) {
  element.addEventListener(eventType, fn);

  return function() {
    element.removeEventListener(eventType, fn);
  }
});

function app(state: State, output: Output, dispatch: Dispatch) {
  compose(append(view(state)), clear())(output);

  const stop = dispatch((_e: Event) => {
    stop();
    const newText = getInputText(INPUTEL);

    const newState = [...state, newText];

    setInputText("", INPUTEL);

    app(newState, output, dispatch);
  });
}

function view(state: State) {
  const el = elem("div");
  return state.length > 0
    ? pipe(
      // @ts-expect-error: spreading params
      ...state.map((content: string, index: number) =>
        append(message(content, index))
      )
    )(elem("div"))
    : el;
}

function message(content: string, index: number) {
  return compose(
    append(text(content)),
    attr("data-index", index),
  )(elem("div"));
}

const buttonClick = on("click", getElem(BTNEL));

app(
  Object.freeze([]),
  getElem(OUTPUTEL),
  buttonClick
);

export default app;
