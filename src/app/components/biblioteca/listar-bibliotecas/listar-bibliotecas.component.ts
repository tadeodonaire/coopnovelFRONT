import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RouterLink, RouterModule } from '@angular/router';
import { Biblioteca } from '../../../models/biblioteca';
import { BibliotecaService } from '../../../services/biblioteca.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-listar-bibliotecas',
  imports: [    
    MatTableModule,
    CommonModule,
    MatButtonModule,
    RouterLink,
    MatIconModule,],
  templateUrl: './listar-bibliotecas.component.html',
  styleUrl: './listar-bibliotecas.component.css'
})
export class ListarBibliotecasComponent implements OnInit{

  dataSource:MatTableDataSource<Biblioteca>=new MatTableDataSource()
  displayedColumns:string[]=["id","nombre","actualizar","eliminar"]

  constructor(private bS:BibliotecaService) {}

  ngOnInit(): void {
    this.bS.list().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data)
    });
    
    this.bS.getList().subscribe((data)=>{
      this.dataSource= new MatTableDataSource(data);
    });
  }
    eliminar(id: number) {
    this.bS.delete(id).subscribe((data) => {
      this.bS.list().subscribe((data) => {
        this.bS.setList(data);
      });
    });
  }
  

}
