import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Car } from '../../models/car';
import { AppSettings } from '../../constants/app-settings';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GarageService {
  constructor(private http: HttpClient) {}

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(AppSettings.GET_CARS_URL);
  }

  createCar(): void {}
}
