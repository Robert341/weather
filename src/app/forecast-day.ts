import { WeatherDate } from './weather-date';

export class ForecastDay {
  constructor(
    public temp: number,
    public icon: string,
    public weatherKind: string,
    public tempMax: number,
    public tempMin: number,
    public date: WeatherDate
  ) {}
}
