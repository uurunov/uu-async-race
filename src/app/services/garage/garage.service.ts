import { HttpClient } from '@angular/common/http';
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

  getPaginatedCars(pageNumber: number) {
    return this.http.get<Car[]>(AppSettings.GET_CARS_CREATE_CAR_URL, {
      params: { _page: pageNumber, _limit: AppSettings.GARAGE_PAGE_LIMIT },
      observe: 'response',
    });
  }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(AppSettings.GET_CARS_CREATE_CAR_URL);
  }

  createCar(car: CarServer) {
    return this.http.post<Car>(AppSettings.GET_CARS_CREATE_CAR_URL, car);
  }

  updateCar(car: CarServer, carID: number) {
    return this.http.put<Car>(AppSettings.UPDATE_DELETE_CAR_URL + carID, car);
  }

  deleteCar(carID: number) {
    return this.http.delete<{}>(AppSettings.UPDATE_DELETE_CAR_URL + carID);
  }
}
