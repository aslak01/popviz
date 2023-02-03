// import { compose } from 'rambda'
// import { timeParse } from 'd3'
// import * as io from './io';

type PopD = {
  date: number,
  value: number
}

export const chart = (data: PopD[]) => {

  data = data.sort((a, b) => Number(a.date) - Number(b.date));

  const first = data[0]
  const last = data[data.length - 1]
  console.log(first, last)

  // function message(content: string, index: number) {
  //   return compose(
  //     io.append(io.text(content)),
  //     io.attr('data-index', index)
  //   )(io.elem('div'));
  // }



}
