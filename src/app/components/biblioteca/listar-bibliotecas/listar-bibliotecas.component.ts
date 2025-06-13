import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Biblioteca } from '../../../models/biblioteca';
import { BibliotecaService } from '../../../services/biblioteca.service';



@Component({
  selector: 'app-listar-bibliotecas',
  imports: [CommonModule,MatTableModule,RouterModule],
  templateUrl: './listar-bibliotecas.component.html',
  styleUrl: './listar-bibliotecas.component.css'
})
export class ListarBibliotecasComponent implements OnInit{

  dataSource:MatTableDataSource<Biblioteca>=new MatTableDataSource()
  displayedColumns:string[]=["id","nombre"]

  constructor(private bS:BibliotecaService) {}

  ngOnInit(): void {
    this.bS.list().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data)
    })
  }
  

}
