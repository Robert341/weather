export class Weather {
  constructor(
    public city: string,
    public temp: number,
    public icon: string,
    public weatherKind: string,
    public tempMax: number,
    public tempMin: number
  ) {}
}
