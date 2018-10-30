export class ForecastDay {
  constructor(
    public date: string,
    public temp: number,
    public icon: string,
    public weatherKind: string,
    public tempMax: number,
    public tempMin: number
  ) {}
}
