import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CarEngineInfo } from '../../models/car-engine-info';
import { AppSettings } from '../../constants/app-settings';
import { CarEngine } from '../../models/car-engine';

@Injectable({
  providedIn: 'root',
})
export class EngineService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  startStopCarEngine(carEngineInfo: CarEngineInfo) {
    return this.http.patch<CarEngine>(
      AppSettings.START_STOP_ENGINE_URL,
      {},
      {
        params: { id: carEngineInfo.id, status: carEngineInfo.status },
      },
    );
  }

  switchToDriveMode(carEngineInfo: CarEngineInfo) {
    return this.http.patch<{}>(
      AppSettings.START_STOP_ENGINE_URL,
      {},
      {
        params: { id: carEngineInfo.id, status: carEngineInfo.status },
      },
    );
  }
}
