import type { FetchedCountry, PopData } from './types';
import {
  compose,
  // pipe
} from 'rambda';

import * as d3 from 'd3';
import * as io from './io';
import { formatNr } from './utils';

const lineColor = 'white';
const lineWidth = '1px';
const textColor = 'white';

export const chart = (country: FetchedCountry) => {
  const margins = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  const textPadding = 5;

  const height = 20 + margins.top + margins.bottom;
  const width = 200 + margins.left + margins.right;
  // Sorting to ensure logical order
  country.data = country.data.sort((a, b) => Number(a.date) - Number(b.date));

  const first = country.data[0];
  const last = country.data[country.data.length - 1];
  const maxY = Math.max(...country.data.map((d) => d.value));
  const minY = Math.min(...country.data.map((d) => d.value));

  // const dateParser = d3.timeParse('%Y')
  // const xAccessor = (d: PopData) => dateParser(d.date)
  // const yAccessor = (d: PopData) => d.value

  const xScale = d3
    .scaleTime()
    .domain([Number(first.date), Number(last.date)])
    .range([margins.left, width - margins.right]);

  const yScale = d3
    .scaleLinear()
    .domain([minY, maxY])
    .range([height - margins.top, margins.bottom])
    .nice();

  const transform = (d: PopData): [number, number] => [
    xScale(d.date),
    yScale(d.value),
  ];

  const scaled = country.data.map(transform);
  const firstCoord = scaled[0];
  const lastCoord = scaled[scaled.length - 1];
  const line = d3.line()(scaled);

  console.log(country.value, first, last);
  // svg is not like other dom elements:
  // https://dev.to/tqbit/how-to-create-svg-elements-with-javascript-4mmp
  const chartSvg = compose(
    io.attr('height', height),
    io.attr('width', width),
    io.attr('viewBox', `0 0 ${width} ${height}`)
  )(io.elemNS('svg'));

  const chartPath = compose(
    io.attr('d', line),
    io.attr('stroke', lineColor),
    io.attr('stroke-width', lineWidth),
    io.attr('fill', 'none')
  )(io.elemNS('path'));

  const labelChart = compose(
    io.append(io.text(country.value)),
    io.attr('x', width / 2),
    io.attr('y', margins.top - textPadding),
    io.attr('text-anchor', 'middle'),
    io.attr('dominant-baseline', 'auto')
  )(io.elemNS('text'));

  const labelFirst = compose(
    io.append(io.text(formatNr(first.value))),
    io.attr('x', firstCoord[0] - textPadding),
    io.attr('y', firstCoord[1]),
    io.attr('text-anchor', 'end'),
    io.attr('dominant-baseline', 'middle')
  )(io.elemNS('text'));

  const labelLast = compose(
    io.append(io.text(formatNr(last.value))),
    io.attr('x', lastCoord[0] + textPadding),
    io.attr('y', lastCoord[1]),
    io.attr('text-anchor', 'start'),
    io.attr('dominant-baseline', 'middle')
  )(io.elemNS('text'));

  compose(
    io.append(labelChart),
    io.append(labelFirst),
    io.append(labelLast),
    io.append(chartPath)
  )(chartSvg);

  return io.append(chartSvg)(
    compose(io.attr('class', 'chart'))(io.elem('div'))
  );
};

export default chart;
