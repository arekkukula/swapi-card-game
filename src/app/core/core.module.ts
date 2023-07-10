import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { DATASERVICE_RANDOM_GEN } from './services/data.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    ApiService,
    { provide: DATASERVICE_RANDOM_GEN, useValue: () => Math.random() }
  ],
})
export class CoreModule {
  // assume import guard here
}
