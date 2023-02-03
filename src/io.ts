import { curry, flip } from 'rambda'

const fetchJson = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

const fetchList = async (url: string) => {
  const [_meta, listData] = await fetchJson(url)
  return listData
}

const fetchCountry = async (id: string) => {
  const COUNTRYURL = `https://api.worldbank.org/v2/country/${id}/indicator/SP.POP.TOTL?format=json`
  const [meta, popData] = await fetchJson(COUNTRYURL)
  if (meta.pages > 1) {
    // this needs to be generalised in a real setting obviously
    const p2 = COUNTRYURL.concat('&page=2')
    const [_meta2, data2] = await fetchJson(p2)
    return [...popData, ...data2]
  }
  return popData
}

const elem = (tag: keyof HTMLElementTagNameMap) => document.createElement(tag);
const text = (content: string) => document.createTextNode(content);
const getElem = (id: string): HTMLElement | HTMLInputElement | null => document.getElementById(id);
const getInputValue = (inputId: string) => (getElem(inputId) as HTMLInputElement).value;
const setInputValue = (value: string, inputId: string) => (getElem(inputId) as HTMLInputElement).value = value;

const on = curry(function(eventType, element, fn) {
  element.addEventListener(eventType, fn);

  return function() {
    element.removeEventListener(eventType, fn);
  }
});

const addClass = curry(function(className, element) {
  element.classList.add(className);

  return element;
});

const append = curry(function(node, element) {
  element.appendChild(node);

  return element;
});


const add = flip(append)

const attr = curry(function(attributeName, attributeValue, element) {
  element.setAttribute(attributeName, attributeValue);

  return element;
});

const clear = curry((element) => {
  element.innerHTML = '';

  return element;
});

export {
  fetchJson,
  fetchList,
  fetchCountry,
  elem,
  text,
  on,
  append,
  add,
  clear,
  attr,
  addClass,
  getElem,
  getInputValue as getInputValue,
  setInputValue as setInputText,
}

