import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/index';
import { env } from '../environments/environment';

@Injectable()
export class WeatherService {
  constructor(private httpClient: HttpClient) {}

  getCurrentPosition() {
    return Observable.create(observer => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (pos) => {
            observer.next(pos);
            observer.complete();
          },
          (error) => observer.error(error)
        );
      } else {
        observer.error('Unsupported browser');
      }
    });
  }

  getCurrentWeather(lat: number, lon: number): Observable<any> {
    return this.httpClient.get(`${env.OWM}weather?lat=${lat}&lon=${lon}&appid=${env.API_KEY}&units=metric`);
  }

  getCurrentWeatherByCityName(city: string): Observable<any> {
    return this.httpClient.get(`${env.OWM}weather?q=${city}&appid=${env.API_KEY}&units=metric`);
  }

  getWeatherForecast(lat: number, lon: number): Observable<any> {
    return this.httpClient.get(`${env.OWM}forecast?lat=${lat}&lon=${lon}&appid=${env.API_KEY}&units=metric`);
  }

  getWeatherForecastByCityName(city: string): Observable<any> {
    return this.httpClient.get(`${env.OWM}forecast?q=${city}&appid=${env.API_KEY}&units=metric`);
  }
}
