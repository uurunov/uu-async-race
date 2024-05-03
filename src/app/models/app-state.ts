import { Car } from './car';

export interface AppState {
  allCars: Car[];
  groupCars: Car[];
  paginationIndex: number;
  page: number;
  total: number;
  selectedId: number;
  newCarForm: { name: string; color: string };
  updateCarForm: { name: string; color: string; disabled: boolean };
}
