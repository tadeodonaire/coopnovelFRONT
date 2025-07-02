import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Proyecto } from '../../../models/proyecto';
import { ProyectoService } from '../../../services/proyecto.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-listarproyectos',
  imports: [MatTableModule, CommonModule,MatButtonModule,RouterLink, MatIconModule, MatPaginatorModule],
  templateUrl: './listarproyectos.component.html',
  styleUrl: './listarproyectos.component.css'
})
export class ListarproyectosComponent implements OnInit{
  dataSource:MatTableDataSource<Proyecto>=new MatTableDataSource();
  displayedColumns:string[]=["c1","c2","c3","c4","c5","c6"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pS:ProyectoService, private snacbar: MatSnackBar){}

  ngOnInit(): void {
    this.pS.list().subscribe((data=>{
      this.pS.setList(data);
    }));
    this.pS.getList().subscribe((data=>{
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }));
  }

  eliminar(id:number){
    this.pS.deleteP(id).subscribe((data)=>{
      this.pS.list().subscribe((data)=>{
        this.pS.setList(data);
      });
    });

    this.snacbar.open('Se eliminó correctamente', 'Cerrar', {
    duration: 3000,
    verticalPosition: 'top',
    });
  }

  ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Reiniciar al inicio de paginado
    }
  }

}



