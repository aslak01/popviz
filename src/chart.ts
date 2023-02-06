import {
  compose,
  // pipe
} from 'rambda';

import * as d3 from 'd3';
import * as io from './io';
import type { FetchedCountry, PopData } from './types';

export const chart = (country: FetchedCountry) => {
  const height = 20;
  const width = 200;
  const margins = {
    top: 0,
    bottom: 0,
    left: 5,
    right: 5,
  };
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
  const theLine = d3.line()(scaled);

  console.log(country.value, first, last);
  // svg is not like other dom elements:
  // https://dev.to/tqbit/how-to-create-svg-elements-with-javascript-4mmp
  const chartSvg = compose(
    io.attr('height', height),
    io.attr('width', width),
    io.attr('viewBox', `0 0 ${width} ${height}`)
  )(io.elemNS('svg'));

  // console.log(line(country.data))
  // console.log(country.data)

  const chartPath = compose(
    io.attr('d', theLine),
    io.attr('stroke', 'white'),
    io.attr('stroke-width', '1px'),
    io.attr('fill', 'none')
  )(io.elemNS('path'));

  // const chartRect = compose(
  //   io.attr('height', height),
  //   io.attr('width', width),
  //   io.attr('fill', 'white')
  // )(io.elemNS('rect'))

  compose(
    io.append(chartPath)
    // io.append(chartRect)
  )(chartSvg);

  // io.append(io.text(country.value)),
  // io.append(io.text(country.id)),
  // io.append(io.text(first.value + '->' + last.value)),
  // pipe(io.append(io.path))(io.svg))
  // )(io.elem('div'));

  return io.append(chartSvg)(io.elem('div'));

  // function message(content: string, index: number) {
  //   return compose(
  //     io.append(io.text(content)),
  //     io.attr('data-index', index)
  //   )(io.elem('div'));
  // }
};

export default chart;
