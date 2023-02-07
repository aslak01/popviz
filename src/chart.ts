import type { FetchedCountry, PopData } from './types';
import {
  compose,
} from 'rambda';

import * as d3 from 'd3';
import * as io from './io';
import { formatNr } from './string-utils';

const lineColor = 'white';
const lineWidth = '1px';

export const chart = (country: FetchedCountry) => {

  // dimensions:
  const margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  const textPadding = 5;

  const height = 20 + margins.top + margins.bottom;
  const width = 200 + margins.left + margins.right;

  // data:
  // Sorting to guarantee correct order
  country.data = country.data.sort((a, b) => Number(a.date) - Number(b.date));

  const first = country.data[0];
  const last = country.data[country.data.length - 1];
  const maxY = Math.max(...country.data.map((d) => d.value));
  const minY = Math.min(...country.data.map((d) => d.value));

  console.log('fetched data: ', country.value, first, last);

  const xScale = d3
    .scaleTime()
    .domain([Number(first.date), Number(last.date)])
    .range([margins.left, width - margins.right]);

  const yScale = d3
    .scaleLinear()
    .domain([minY, maxY])
    .range([height - margins.top, margins.bottom])
    .nice();

  const scaleData = (d: PopData): [number, number] => [
    xScale(d.date),
    yScale(d.value),
  ];

  const scaledData = country.data.map(scaleData);
  const firstCoord = scaledData[0];
  const lastCoord = scaledData[scaledData.length - 1];
  const line = d3.line().curve(d3.curveCardinal)(scaledData);

  type TickData = { coords: [number, number], label: number }

  const serialiseTickData = (data: PopData[], coords: [number, number][], frequency: number): TickData[] => {
    const tickData = coords.map((c, i) => ({ coords: [c[0], height], label: data[i].date })) as TickData[]
    const pickTicks = (n: number, array: TickData[]) => {
      const result = array.filter((_el, i) => i % n === 0)
      return result
    }
    return pickTicks(frequency, tickData)
  }
  const tickData = serialiseTickData(country.data, scaledData, 10)

  const chartSvg = compose(
    io.attr('height', height),
    io.attr('width', width),
    io.attr('viewBox', `0 0 ${width} ${height}`)
  )(io.elemNS('svg'));

  const drawTick = (ticks: TickData) => compose(
    io.attr('x1', ticks.coords[0]),
    io.attr('x2', ticks.coords[0]),
    io.attr('y1', ticks.coords[1]),
    io.attr('y2', ticks.coords[1] - 5),
    io.attr('class', 'tick-mark')
  )(io.elemNS('line'))

  const drawTickLabel = (ticks: TickData) => compose(
    io.append(io.text(String(ticks.label))),
    io.attr('x', ticks.coords[0]),
    io.attr('y', ticks.coords[1] + 10),
    io.attr('class', 'tick-label'),
    io.attr('text-anchor', 'middle'),
    io.attr('dominant-baseline', 'auto')
  )(io.elemNS('text'))

  const drawTicks = (ticks: TickData[]) => {
    const el = io.elemNS('g')
    ticks.map(drawTick).forEach(io.add(el))
    ticks.map(drawTickLabel).forEach(io.add(el))
    return el
  }

  const ticks = drawTicks(tickData)

  const chartPath = compose(
    io.attr('d', line),
    io.attr('class', 'chart-line')
  )(io.elemNS('path'));

  const chartTitle = compose(
    io.append(io.text(country.value)),
    io.attr('x', width / 2),
    io.attr('y', margins.top - textPadding),
    io.attr('text-anchor', 'middle'),
    io.attr('dominant-baseline', 'auto'),
    io.attr('class', 'chart-title')
  )(io.elemNS('text'));

  const labelFirst = compose(
    io.append(io.text(formatNr(first.value))),
    io.attr('x', firstCoord[0] - textPadding),
    io.attr('y', firstCoord[1]),
    io.attr('text-anchor', 'end'),
    io.attr('dominant-baseline', 'middle'),
    io.attr('class', 'chart-label'),
    io.attr('class', 'chart-label-first')
  )(io.elemNS('text'));

  const labelLast = compose(
    io.append(io.text(formatNr(last.value))),
    io.attr('x', lastCoord[0] + textPadding),
    io.attr('y', lastCoord[1]),
    io.attr('text-anchor', 'start'),
    io.attr('dominant-baseline', 'middle'),
    io.attr('class', 'chart-label'),
    io.attr('class', 'chart-label-last')
  )(io.elemNS('text'));

  compose(
    io.append(chartTitle),
    io.append(labelFirst),
    io.append(labelLast),
    io.append(chartPath),
    io.append(ticks)
  )(chartSvg);

  return io.append(chartSvg)(
    compose(io.attr('class', 'chart'))(io.elem('div'))
  );
};

export default chart;
