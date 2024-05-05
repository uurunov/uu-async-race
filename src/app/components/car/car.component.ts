import {
  Component,
  ElementRef,
  WritableSignal,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
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
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css',
  animations: [
    trigger('readyGo', [
      state('stopped', style({ left: 0 })),
      state('started', style({ left: '{{leftValue}}%' }), {
        params: { leftValue: 97 },
      }),
      transition('stopped => started', [animate('{{time}}s ease-in')]),
      transition('started => stopped', [animate('0.1s ease-in')]),
    ]),
  ],
})
export class CarComponent {
  // stores
  readonly store = inject(AppStore);

  leftValue: number = 97;

  // services
  engineService: EngineService = inject(EngineService);

  // properties
  carInfo = input.required<Car>();
  onAction = output<CarAction>();
  carRacingState: WritableSignal<string> = signal('stopped');
  timing: WritableSignal<number> = signal(0);
  setReadyGo = model<boolean>(false);
  isThereWinner: WritableSignal<boolean> = signal(false);
  carRoadElement = viewChild<ElementRef>('carRoad');
  singleCarRaceState: WritableSignal<boolean> = signal(false);

  constructor() {
    effect(
      () => {
        if (this.setReadyGo()) {
          // start racing
          this.startCarRace({
            id: this.carInfo().id,
            name: this.carInfo().name,
            action: 'started',
            color: this.carInfo().color,
          });
        } else {
          // race is reset
          this.carRacingState.set('stopped');
          this.store.setWinnerState(false);
        }
      },
      { allowSignalWrites: true },
    );
  }

  // methods
  startCarRace(actionData: CarAction) {
    this.engineService
      .startStopCarEngine({ id: actionData.id, status: actionData.action })
      .subscribe((engineInfo: CarEngine) => {
        // console.log('Engine Started: ', actionData.id, engineInfo);
        const timing = Math.round(
          engineInfo.distance / engineInfo.velocity / 1000,
        );
        this.timing.set(timing);
        this.carRacingState.set(actionData.action); // animation starts
        this.engineService
          .switchToDriveMode({
            id: actionData.id,
            status: 'drive',
          })
          .subscribe({
            next: (response) => {
              // console.log('Drive Success: ', response);
              if (this.setReadyGo() && !this.store.isThereWinner()) {
                console.log('Cars Race Has Finished!', actionData.id, timing);
                this.store.setWinnerState(true);
                this.onAction.emit({
                  id: actionData.id,
                  name: actionData.name,
                  action: 'winner',
                  color: actionData.color,
                });
                this.store.processWinner({
                  id: actionData.id,
                  wins: 1,
                  time: timing,
                });
              }
            },
            error: (err) => {
              // console.log('Drive Failed: ', err);
              this.carRacingState.set('stopped');
            },
          });
      });
  }

  onActionBtn(actionData: CarAction) {
    if (actionData.action === 'started') {
      // this.store.setSingleCarRaceState(true);
      this.singleCarRaceState.set(true);
      this.engineService
        .startStopCarEngine({ id: actionData.id, status: actionData.action })
        .subscribe((engineInfo: CarEngine) => {
          // console.log('Engine Started: ', actionData.id, engineInfo);
          const timing = Math.round(
            engineInfo.distance / engineInfo.velocity / 1000,
          );
          this.timing.set(timing);
          this.carRacingState.set(actionData.action); // animation starts
          this.engineService
            .switchToDriveMode({
              id: actionData.id,
              status: 'drive',
            })
            .subscribe({
              next: (response) => {
                // console.log('Drive Success: ', response);
                console.log(
                  'Single Car Race Has Finished!',
                  actionData.id,
                  timing,
                );
              },
              error: (err) => {
                // console.log('Drive Failed: ', err);
                this.carRacingState.set('stopped');
                this.singleCarRaceState.set(false);
              },
            });
        });
    } else if (actionData.action === 'stopped') {
      this.engineService
        .startStopCarEngine({ id: actionData.id, status: actionData.action })
        .subscribe((response: CarEngine) => {
          console.log('Engine Stopped: ', response);
          this.carRacingState.set(actionData.action); // animation stops
          this.singleCarRaceState.set(false);
        });
    } else {
      this.onAction.emit(actionData);
    }
  }

  getLeftValue() {
    const containerWidth = this.carRoadElement()?.nativeElement.clientWidth;
    return ((containerWidth - 48) * 100) / containerWidth;
  }
}
