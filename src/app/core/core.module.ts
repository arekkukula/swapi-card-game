import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { DATASERVICE_RANDOM_GEN, DataService } from './services/data.service';
import { materialImports } from './material.imports';

function initializeDataService(service: DataService): Promise<void> {
  return new Promise(async (resolve, _) => {
    await service.initializeData();
    resolve();
  });
}

@NgModule({
  declarations: [],
  imports: [
    ...materialImports,
    CommonModule,
    HttpClientModule,
  ],
  exports: [
    ...materialImports,
  ],
  providers: [
    ApiService,
    DataService,
    { provide: DATASERVICE_RANDOM_GEN, useValue: () => Math.random() },
    {
      provide: APP_INITIALIZER,
      useFactory: (service: DataService) => initializeDataService.bind(this, service),
      multi: true,
      deps: [DataService]
    }
  ],
})
export class CoreModule {
  // assume import guard here
}
