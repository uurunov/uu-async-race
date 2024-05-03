import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from '../../constants/app-settings';
import { Winner } from '../../models/winner';
import { WinnerServer } from '../../models/winner-server';

@Injectable({
  providedIn: 'root',
})
export class WinnersService {
  http: HttpClient = inject(HttpClient);

  constructor() {}

  getWinners(): Observable<Winner[]> {
    return this.http.get<Winner[]>(AppSettings.GET_WINNERS_CREATE_WINNER_URL);
  }

  createWinner(winner: Winner) {
    return this.http.post<Winner>(
      AppSettings.GET_WINNERS_CREATE_WINNER_URL,
      winner,
    );
  }

  updateWinner(winner: WinnerServer, winnerID: number) {
    return this.http.put<Winner>(
      AppSettings.UPDATE_DELETE_WINNER_URL + winnerID,
      winner,
    );
  }

  deleteWinner(winnerID: number) {
    return this.http.delete<{}>(
      AppSettings.UPDATE_DELETE_WINNER_URL + winnerID,
    );
  }
}
