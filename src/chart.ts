import { compose, pipe } from 'rambda'
// import { timeParse } from 'd3'
import * as io from './io';
import type { FetchedCountry } from './types'

export const chart = (country: FetchedCountry) => {

  // Sorting to ensure logical order
  country.data = country.data.sort((a, b) => Number(a.date) - Number(b.date));

  const first = country.data[0]
  const last = country.data[country.data.length - 1]
  console.log(first, last)
  // svg is not like other dom elements:
  // https://dev.to/tqbit/how-to-create-svg-elements-with-javascript-4mmp
  const chartSvg = io.svg()
  const chartPath = io.path()

  // chartSvg.appendChild(chartPath)
  io.append(chartPath)(chartSvg)


  // io.append(io.text(country.value)),
  // io.append(io.text(country.id)),
  // io.append(io.text(first.value + '->' + last.value)),
  // pipe(io.append(io.path))(io.svg))
  // )(io.elem('div'));

  return io.append(chartSvg)(io.elem('div'))


  // function message(content: string, index: number) {
  //   return compose(
  //     io.append(io.text(content)),
  //     io.attr('data-index', index)
  //   )(io.elem('div'));
  // }



}
