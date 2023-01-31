// import * as R from "ramda";
import { pipe, compose } from 'rambda'
import {
  elem,
  text,
  on,
  append,
  clear,
  attr,
  addClass,
  getElem,
  getText,
  setText,
} from "./functions";

type State = string[];
type Output = HTMLDivElement;
type Dispatch = Event;

function app(state: State, output: Output, dispatch: Dispatch) {
  console.log("state", state);
  console.log("output", output);
  console.log("dispatch", dispatch);
  compose(append(view(state)), clear())(output);

  const stop = dispatch((e: Event) => {
    stop();
    const newText = getText();

    const newState = [...state, newText];

    setText("");

    app(newState, output, dispatch);
  });
}

function view(state: State) {
  const el = elem("div");
  const rest = state.map((content: string, index: number) =>
    append(message(content, index))
  );
  console.log("rest", ...rest);
  return state.length > 0
    ? pipe(
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
    addClass("bg-warning"),
    addClass("p-3")
  )(elem("div"));
}

const buttonClick = on("click", getElem("message-button"));

app(
  Object.freeze([]) as unknown as string[],
  getElem("chart") as HTMLDivElement,
  buttonClick
);

export default app;
