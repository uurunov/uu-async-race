import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Car } from '../../models/car';
import { CarAction } from '../../models/car-action';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css',
})
export class CarComponent {
  carInfo = input.required<Car>();

  onAction = output<CarAction>();

  onActionBtn(actionData: CarAction) {
    this.onAction.emit(actionData);
  }
}
