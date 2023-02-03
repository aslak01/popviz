import { pick } from 'rambda'

type PopDataMeta = {
  lastupdated: string
  page: number
  pages: number
  per_page: number
  sourceid: string
  sourcename: string
  total: number
}
type PopData = {
  country: {
    id: string
    value: string
  }
  countryiso3code: string
  date: string
  decimal: number
  indicator: {
    id: string
    value: string
  }
  obs_status: string
  unit: string
  value: number
}


export const deserialisePopData = (popData: PopData[]) => {
  const pickData = (entry: PopData) => pick('date,value', entry)
  return popData.map(pickData)
}
