// import * as R from 'ramda'
import { curry } from 'rambda'

export const elem = (tag: keyof HTMLElementTagNameMap) => document.createElement(tag);
export const text = ( content: string) => document.createTextNode(content);
export const getElem = ( id: string ) => document.getElementById(id);
export const getText = () => (getElem('message-text') as HTMLInputElement).value;
export const setText = (value: string) => (getElem('message-text') as HTMLInputElement).value = value;

export const on = curry(function(eventType, element, fn) {
  element.addEventListener(eventType, fn);

  return function() {
    element.removeEventListener(eventType, fn);
  }
});

export const addClass = curry(function(className, element) {
  element.classList.add(className);

  return element;
});

export const append = curry(function(node, element) {
  element.appendChild(node);

  return element;
});

export const attr = curry(function(attributeName, attributeValue, element) {
  element.setAttribute(attributeName, attributeValue);

  return element;
});

export const clear = curry((element) => {
  element.innerHTML = '';

  return element;
});
