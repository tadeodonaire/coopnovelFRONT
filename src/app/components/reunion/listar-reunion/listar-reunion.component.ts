import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Reunion } from '../../../models/reuniones';
import { ReunionService } from '../../../services/reunion.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listar-reunion',
  imports: [CommonModule, MatTableModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './listar-reunion.component.html',
  styleUrl: './listar-reunion.component.css'
})
export class ListarReunionComponent {
  dataSource: MatTableDataSource<Reunion> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];

  constructor(private reunionService: ReunionService) { }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.reunionService.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });

    this.reunionService.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.reunionService.delete(id).subscribe((data) => {
      this.reunionService.list().subscribe((data) => {
        this.reunionService.setList(data);
      });
    });
  }
}
