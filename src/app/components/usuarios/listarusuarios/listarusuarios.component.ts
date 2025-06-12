import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../models/usuarios';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listarusuarios',
  imports: [CommonModule,MatTableModule,RouterModule],
  templateUrl: './listarusuarios.component.html',
  styleUrl: './listarusuarios.component.css'
})
export class ListarusuariosComponent implements OnInit{
  dataSource:MatTableDataSource<Usuario>=new MatTableDataSource()
  displayedColumns:string[]=["id","nombre","apellido","birthday","correo","usuario","estado"]

  constructor(private uS:UsuariosService) {}

  ngOnInit(): void {
    this.uS.list().subscribe(data=>{
      this.dataSource = new MatTableDataSource(data)
    })
  }

}
