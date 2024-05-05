import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { WinnersService } from '../../services/winners/winners.service';
import { AppSettings } from '../../constants/app-settings';
import { AppStore } from '../../stores/app.store';
import { GarageService } from '../../services/garage/garage.service';

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIconModule],
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.css',
})
export class WinnersComponent implements OnInit {
  // stores
  readonly store = inject(AppStore);

  // services
  winnersService: WinnersService = inject(WinnersService);
  garageService: GarageService = inject(GarageService);

  // properties
  readonly pageLimit = AppSettings.WINNERS_PAGE_LIMIT;
  displayedColumns: string[] = ['id', 'car', 'name', 'wins', 'time'];

  constructor() {}

  ngOnInit(): void {
    this.fetchWinners();
  }

  // methods
  fetchWinners() {
    this.store.getWinnersAsGroup();
  }

  onPaginatorPageChange(event: PageEvent) {
    this.store.setWinnersPaginationPage(event.pageIndex);
  }

  onSortTable(event: Sort) {
    this.store.setWinnersSortState(event);
  }
}
