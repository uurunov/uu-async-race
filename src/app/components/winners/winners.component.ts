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
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Winner } from '../../models/winner';
import { WinnersService } from '../../services/winners/winners.service';

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './winners.component.html',
  styleUrl: './winners.component.css',
})
export class WinnersComponent implements OnInit, AfterViewInit {
  name: string = 'Winners';
  pageNumber: number = 1;

  displayedColumns: string[] = ['id', 'car', 'name', 'wins', 'bestTime'];

  winners: WritableSignal<Winner[]> = signal<Winner[]>([]);
  paginator: Signal<MatPaginator> = viewChild.required(MatPaginator);
  dataSource = new MatTableDataSource<Winner>();

  constructor(private winnersService: WinnersService) {
    effect(() => {
      this.paginator();

      untracked(() => (this.dataSource.paginator = this.paginator()));
    });
  }

  ngOnInit(): void {
    this.getAllWinners();
  }

  ngAfterViewInit(): void {}

  getAllWinners() {
    this.winnersService.getWinners().subscribe((winners: Winner[]) => {
      console.log(winners);
      this.winners.set(winners);
      this.dataSource.data = this.winners();
    });
  }
}
