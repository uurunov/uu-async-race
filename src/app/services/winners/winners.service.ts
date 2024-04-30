import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../constants/app-settings';
import { Winner } from '../../models/winner';

@Injectable({
  providedIn: 'root',
})
export class WinnersService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  getWinners(): Observable<Winner[]> {
    return this.http.get<Winner[]>(AppSettings.GET_WINNERS_URL);
  }

  deleteWinner(carID: number) {
    return this.http.delete<{}>(AppSettings.DELETE_WINNER_URL + carID);
  }
}
