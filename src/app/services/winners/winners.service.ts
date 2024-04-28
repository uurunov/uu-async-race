import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../constants/app-settings';
import { Winner } from '../../models/winner';

@Injectable({
  providedIn: 'root',
})
export class WinnersService {
  constructor(private http: HttpClient) {}

  getWinners(): Observable<Winner[]> {
    return this.http.get<Winner[]>(AppSettings.GET_WINNERS_URL);
  }
}
