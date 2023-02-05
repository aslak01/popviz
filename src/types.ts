type Country = { id: string; value: string };
type List = Country[];
type Dispatcher = (fn: (event: MouseEvent) => any) => () => void;

type PopDataRaw = {
  date: string;
  value: number;
};

type PopData = {
  date: number;
  value: number;
};

interface FetchedCountry extends Country {
  data: PopData[];
}

type State = readonly never[] | FetchedCountry[];

interface InputListDataEntry {
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
}

interface InputCountryDataMeta {
  lastupdated: string;
  page: number;
  pages: number;
  per_page: number;
  sourceid: string;
  sourcename: string;
  total: number;
}

interface InputCountryData {
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
}

export type {
  State,
  Country,
  List,
  Dispatcher,
  PopData,
  PopDataRaw,
  FetchedCountry,
  InputCountryData,
  InputCountryDataMeta,
  InputListDataEntry,
};
