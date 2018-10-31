import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { Weather } from './weather';
import { ForecastDay } from './forecast-day';

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
  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.weatherService.getCurrentPosition().subscribe(pos => {
        const lat = pos.coords.latitude,
          lon = pos.coords.longitude;

        this.weatherService.getCurrentWeather(lat, lon).subscribe(weather => {
          this.currentWeather = new Weather(
            weather.name,
            Math.round(weather.main.temp),
            weather.weather[0].icon,
            this.capitalize(weather.weather[0].description),
            Math.round(weather.main.temp_max),
            Math.round(weather.main.temp_min)
          );

          this.weatherService.getWeatherForecast(lat, lon).subscribe(forecast => {
              const list = forecast.list;

              for (let i = 0; i < list.length; i += 8) {
                this.forecast.push(new ForecastDay(
                  list[i].dt_txt.split(' ')[0],
                  Math.round(list[i].main.temp),
                  list[i].weather[0].icon,
                  this.capitalize(list[i].weather[0].description),
                  Math.round(list[i].main.temp_max),
                  Math.round(list[i].main.temp_min)
                ));
              }
          });

          this.pageLoading = false;
        });
    });
  }


  searchByCityName() {
    this.weatherService.getCurrentWeatherByCityName(this.searchCityName).subscribe(weather => {
      this.currentWeather = new Weather(
        weather.name,
        weather.main.temp,
        weather.weather[0].icon,
        this.capitalize(weather.weather[0].description),
        weather.main.temp_max,
        weather.main.temp_min
      );

      this.weatherService.getWeatherForecastByCityName(this.searchCityName).subscribe(forecast => {
          const list = forecast.list;

          this.forecast = [];

          for (let i = 0; i < list.length; i += 8) {
            this.forecast.push(new ForecastDay(
              list[i].dt_txt.split(' ')[0],
              list[i].main.temp,
              list[i].weather[0].icon,
              this.capitalize(list[i].weather[0].description),
              list[i].main.temp_max,
              list[i].main.temp_min
            ));
          }

          this.searchCityName = '';
        });
    });
  }

  capitalize(str: string) {
    const arr = str.split(' ');

    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    str = arr.join(' ');

    return str;
  }

  round(val: number, digits: number) {
    return Math.floor(val * Math.pow(10, digits)) / Math.pow(10, digits);
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
