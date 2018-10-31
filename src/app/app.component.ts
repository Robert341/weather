import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from './weather.service';
import { Weather } from './weather';
import { ForecastDay } from './forecast-day';
import { WeatherDate } from './weather-date';
import { MapsAPILoader } from '@agm/core';
import { google } from 'google-maps';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageLoading = true;
  currentWeather: Weather;
  forecast: ForecastDay[] = [];
  searchCityName: string;
  isCelsius = true;
  daysOfWeek = [
    'Mon.',
    'Tue.',
    'Wed.',
    'Thu.',
    'Fri.',
    'Sat.',
    'Sun.'
  ];
  monthNames = [
    'jan.',
    'feb.',
    'mar.',
    'apr.',
    'may',
    'jun.',
    'jul.',
    'aug.',
    'sep.',
    'oct.',
    'nov.',
    'dec.'
  ];
  weatherCodes = {
    clear: [800],
    cloudy: [801],
    cloudy_all: [802, 803, 804],
    cloudy_rainy: [500, 501, 502, 503, 504],
    lightening: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
    rainy: [300, 301, 302, 310, 311, 312, 313, 314, 321],
    snow: [511, 600, 601, 602, 611, 612, 615, 616, 620, 621, 622]
  };
  weatherImageNames = [
    'clear',
    'cloudy',
    'cloudy_all',
    'cloudy_rainy',
    'lightening',
    'rainy',
    'snow'
  ];
  @ViewChild('search') public searchElement: ElementRef;
  constructor(
    private weatherService: WeatherService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.weatherService.getCurrentPosition().subscribe(pos => {
        const lat = pos.coords.latitude,
          lon = pos.coords.longitude;

        this.weatherService.getCurrentWeather(lat, lon).subscribe(weather => {
          const date = new Date();

          this.currentWeather = new Weather(
            weather.name,
            weather.main.temp,
            this.getWeatherImageName(weather.weather[0].id),
            this.capitalize(weather.weather[0].description),
            weather.main.temp_max,
            weather.main.temp_min,
            new WeatherDate(
              date.getHours() + ':' + date.getMinutes(),
              null,
              null,
              null
            )
          );

          this.weatherService.getWeatherForecast(lat, lon).subscribe(forecast => {
              const list = forecast.list;

              for (let i = 0; i < list.length; i += 8) {
                date.setDate(date.getDate() + 1);

                this.forecast.push(new ForecastDay(
                  list[i].main.temp,
                  this.getWeatherImageName(list[i].weather[0].id),
                  this.capitalize(list[i].weather[0].description),
                  list[i].main.temp_max,
                  list[i].main.temp_min,
                  new WeatherDate(
                    null,
                    (date.getDay() + 6) % 7,
                    date.getDate(),
                    date.getMonth()
                  )
                ));
              }
          });

          this.pageLoading = false;

          this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types: ['address']});

            autocomplete.addListener('place_changed', () => {
              this.ngZone.run(() => {
                const place: google.maps.places.PlaceResult = autocomplete.getPlace();

                if (place.geometry === undefined || place.geometry === null) {
                  return;
                }
              });
            });
          });
        });
    });
  }

  searchByCityName() {
    this.weatherService.getCurrentWeatherByCityName(this.searchCityName).subscribe(weather => {
      const date = new Date();

      this.currentWeather = new Weather(
        weather.name,
        weather.main.temp,
        this.getWeatherImageName(weather.weather[0].id),
        this.capitalize(weather.weather[0].description),
        weather.main.temp_max,
        weather.main.temp_min,
        new WeatherDate(
          date.getHours() + ':' + date.getMinutes(),
          null,
          null,
          null
        )
      );

      this.weatherService.getWeatherForecastByCityName(this.searchCityName).subscribe(forecast => {
          const list = forecast.list;

          this.forecast = [];

          for (let i = 0; i < list.length; i += 8) {
            date.setDate(date.getDate() + 1);

            this.forecast.push(new ForecastDay(
              list[i].main.temp,
              this.getWeatherImageName(list[i].weather[0].id),
              this.capitalize(list[i].weather[0].description),
              list[i].main.temp_max,
              list[i].main.temp_min,
              new WeatherDate(
                null,
                (date.getDay() + 6) % 7,
                date.getDate(),
                date.getMonth()
              )
            ));
          }

          this.searchCityName = '';
        });
    });
  }

  getWeatherImageName(weatherCode: number) {
    for (const imageName in this.weatherCodes) {
      if (this.weatherCodes[imageName].includes(weatherCode)) {
        return imageName;
      }
    }

    return this.weatherImageNames[Math.floor(Math.random() * this.weatherImageNames.length)];
  }

  capitalize(str: string) {
    const arr = str.split(' ');

    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    str = arr.join(' ');

    return str;
  }

  round(num: number) {
    return Math.round(num);
  }

  cToF() {
    if (this.isCelsius) {
      this.currentWeather.temp = 9 * this.currentWeather.temp / 5 + 32;
      this.currentWeather.tempMax = 9 * this.currentWeather.tempMax / 5 + 32;
      this.currentWeather.tempMin = 9 * this.currentWeather.tempMin / 5 + 32;

      for (let i = 0; i < this.forecast.length; i++) {
        this.forecast[i].temp = 9 * this.forecast[i].temp / 5 + 32;
        this.forecast[i].tempMax = 9 * this.forecast[i].tempMax / 5 + 32;
        this.forecast[i].tempMin = 9 * this.forecast[i].tempMin / 5 + 32;
      }

      this.isCelsius = false;
    }
  }

  fToC() {
    if (!this.isCelsius) {
      this.currentWeather.temp = 5 * (this.currentWeather.temp - 32) / 9;
      this.currentWeather.tempMax = 5 * (this.currentWeather.tempMax - 32) / 9;
      this.currentWeather.tempMin = 5 * (this.currentWeather.tempMin - 32) / 9;

      for (let i = 0; i < this.forecast.length; i++) {
        this.forecast[i].temp = 5 * (this.forecast[i].temp - 32) / 9;
        this.forecast[i].tempMax = 5 * (this.forecast[i].tempMax - 32) / 9;
        this.forecast[i].tempMin = 5 * (this.forecast[i].tempMin - 32) / 9;
      }

      this.isCelsius = true;
    }
  }
}
