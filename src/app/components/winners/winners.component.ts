import {
  Component,
  AfterViewInit,
  OnInit,
  signal,
  WritableSignal,
  Signal,
  viewChild,
  effect,
  untracked,
  inject,
  computed,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Winner } from '../../models/winner';
import { WinnersService } from '../../services/winners/winners.service';
import { AppSettings } from '../../constants/app-settings';

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.css',
})
export class WinnersComponent implements OnInit, AfterViewInit {
  // services
  winnersService: WinnersService = inject(WinnersService);

  // properties
  readonly pageLimit = AppSettings.WINNERS_PAGE_LIMIT;

  winners: WritableSignal<Winner[]> = signal<Winner[]>([]);

  pageNumber: WritableSignal<number> = signal(1);

  pageInfo: Signal<string> = computed(() => `Page ${this.pageNumber()}`);

  nameWithCount: Signal<string> = computed(
    () => `Winners (${this.winners().length})`,
  );

  displayedColumns: string[] = ['id', 'car', 'name', 'wins', 'bestTime'];

  dataSource = new MatTableDataSource<Winner>();

  // paginator: Signal<MatPaginator> = viewChild.required(MatPaginator);

  constructor() {}

  ngOnInit(): void {
    this.getAllWinners();
  }

  ngAfterViewInit(): void {}

  // methods
  getAllWinners() {
    this.winnersService.getWinners().subscribe((winners: Winner[]) => {
      console.log(winners);
      this.winners.set(winners);
      this.dataSource.data = this.winners();
    });
  }
}
