import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Proyecto } from '../../../models/proyecto';
import { ProyectoService } from '../../../services/proyecto.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-listarproyectos',
  imports: [MatTableModule, CommonModule,MatButtonModule,RouterLink, MatIconModule, MatPaginatorModule],
  templateUrl: './listarproyectos.component.html',
  styleUrl: './listarproyectos.component.css'
})
export class ListarproyectosComponent implements OnInit, AfterViewInit{
  dataSource:MatTableDataSource<Proyecto>=new MatTableDataSource();
  displayedColumns:string[]=["c1","c2","c3","c4","c5","c6"];

  constructor(private pS:ProyectoService){}

  ngOnInit(): void {
    this.pS.list().subscribe((data=>{
      this.dataSource=new MatTableDataSource(data);
    }));
    this.pS.getList().subscribe((data=>{
      this.dataSource=new MatTableDataSource(data);
    }));
  }

  eliminar(id:number){
    this.pS.deleteP(id).subscribe((data)=>{
      this.pS.list().subscribe((data)=>{
        this.pS.setList(data);
      });
    });
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}}



