import { Component, OnInit, ViewChild } from '@angular/core';
import { Novela } from '../../../models/novela';
import { NovelaService } from '../../../services/novela.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listarnovela',
  imports: [MatTableModule, CommonModule,MatButtonModule,RouterLink, MatIconModule, MatPaginatorModule],
  templateUrl: './listarnovela.component.html',
  styleUrl: './listarnovela.component.css'
})
export class ListarnovelaComponent implements OnInit{
  dataSource:MatTableDataSource<Novela>=new MatTableDataSource();
  displayedColumns:string[]=["c1","c2","c3","c4","c5","c6", "c7"];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private nS:NovelaService, private snacbar: MatSnackBar){}

  ngOnInit(): void {
    this.nS.list().subscribe((data=>{
      this.nS.setList(data);
    }));
    this.nS.getList().subscribe((data=>{
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    }));
  }

  eliminar(id:number){
    this.nS.deleteN(id).subscribe((data)=>{
      this.nS.list().subscribe((data)=>{
        this.nS.setList(data);
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
