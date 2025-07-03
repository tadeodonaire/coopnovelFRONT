import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Suscripciones } from '../../../models/suscripciones';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SuscripcionesService } from '../../../services/suscripciones.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listarsuscripciones',
  imports: [MatTableModule, 
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './listarsuscripciones.component.html',
  styleUrl: './listarsuscripciones.component.css'
})
export class ListarsuscripcionesComponent implements OnInit{
  dataSource: MatTableDataSource<Suscripciones>= new MatTableDataSource();
  displayedColumns: string[] = ['idSuscripcion', 'susFechaInicio', 'suscriptor', 'suscrito', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private sS: SuscripcionesService, private snacbar: MatSnackBar){}

  ngOnInit(): void {
      this.sS.list().subscribe((data)=>{
        this.sS.setList(data);
      });
      this.sS.getList().subscribe((data)=>{
        console.log('Datos recibidos', data);
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
      });
  }

  eliminar(id: number){
    this.sS.deleteSus(id).subscribe(()=>{
      this.sS.list().subscribe((data)=>{
        this.sS.setList(data);
      });
      this.snacbar.open('Suscripción eliminada', 'Cerrar', {
        duration: 2000,
        verticalPosition: 'top',
      });
    });
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
    }

  applyFilter(value: string){
      this.dataSource.filter= value.trim().toLowerCase();
      if(this.dataSource.paginator){
        this.dataSource.paginator.firstPage();
    }}
}
