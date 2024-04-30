import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Car } from '../../models/car';
import { AppSettings } from '../../constants/app-settings';
import { Observable } from 'rxjs';
import { CarServer } from '../../models/car-server';

@Injectable({
  providedIn: 'root',
})
export class GarageService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  getPaginatedCars(): Observable<HttpResponse<Car[]>> {
    return this.http.get<Car[]>(AppSettings.GET_CARS_URL, {
      params: { _page: 1, _limit: AppSettings.GARAGE_PAGE_LIMIT },
      observe: 'response',
    });
  }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(AppSettings.GET_CARS_URL);
  }

  createCar(car: CarServer) {
    return this.http.post<Car>(AppSettings.CREATE_CAR_URL, car);
  }

  updateCar(car: CarServer, carID: number) {
    return this.http.put<Car>(AppSettings.UPDATE_CAR_URL + carID, car);
  }

  deleteCar(carID: number) {
    return this.http.delete<{}>(AppSettings.DELETE_CAR_URL + carID);
  }
}
