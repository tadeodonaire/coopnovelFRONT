import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CorreccionesIA } from '../../../models/correccionesIA';
import { CorreccionIAService } from '../../../services/correccion-ia.service';

@Component({
  selector: 'app-listarcorrecciones-ia',
  imports: [CommonModule, MatTableModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './listarcorrecciones-ia.component.html',
  styleUrl: './listarcorrecciones-ia.component.css'
})
export class ListarcorreccionesIAComponent {
  dataSource: MatTableDataSource<CorreccionesIA>=new MatTableDataSource()
  displayedColumns: string[] = ["capitulo", "id", "correccion", "editar", "eliminar"];

  constructor(private coS:CorreccionIAService) {}

  ngOnInit(): void {
    this.coS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.coS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id:number){
    this.coS.deleteCorreccionIA(id).subscribe((data) => {
      this.coS.list().subscribe((data) => {
        this.coS.setList(data);
      });
    })
  }
}
