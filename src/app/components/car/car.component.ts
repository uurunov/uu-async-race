import {
  Component,
  WritableSignal,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Car } from '../../models/car';
import { CarAction } from '../../models/car-action';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { EngineService } from '../../services/engine/engine.service';
import { CarEngine } from '../../models/car-engine';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css',
  animations: [
    trigger('readyGo', [
      state('stopped', style({ left: 0 })),
      state('started', style({ left: '95%' })),
      transition('stopped => started', [animate('{{time}}s ease-in')]),
      transition('started => stopped', [animate('0.1s ease-in')]),
    ]),
  ],
})
export class CarComponent {
  // services
  engineService: EngineService = inject(EngineService);

  // properties
  carInfo = input.required<Car>();
  onAction = output<CarAction>();
  carRacingState: WritableSignal<string> = signal('stopped');
  timing: WritableSignal<number> = signal(0);
  setReadyGo = input<boolean>(false);

  constructor() {
    effect(
      () => {
        if (this.setReadyGo()) {
          // start racing
          this.startCarRace({
            id: this.carInfo().id,
            name: this.carInfo().name,
            action: 'started',
          });
        } else {
          this.carRacingState.set('stopped');
        }
      },
      { allowSignalWrites: true },
    );
  }

  // methods
  startCarRace(actionData: CarAction) {
    this.engineService
      .startStopCarEngine({ id: actionData.id, status: actionData.action })
      .subscribe((response: CarEngine) => {
        console.log('Engine Started: ', response);
        this.timing.set(
          Math.round(response.distance / response.velocity / 1000),
        );
        this.carRacingState.set(actionData.action); // animation starts
        this.engineService
          .switchToDriveMode({
            id: actionData.id,
            status: 'drive',
          })
          .subscribe({
            next: (response) => console.log('Drive Success: ', response),
            error: (err) => {
              console.log('Drive Failed: ', err);
              this.carRacingState.set('stopped');
            },
          });
      });
  }

  onActionBtn(actionData: CarAction) {
    if (actionData.action === 'started') {
      this.startCarRace(actionData);
    } else if (actionData.action === 'stopped') {
      this.engineService
        .startStopCarEngine({ id: actionData.id, status: actionData.action })
        .subscribe((response: CarEngine) => {
          console.log('Engine Stopped: ', response);
          this.carRacingState.set(actionData.action); // animation stops
        });
    } else {
      this.onAction.emit(actionData);
    }
  }
}
