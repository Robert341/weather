import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { LoadingComponent } from './loading/loading.component';

import { WeatherService } from './weather.service';

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDFWdCjrRzk8EES2CSAvNRudCiJbyqgSeA',
      libraries: ['places']
    })
  ],
  providers: [WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
