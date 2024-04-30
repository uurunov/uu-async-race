import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

import { randHex } from '@ngneat/falso';
import { randVehicle } from '@ngneat/falso';

import { CarComponent } from '../car/car.component';
import { GarageService } from '../../services/garage/garage.service';
import { Car } from '../../models/car';
import { CarAction } from '../../models/car-action';
import { AppSettings } from '../../constants/app-settings';
import { WinnersService } from '../../services/winners/winners.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-garage',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    CarComponent,
    MatTooltipModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.css',
})
export class GarageComponent implements OnInit {
  // services
  garageService: GarageService = inject(GarageService);
  winnersService: WinnersService = inject(WinnersService);

  // properties
  readonly pageLimit = AppSettings.GARAGE_PAGE_LIMIT;
  cars: WritableSignal<Car[]> = signal<Car[]>([]);
  pageNumber: WritableSignal<number> = signal(1);
  carIdOnAction: WritableSignal<number> = signal(0);
  pageInfo: Signal<string> = computed(() => `Page ${this.pageNumber()}`);
  nameWithCount: Signal<string> = computed(
    () => `Garage (${this.cars().length})`,
  );
  newCarForm = new FormGroup({
    name: new FormControl<string>('', { nonNullable: true }),
    color: new FormControl<string>('#000000', { nonNullable: true }),
  });
  updateCarForm = new FormGroup({
    name: new FormControl<string>(
      { value: '', disabled: true },
      { nonNullable: true },
    ),
    color: new FormControl<string>(
      {
        value: '#000000',
        disabled: true,
      },
      { nonNullable: true },
    ),
  });
  // paginator: Signal<MatPaginator> = viewChild.required(MatPaginator);

  constructor() {
    effect(() => {});
  }

  ngOnInit(): void {
    this.getAllCars();
  }

  // methods
  getAllCars() {
    this.garageService.getCars().subscribe((cars: Car[]) => {
      this.cars.set(cars);
    });
  }

  onCreateCar() {
    const carName: string = `${this.newCarForm.value.name}`;
    const carColor: string = `${this.newCarForm.value.color}`;

    this.garageService
      .createCar({ name: carName, color: carColor })
      .subscribe((newcar: Car) => {
        this.cars.update((values: Car[]) => [...values, newcar]);
      });
    this.newCarForm.reset();
  }

  onUpdateCar() {
    const carName: string = `${this.updateCarForm.value.name}`;
    const carColor: string = `${this.updateCarForm.value.color}`;

    this.garageService
      .updateCar({ name: carName, color: carColor }, this.carIdOnAction())
      .subscribe((updatedCar: Car) => {
        this.cars.update((allCars: Car[]) => {
          const modifiedCarIndex: number = allCars.findIndex(
            (car) => car.id === this.carIdOnAction(),
          );
          allCars[modifiedCarIndex].color = updatedCar.color;
          allCars[modifiedCarIndex].name = updatedCar.name;
          return [...allCars];
        });
        this.carIdOnAction.set(0);
      });

    this.updateCarForm.reset();
    this.updateCarForm.disable();
  }

  onDeleteCar() {
    this.garageService.deleteCar(this.carIdOnAction()).subscribe(() => {
      this.cars.update((allCars: Car[]) => {
        const modifiedCarIndex: number = allCars.findIndex(
          (car) => car.id === this.carIdOnAction(),
        );
        allCars.splice(modifiedCarIndex, 1);
        return [...allCars];
      });
      this.winnersService
        .deleteWinner(this.carIdOnAction())
        .subscribe(() => {});
      this.carIdOnAction.set(0);
    });
  }

  onGenerateCars() {
    const randomColors: string[] = randHex({ length: 100 });
    const randomCarNames: string[] = randVehicle({ length: 100 });

    for (let i = 0; i < AppSettings.RANDOM_CARS_COUNT; i++) {
      this.garageService
        .createCar({ name: randomCarNames[i], color: randomColors[i] })
        .subscribe((newcar: Car) => {
          this.cars.update((values: Car[]) => [...values, newcar]);
        });
    }
  }

  onCarAction(event: CarAction) {
    this.carIdOnAction.set(event.id);
    if (event.action === 'update') {
      this.updateCarForm.enable();
    } else if (event.action === 'delete') {
      this.onDeleteCar();
    }
  }

  onPaginatorPageChange(event: PageEvent) {
    this.pageNumber.set(event.pageIndex + 1);
  }
}
