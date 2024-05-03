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
import { EngineService } from '../services/engine/engine.service';

const initialState: AppState = {
  allCars: [],
  groupCars: [],
  paginationIndex: 0,
  page: 1,
  total: 0,
  selectedId: 0,
  newCarForm: {
    name: `${AppSettings.CAR_NAME_DEFAULT}`,
    color: `${AppSettings.CAR_COLOR_DEFAULT}`,
  },
  updateCarForm: {
    name: `${AppSettings.CAR_NAME_DEFAULT}`,
    color: `${AppSettings.CAR_COLOR_DEFAULT}`,
    disabled: true,
  },
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ page, total }) => ({
    nameWithCount: computed(() => `Garage (${total()})`),
    pageInfo: computed(() => `Page ${page()}`),
  })),
  withMethods(
    (
      store,
      winnersService = inject(WinnersService),
      garageService = inject(GarageService),
      engineService = inject(EngineService),
    ) => ({
      getCars() {
        garageService.getCars().subscribe((allCars: Car[]) => {
          patchState(store, {
            allCars: allCars,
            total: allCars.length,
          });
        });
      },

      getCarsAsGroup() {
        garageService
          .getPaginatedCars(store.page())
          .subscribe((response: HttpResponse<Car[]>) => {
            patchState(store, {
              groupCars: response.body || [],
              total: Number(response.headers.get('X-Total-Count')),
            });
          });
      },

      createCar(car: CarServer) {
        garageService
          .createCar({ name: car.name, color: car.color })
          .subscribe(() => {
            patchState(store, {
              total: store.total() + 1,
            });
          });

        this.getCarsAsGroup();
      },

      updateCar(car: CarServer) {
        garageService
          .updateCar({ name: car.name, color: car.color }, store.selectedId())
          .subscribe(() => {
            patchState(store, { selectedId: 0 });
          });

        this.getCarsAsGroup();
      },

      deleteCar() {
        winnersService.deleteWinner(store.selectedId()).subscribe(() => {});
        garageService.deleteCar(store.selectedId()).subscribe(() => {
          patchState(store, { selectedId: 0 });
        });

        this.getCarsAsGroup();
      },

      setSelectedId(id: number) {
        patchState(store, { selectedId: id });
      },

      setPage(pageNum: number) {
        patchState(store, { paginationIndex: pageNum, page: pageNum + 1 });

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
    }),
  ),
);
