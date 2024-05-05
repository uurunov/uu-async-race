import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AppState } from '../models/app-state';
import { computed, inject } from '@angular/core';
import { GarageService } from '../services/garage/garage.service';
import { Car } from '../models/car';
import { CarServer } from '../models/car-server';
import { WinnersService } from '../services/winners/winners.service';
import { HttpResponse } from '@angular/common/http';
import { AppSettings } from '../constants/app-settings';
import { Winner } from '../models/winner';
import { Sort } from '@angular/material/sort';
import { WinnerUi } from '../models/winner-ui';

const initialState: AppState = {
  cars: [],
  garagePaginationIndex: 0,
  garagePaginationPage: 1,
  totalCarsCount: 0,
  selectedCarId: 0,
  newCarForm: {
    name: `${AppSettings.CAR_NAME_DEFAULT}`,
    color: `${AppSettings.CAR_COLOR_DEFAULT}`,
  },
  updateCarForm: {
    name: `${AppSettings.CAR_NAME_DEFAULT}`,
    color: `${AppSettings.CAR_COLOR_DEFAULT}`,
    disabled: true,
  },
  winners: [],
  winnersPaginationIndex: 0,
  winnersPaginationPage: 1,
  totalWinnersCount: 0,
  winnersSortElement: 'id',
  winnersSortOrder: 'ASC',
  isThereWinner: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(
    ({
      garagePaginationPage,
      totalCarsCount,
      winnersPaginationPage,
      totalWinnersCount,
    }) => ({
      garageInfo: computed(() => `Garage (${totalCarsCount()})`),
      garagePageInfo: computed(() => `Page ${garagePaginationPage()}`),
      winnersInfo: computed(() => `Winners (${totalWinnersCount()})`),
      winnersPageInfo: computed(() => `Page ${winnersPaginationPage()}`),
    }),
  ),
  withMethods(
    (
      store,
      winnersService = inject(WinnersService),
      garageService = inject(GarageService),
    ) => ({
      // GARAGE related methods
      getCarsAsGroup() {
        garageService
          .getPaginatedCars(store.garagePaginationPage())
          .subscribe((response: HttpResponse<Car[]>) => {
            patchState(store, {
              cars: response.body || [],
              totalCarsCount: Number(response.headers.get('X-Total-Count')),
            });
          });
      },

      createCar(car: CarServer) {
        garageService
          .createCar({ name: car.name, color: car.color })
          .subscribe(() => {
            patchState(store, {
              totalCarsCount: store.totalCarsCount() + 1,
            });
          });
        this.getCarsAsGroup();
      },

      updateCar(car: CarServer) {
        garageService
          .updateCar(
            { name: car.name, color: car.color },
            store.selectedCarId(),
          )
          .subscribe(() => {
            patchState(store, { selectedCarId: 0 });
          });

        this.getCarsAsGroup();
      },

      deleteCar() {
        winnersService.deleteWinner(store.selectedCarId()).subscribe(() => {});
        garageService.deleteCar(store.selectedCarId()).subscribe(() => {
          patchState(store, { selectedCarId: 0 });
        });

        this.getCarsAsGroup();
      },

      setSelectedCarId(id: number) {
        patchState(store, { selectedCarId: id });
      },

      setGaragePaginationPage(pageNum: number) {
        patchState(store, {
          garagePaginationIndex: pageNum,
          garagePaginationPage: pageNum + 1,
        });

        this.getCarsAsGroup();
      },

      setNewCarForm(car: CarServer) {
        patchState(store, { newCarForm: { name: car.name, color: car.color } });
      },

      setUpdateCarForm(car: CarServer, disabledState: boolean) {
        patchState(store, {
          updateCarForm: {
            name: car.name,
            color: car.color,
            disabled: disabledState,
          },
        });
      },

      // WINNERS related methods
      processWinner(winner: Winner) {
        winnersService.getWinner(winner.id).subscribe({
          next: (existingWinner: Winner) => {
            // winner exists
            winnersService
              .updateWinner(
                {
                  time:
                    winner.time < existingWinner.time
                      ? winner.time
                      : existingWinner.time,
                  wins: existingWinner.wins + 1,
                },
                winner.id,
              )
              .subscribe((updatedWinner) => {
                console.log('Winner Updated: ', updatedWinner);
              });
          },
          error: () => {
            // winner does not exist
            winnersService
              .createWinner({
                id: winner.id,
                wins: winner.wins,
                time: winner.time,
              })
              .subscribe((createdWinner) => {
                console.log('Winner Created: ', createdWinner);
                patchState(store, {
                  totalWinnersCount: store.totalWinnersCount() + 1,
                });
              });
          },
        });
      },

      getWinnersAsGroup() {
        winnersService
          .getPaginatedWinners({
            pageNumber: store.winnersPaginationPage(),
            sortElement: store.winnersSortElement(),
            sortOrder: store.winnersSortOrder(),
          })
          .subscribe((response: HttpResponse<Winner[]>) => {
            if (response && response.body && response.body.length) {
              const winners = response.body;
              const winnersFullInfo: WinnerUi[] = [];

              winnersService.getWinnerInfo(winners).subscribe((winnersInfo) => {
                for (let i = 0; i < winners.length; i++) {
                  winnersFullInfo.push({ ...winners[i], ...winnersInfo[i] });
                }

                patchState(store, {
                  winners: winnersFullInfo,
                  totalWinnersCount: Number(
                    response.headers.get('X-Total-Count'),
                  ),
                });
              });
            }
          });
      },

      setWinnersPaginationPage(pageNum: number) {
        patchState(store, {
          winnersPaginationIndex: pageNum,
          winnersPaginationPage: pageNum + 1,
        });

        this.getWinnersAsGroup();
      },

      setWinnersSortState(sortState: Sort) {
        patchState(store, {
          winnersSortElement: sortState.active,
          winnersSortOrder: sortState.direction,
        });
        this.getWinnersAsGroup();
      },

      setWinnerState(state: boolean) {
        patchState(store, { isThereWinner: state });
      },
    }),
  ),
);
