import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Novelasbibliotecas } from '../../../models/novelasbibliotecas';
import { NovelasbibliotecasService } from '../../../services/novelasbibliotecas.service';

@Component({
  selector: 'app-listarnovelasbibliotecas',
  imports: [CommonModule, MatTableModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './listarnovelasbibliotecas.component.html',
  styleUrl: './listarnovelasbibliotecas.component.css'
})
export class ListarnovelasbibliotecasComponent {
  dataSource: MatTableDataSource<Novelasbibliotecas>= new MatTableDataSource()
  displayedColumns: string[]=['idNovelaBiblioteca', 'novela', 'biblioteca', 'editar', 'eliminar'];

  constructor(private nbS: NovelasbibliotecasService) {}

  ngOnInit(): void {
    this.nbS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.nbS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.nbS.deleteNovBib(id).subscribe((data) => {
      this.nbS.list().subscribe((data) => {
        this.nbS.setList(data);
      });
    });
  }

}
