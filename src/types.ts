type PopDataRaw = { date: string; value: number };
type PopData = { date: number; value: number };
type Country = { id: string; value: string };
type FetchedCountry = Country & { data: PopData[] };
type State = readonly string[];
type StateData = readonly FetchedCountry[];
type FetchedCountries = FetchedCountry[];
type List = Country[];
type Dispatcher = (fn: (event: MouseEvent) => any) => () => void;

type Coords = [number, number];
type TickData = { coords: Coords; label: number };

type InputListDataEntry = {
  adminregion: {
    id: string;
    iso2code: string;
    value: string;
  };
  capitalCity: string;
  id: string;
  incomelevel: {
    id: string;
    iso2code: string;
    value: string;
  };
  iso2code: string;
  latitude: string;
  leadingType: {
    id: string;
    iso2code: string;
    value: string;
  };
  longitude: string;
  name: string;
  region: {
    id: string;
    iso2code: string;
    value: string;
  };
};

type InputCountryDataMeta = {
  lastupdated: string;
  page: number;
  pages: number;
  per_page: number;
  sourceid: string;
  sourcename: string;
  total: number;
};

type InputCountryData = {
  country: {
    id: string;
    value: string;
  };
  countryiso3code: string;
  date: string;
  decimal: number;
  indicator: {
    id: string;
    value: string;
  };
  obs_status: string;
  unit: string;
  value: number;
};

export type {
  Coords,
  Country,
  Dispatcher,
  FetchedCountries,
  FetchedCountry,
  InputCountryData,
  InputCountryDataMeta,
  InputListDataEntry,
  List,
  PopData,
  PopDataRaw,
  State,
  StateData,
  TickData,
};

// typescript custom event guard
// https://stackoverflow.com/a/47171216
function isCustomEvent(event: Event): event is CustomEvent {
  return 'detail' in event;
}

export { isCustomEvent };
