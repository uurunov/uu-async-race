import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { randHex } from '@ngneat/falso';
import { randVehicle } from '@ngneat/falso';

import { CarComponent } from '../car/car.component';
import { GarageService } from '../../services/garage/garage.service';
import { CarAction } from '../../models/car-action';
import { AppSettings } from '../../constants/app-settings';
import { WinnersService } from '../../services/winners/winners.service';
import { AppStore } from '../../stores/app.store';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

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
  // stores
  readonly store = inject(AppStore);

  // services
  garageService: GarageService = inject(GarageService);
  winnersService: WinnersService = inject(WinnersService);
  snackBar: MatSnackBar = inject(MatSnackBar);
  router: Router = inject(Router);

  // properties
  readonly pageLimit = AppSettings.GARAGE_PAGE_LIMIT;
  isStartRacing: WritableSignal<boolean> = signal(false);
  onFormControl: WritableSignal<boolean> = signal(false);

  newCarForm = new FormGroup({
    name: new FormControl<string>(this.store.newCarForm.name(), {
      nonNullable: true,
    }),
    color: new FormControl<string>(this.store.newCarForm.color(), {
      nonNullable: true,
    }),
  });

  updateCarForm = new FormGroup({
    name: new FormControl<string>(
      {
        value: this.store.updateCarForm.name(),
        disabled: this.store.updateCarForm.disabled(),
      },
      { nonNullable: true },
    ),
    color: new FormControl<string>(
      {
        value: this.store.updateCarForm.color(),
        disabled: this.store.updateCarForm.disabled(),
      },
      { nonNullable: true },
    ),
  });

  constructor() {}

  ngOnInit(): void {
    this.fetchCars();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        // this only fires for `NavigationStart` and no other events
        this.onNewCarForm();
        this.onUpdateCarForm();
      });
  }

  // methods
  fetchCars() {
    this.store.getCarsAsGroup();
  }

  onCreateCar() {
    this.store.createCar({
      name: `${this.newCarForm.value.name}`,
      color: `${this.newCarForm.value.color}`,
    });

    this.newCarForm.setValue({
      name: `${AppSettings.CAR_NAME_DEFAULT}`,
      color: `${AppSettings.CAR_COLOR_DEFAULT}`,
    });

    this.setCreateCarForm(
      `${AppSettings.CAR_NAME_DEFAULT}`,
      `${AppSettings.CAR_COLOR_DEFAULT}`,
    );
  }

  onUpdateCar() {
    this.store.updateCar({
      name: `${this.updateCarForm.value.name}`,
      color: `${this.updateCarForm.value.color}`,
    });

    this.updateCarForm.setValue({
      name: `${AppSettings.CAR_NAME_DEFAULT}`,
      color: `${AppSettings.CAR_COLOR_DEFAULT}`,
    });

    this.updateCarForm.disable();

    this.setUpdateCarForm(
      `${AppSettings.CAR_NAME_DEFAULT}`,
      `${AppSettings.CAR_COLOR_DEFAULT}`,
      true,
    );
  }

  onDeleteCar() {
    this.store.deleteCar();
  }

  onGenerateCars() {
    const randomColors: string[] = randHex({ length: 100 });
    const randomCarNames: string[] = randVehicle({ length: 100 });

    for (let i = 0; i < AppSettings.RANDOM_CARS_COUNT; i++) {
      this.store.createCar({ name: randomCarNames[i], color: randomColors[i] });
    }

    this.fetchCars();
  }

  onCarAction(event: CarAction) {
    if (event.action === 'update') {
      this.store.setSelectedCarId(event.id);
      this.updateCarForm.enable();
      this.updateCarForm.patchValue({ color: event.color });
      this.updateCarForm.patchValue({ name: event.name });
      this.snackBar.open(
        `You selected ${event.name.toUpperCase()} with ID ${event.id}`,
        '',
        {
          duration: 2000,
        },
      );
    } else if (event.action === 'winner') {
      this.snackBar.open(
        `Winner: ${event.name.toUpperCase()} with ID ${event.id}`,
        '',
        {
          duration: 5000,
        },
      );
    } else {
      this.onDeleteCar();
    }
  }

  onPaginatorPageChange(event: PageEvent) {
    this.store.setGaragePaginationPage(event.pageIndex);
    this.store.setWinnerState(false);
  }

  onNewCarForm() {
    this.setCreateCarForm(
      `${this.newCarForm.value.name}`,
      `${this.newCarForm.value.color}`,
    );
  }

  onUpdateCarForm() {
    this.setUpdateCarForm(
      `${this.updateCarForm.value.name}`,
      `${this.updateCarForm.value.color}`,
      this.updateCarForm.disabled,
    );
    this.onFormControl.set(false);
  }

  setCreateCarForm(carName: string, carColor: string) {
    this.store.setNewCarForm({
      name: carName,
      color: carColor,
    });
  }

  setUpdateCarForm(carName: string, carColor: string, isFormDisabled: boolean) {
    this.store.setUpdateCarForm(
      {
        name: carName,
        color: carColor,
      },
      isFormDisabled,
    );
  }

  onStartRacing() {
    this.isStartRacing.set(true);
  }

  onResetRacing() {
    this.isStartRacing.set(false);
  }

  onFormControlChange() {
    this.onFormControl.set(true);
  }
}
