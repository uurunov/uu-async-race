import { Car } from './car';
import { WinnerUi } from './winner-ui';

export interface AppState {
  cars: Car[];
  garagePaginationIndex: number;
  garagePaginationPage: number;
  totalCarsCount: number;
  selectedCarId: number;
  newCarForm: { name: string; color: string };
  updateCarForm: { name: string; color: string; disabled: boolean };
  winners: WinnerUi[];
  winnersPaginationIndex: number;
  winnersPaginationPage: number;
  totalWinnersCount: number;
  winnersSortElement: string;
  winnersSortOrder: string;
  isThereWinner: boolean;
}
