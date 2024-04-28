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

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

import { randHex } from '@ngneat/falso';
import { randVehicle } from '@ngneat/falso';

import { CarComponent } from '../car/car.component';
import { GarageService } from '../../services/garage/garage.service';
import { Car } from '../../models/car';
import { CarAction } from '../../models/car-action';

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

  // properties
  paginator: Signal<MatPaginator> = viewChild.required(MatPaginator);

  isCarUpdate: WritableSignal<boolean> = signal(false);

  cars: WritableSignal<Car[]> = signal<Car[]>([]);

  pageNumber: WritableSignal<number> = signal(1);

  pageInfo: Signal<string> = computed(() => `Page ${this.pageNumber()}`);

  nameWithCount: Signal<string> = computed(
    () => `Garage (${this.cars().length})`,
  );

  newCarForm = new FormGroup({
    carName: new FormControl(''),
    carColor: new FormControl('#000000'),
  });

  updateCarForm = new FormGroup({
    carName: new FormControl({ value: '', disabled: true }),
    carColor: new FormControl({ value: '#000000', disabled: true }),
  });

  constructor() {}

  ngOnInit(): void {
    this.getAllCars();
  }

  // methods
  getAllCars() {
    this.garageService.getCars().subscribe((cars: Car[]) => {
      console.log(cars);
      this.cars.set(cars);
    });
  }

  onPaginatorPageChange(event: PageEvent) {
    console.log(event);
    this.pageNumber.set(event.pageIndex);
  }

  onCreateCar() {
    console.log(this.newCarForm.value);
    this.newCarForm.reset();
  }

  onUpdateCar() {
    console.log(this.updateCarForm.value);
    this.updateCarForm.reset();
    this.updateCarForm.disable();
    this.isCarUpdate.set(false);
  }

  onGenerateCars() {
    console.log(randHex({ length: 100 }));
    console.log(randVehicle({ length: 100 }));
  }

  onCarAction(event: CarAction) {
    console.log(event);

    if (event.action === 'update') {
      this.isCarUpdate.set(true);
      this.updateCarForm.enable();
    }
  }
}
