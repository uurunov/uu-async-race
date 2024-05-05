import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { AppSettings } from '../../constants/app-settings';
import { Winner } from '../../models/winner';
import { WinnerServer } from '../../models/winner-server';
import { Car } from '../../models/car';
import { GarageService } from '../garage/garage.service';

@Injectable({
  providedIn: 'root',
})
export class WinnersService {
  http: HttpClient = inject(HttpClient);
  garageService: GarageService = inject(GarageService);

  constructor() {}

  getPaginatedWinners(params: {
    pageNumber: number;
    sortElement: string;
    sortOrder: string;
  }) {
    return this.http.get<Winner[]>(AppSettings.GET_WINNERS_CREATE_WINNER_URL, {
      params: {
        _page: params.pageNumber,
        _limit: AppSettings.WINNERS_PAGE_LIMIT,
        _sort: params.sortElement,
        _order: params.sortOrder,
      },
      observe: 'response',
    });
  }

  getWinners(): Observable<Winner[]> {
    return this.http.get<Winner[]>(AppSettings.GET_WINNERS_CREATE_WINNER_URL);
  }

  getWinner(winnerID: number) {
    return this.http.get<Winner>(
      AppSettings.GET_UPDATE_DELETE_WINNER_URL + winnerID,
    );
  }

  createWinner(winner: Winner) {
    return this.http.post<Winner>(
      AppSettings.GET_WINNERS_CREATE_WINNER_URL,
      winner,
    );
  }

  updateWinner(winner: WinnerServer, winnerID: number) {
    return this.http.put<Winner>(
      AppSettings.GET_UPDATE_DELETE_WINNER_URL + winnerID,
      winner,
    );
  }

  deleteWinner(winnerID: number) {
    return this.http.delete<{}>(
      AppSettings.GET_UPDATE_DELETE_WINNER_URL + winnerID,
    );
  }

  getWinnerInfo(winners: Winner[]): Observable<Car[]> {
    const observables: Observable<Car>[] = [];

    winners.forEach((winner) => {
      observables.push(this.garageService.getCar(winner.id));
    });

    return forkJoin(observables);
  }
}
